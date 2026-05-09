import { Controller, Post, Get, Body, Headers, Req, UseGuards, BadRequestException } from "@nestjs/common";
import { BillService } from "./bill.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import type { Request } from "express";

@Controller('bill')
export class BillController {
    constructor(private readonly billService: BillService) { }

    @Post('checkout')
    @UseGuards(JwtAuthGuard)
    async createCheckout(
        @CurrentUser('id') userId: string,
        @Body('plan') plan: 'PRO' | 'ENTERPRISE',
    ) {
        if (!plan || !['PRO', 'ENTERPRISE'].includes(plan)) {
            throw new BadRequestException('Plan must be PRO or ENTERPRISE');
        }
        return this.billService.createCheckout(userId, plan);
    }

    @Post('webhook')
    async handleWebhook(
        @Req() req: Request,
        @Headers('x-signature') signature: string,
    ) {
        const rawBody = (req as any).rawBody;
        if (!rawBody) {
            throw new BadRequestException('Raw body is required for webhook verification');
        }
        return this.billService.handleWebhook(rawBody, signature);
    }

    @Get('subscription')
    @UseGuards(JwtAuthGuard)
    async getSubscription(@CurrentUser('id') userId: string) {
        return this.billService.getSubscription(userId);
    }
}