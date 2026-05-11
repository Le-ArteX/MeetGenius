import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateWorkspaceDto, InviteUserDto, UpdateWorkspaceDto } from "./dto/workspace.dto";
import * as crypto from 'crypto';
import { MailService } from "../mail/mail.service";

@Injectable()
export class WorkspaceService {
    private readonly logger = new Logger(WorkspaceService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService
    ) { }

    async create(userId: string, dto: CreateWorkspaceDto) {
        return this.prisma.$transaction(async (tx) => {
            const workspace = await tx.workspace.create({
                data: {
                    name: dto.name,
                    ownerId: userId,
                },
            });

            await tx.workspaceMember.create({
                data: {
                    userId,
                    workspaceId: workspace.id,
                    role: 'OWNER',
                },
            });

            return workspace;
        });
    }

    async findAll(userId: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const where = {
            members: {
                some: { userId }
            }
        };

        const [data, total] = await Promise.all([
            this.prisma.workspace.findMany({
                where,
                include: {
                    members: {
                        where: { userId },
                        select: { role: true },
                    },
                    _count: {
                        select: { notes: true, members: true }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.workspace.count({ where }),
        ]);

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async update(userId: string, id: string, dto: UpdateWorkspaceDto) {
        await this.checkPermission(userId, id, ['OWNER', 'EDITOR']);
        return this.prisma.workspace.update({
            where: { id },
            data: { name: dto.name },
        });
    }

    async remove(userId: string, id: string) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id },
            select: { ownerId: true }
        });

        if (!workspace) throw new NotFoundException('Workspace not found');
        if (workspace.ownerId !== userId) {
            throw new ForbiddenException('Only the owner can delete this workspace');
        }

        return this.prisma.workspace.delete({
            where: { id },
        });
    }



    async invite(userId: string, workspaceId: string, dto: InviteUserDto) {
        const inviter = await this.prisma.user.findUnique({ where: { id: userId } });
        const workspace = await this.prisma.workspace.findUnique({ where: { id: workspaceId } });

        if (!workspace) throw new NotFoundException('Workspace not found');

        await this.checkPermission(userId, workspaceId, ['OWNER', 'EDITOR']);


        const existingMember = await this.prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                user: { email: dto.email }
            }
        });

        if (existingMember) {
            throw new BadRequestException('User is already a member of this workspace');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const invitation = await this.prisma.invitation.create({
            data: {
                workspaceId,
                invitedBy: userId,
                email: dto.email,
                role: dto.role as any,
                token,
                expiresAt,
            },
        });


        await this.mailService.sendInvitationEmail(
            dto.email,
            workspace.name,
            inviter?.email || 'A team member',
            token
        );

        // LOG TO TERMINAL FOR LOCALHOST TESTING
        const acceptUrl = `http://localhost:3000/workspaces/accept?token=${token}`;
        this.logger.log('==================================================');
        this.logger.log(`INVITATION SENT TO: ${dto.email}`);
        this.logger.log(`WORKSPACE: ${workspace.name}`);
        this.logger.log(`ACCEPT LINK: ${acceptUrl}`);
        this.logger.log('==================================================');

        return { message: 'Invitation sent successfully', invitationId: invitation.id, token };
    }

    async acceptInvitation(token: string, userId: string) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { token },
            include: { workspace: true }
        });

        if (!invitation) throw new NotFoundException('Invalid invitation token');
        if (invitation.accepted) throw new BadRequestException('Invitation already accepted');
        if (invitation.expiresAt < new Date()) throw new BadRequestException('Invitation expired');

        return this.prisma.$transaction(async (tx) => {

            const existingMember = await tx.workspaceMember.findUnique({
                where: { userId_workspaceId: { userId, workspaceId: invitation.workspaceId } }
            });

            if (existingMember) {
                await tx.invitation.update({ where: { id: invitation.id }, data: { accepted: true } });
                return { message: 'You are already a member' };
            }

            const member = await tx.workspaceMember.create({
                data: {
                    userId,
                    workspaceId: invitation.workspaceId,
                    role: invitation.role,
                },
            });

            await tx.invitation.update({
                where: { id: invitation.id },
                data: { accepted: true },
            });

            return member;
        });
    }



    async getMembers(userId: string, workspaceId: string) {
        await this.checkPermission(userId, workspaceId, ['OWNER', 'EDITOR', 'VIEWER']);
        return this.prisma.workspaceMember.findMany({
            where: { workspaceId },
            include: { user: { select: { id: true, email: true, avatarUrl: true } } }
        });
    }

    async updateMemberRole(userId: string, workspaceId: string, targetUserId: string, role: 'OWNER' | 'EDITOR' | 'VIEWER') {
        await this.checkPermission(userId, workspaceId, ['OWNER']);

        if (userId === targetUserId) throw new BadRequestException('You cannot change your own role');

        return this.prisma.workspaceMember.update({
            where: { userId_workspaceId: { userId: targetUserId, workspaceId } },
            data: { role },
        });
    }

    async removeMember(userId: string, workspaceId: string, targetUserId: string) {
        const userMember = await this.checkPermission(userId, workspaceId, ['OWNER', 'EDITOR']);

        const targetMember = await this.prisma.workspaceMember.findUnique({
            where: { userId_workspaceId: { userId: targetUserId, workspaceId } }
        });

        if (!targetMember) throw new NotFoundException('Member not found');


        if (userMember.role === 'EDITOR' && userId !== targetUserId) {
            throw new ForbiddenException('Editors can only remove themselves');
        }


        if (targetMember.role === 'OWNER') {
            throw new BadRequestException('Owner cannot be removed. Transfer ownership first.');
        }

        return this.prisma.workspaceMember.delete({
            where: { userId_workspaceId: { userId: targetUserId, workspaceId } },
        });
    }


    private async checkPermission(userId: string, workspaceId: string, allowedRoles: string[]) {
        const member = await this.prisma.workspaceMember.findUnique({
            where: { userId_workspaceId: { userId, workspaceId } }
        });

        if (!member || !allowedRoles.includes(member.role)) {
            throw new ForbiddenException('You do not have permission to perform this action');
        }
        return member;
    }
}