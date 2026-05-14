import { Injectable, Logger, BadRequestException, ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import * as crypto from "crypto";

@Injectable()
export class BillService {
    private readonly logger = new Logger(BillService.name);
    private readonly apiKey: string;
    private readonly storeId: string;
    private readonly proVariantId: string;
    private readonly enterpriseVariantId: string;
    private readonly webhookSecret: string;
    private readonly apiBase = "https://api.lemonsqueezy.com/v1";

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) {
        this.apiKey = this.configService.get<string>("LEMONSQUEEZY_API_KEY") || "";
        this.storeId = this.configService.get<string>("LEMONSQUEEZY_STORE_ID") || "";
        this.proVariantId = this.configService.get<string>("LEMONSQUEEZY_PRO_VARIANT_ID") || "";
        this.enterpriseVariantId = this.configService.get<string>("LEMONSQUEEZY_ENTERPRISE_VARIANT_ID") || "";
        this.webhookSecret = this.configService.get<string>("LEMONSQUEEZY_WEBHOOK_SECRET") || "";
    }

    // --- Checkout ---

    async createCheckout(userId: string, plan: "PRO" | "ENTERPRISE") {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new BadRequestException("User not found");

        const variantId = plan === "PRO" ? this.proVariantId : this.enterpriseVariantId;

        const body = {
            data: {
                type: "checkouts",
                attributes: {
                    checkout_data: {
                        email: user.email,
                        custom: { user_id: userId },
                    },
                    product_options: {
                        redirect_url: `${this.configService.get("FRONTEND_URL")}/dashboard/billing?success=true`,
                    },
                },
                relationships: {
                    store: { data: { type: "stores", id: this.storeId } },
                    variant: { data: { type: "variants", id: variantId } },
                },
            },
        };

        const response = await fetch(`${this.apiBase}/checkouts`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                Accept: "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.text();
            this.logger.error(`LemonSqueezy checkout failed: ${error}`);
            throw new BadRequestException("Failed to create checkout session");
        }

        const result = await response.json();
        return { checkoutUrl: result.data.attributes.url };
    }

    // --- Webhook ---

    verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
        if (!this.webhookSecret) {
            this.logger.warn("Webhook secret not configured");
            return false;
        }

        const hmac = crypto.createHmac("sha256", this.webhookSecret);
        const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
        const signatureBuffer = Buffer.from(signature || "", "utf8");

        if (digest.length !== signatureBuffer.length) return false;

        return crypto.timingSafeEqual(digest, signatureBuffer);
    }

    async handleWebhook(rawBody: Buffer, signature: string) {
        if (!this.verifyWebhookSignature(rawBody, signature)) {
            throw new BadRequestException("Invalid webhook signature");
        }

        const event = JSON.parse(rawBody.toString());
        const eventName = event.meta.event_name;
        const data = event.data;
        const userId = event.meta.custom_data?.user_id;

        this.logger.log(`Webhook received: ${eventName}`);

        switch (eventName) {
            case "subscription_created":
                await this.handleSubscriptionCreated(data, userId);
                break;
            case "subscription_updated":
                await this.handleSubscriptionUpdated(data, userId);
                break;
            default:
                this.logger.log(`Unhandled webhook event: ${eventName}`);
        }

        return { received: true };
    }

    private async handleSubscriptionCreated(data: any, userId: string) {
        if (!userId) {
            this.logger.error("No user_id in webhook custom_data");
            return;
        }

        const attrs = data.attributes;
        const plan = this.getPlanFromVariantId(String(attrs.variant_id));

        await this.prisma.$transaction([
            this.prisma.subscription.upsert({
                where: { userId },
                create: {
                    userId,
                    CustomerId: String(attrs.customer_id),
                    SubId: String(data.id),
                    status: "ACTIVE",
                    plan,
                    currentPeriodStart: attrs.current_period_start ? new Date(attrs.current_period_start) : null,
                    currentPeriodEnd: attrs.current_period_end ? new Date(attrs.current_period_end) : null,
                },
                update: {
                    CustomerId: String(attrs.customer_id),
                    SubId: String(data.id),
                    status: "ACTIVE",
                    plan,
                    currentPeriodStart: attrs.current_period_start ? new Date(attrs.current_period_start) : null,
                    currentPeriodEnd: attrs.current_period_end ? new Date(attrs.current_period_end) : null,
                },
            }),
            this.prisma.user.update({
                where: { id: userId },
                data: { plan: plan },
            }),
        ]);

        this.logger.log(`Subscription created for user ${userId}: ${plan}`);
    }

    private async handleSubscriptionUpdated(data: any, userId: string) {
        const attrs = data.attributes;
        const SubId = String(data.id);


        const subscription = userId
            ? await this.prisma.subscription.findUnique({ where: { userId } })
            : await this.prisma.subscription.findUnique({ where: { SubId } });

        if (!subscription) {
            this.logger.error(`Subscription not found for update: ${SubId}`);
            return;
        }

        const status = attrs.status === "active" ? "ACTIVE"
            : attrs.status === "cancelled" ? "CANCELLED"
                : "INACTIVE";

        const plan = this.getPlanFromVariantId(String(attrs.variant_id));

        await this.prisma.$transaction([
            this.prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    status,
                    plan,
                    currentPeriodStart: attrs.current_period_start ? new Date(attrs.current_period_start) : null,
                    currentPeriodEnd: attrs.current_period_end ? new Date(attrs.current_period_end) : null,
                },
            }),
            this.prisma.user.update({
                where: { id: subscription.userId },
                data: { plan: status === "CANCELLED" ? "FREE" : plan },
            }),
        ]);

        this.logger.log(`Subscription updated: ${subscription.userId} → ${status} (${plan})`);
    }

    private getPlanFromVariantId(variantId: string): "FREE" | "PRO" | "ENTERPRISE" {
        if (variantId === this.proVariantId) return "PRO";
        if (variantId === this.enterpriseVariantId) return "ENTERPRISE";
        return "FREE";
    }

    // --- Get Subscription ---

    async getSubscription(userId: string) {
        try {
            this.logger.log(`Fetching subscription for user: ${userId}`);
            const subscription = await this.prisma.subscription.findUnique({
                where: { userId },
            });

            if (!subscription) {
                return {
                    plan: "FREE",
                    status: "ACTIVE",
                    currentPeriodEnd: null,
                };
            }

            return subscription;
        } catch (error) {
            this.logger.error(`Failed to get subscription: ${error.message}`, error.stack);
            throw error;
        }
    }
}