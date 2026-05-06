import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { WorkspaceService } from "./workspace.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateWorkspaceDto, InviteUserDto, UpdateWorkspaceDto } from "./dto/workspace.dto";

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) { }

    @Post()
    create(@CurrentUser('id') userId: string, @Body() dto: CreateWorkspaceDto) {
        return this.workspaceService.create(userId, dto);
    }

    @Get()
    findAll(@CurrentUser('id') userId: string) {
        return this.workspaceService.findAll(userId);
    }

    @Patch(':id')
    update(
        @CurrentUser('id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdateWorkspaceDto
    ) {
        return this.workspaceService.update(userId, id, dto);
    }

    @Delete(':id')
    remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.workspaceService.remove(userId, id);
    }

    // --- Invitation System ---

    @Post(':id/invitations')
    invite(
        @CurrentUser('id') userId: string,
        @Param('id') workspaceId: string,
        @Body() dto: InviteUserDto
    ) {
        return this.workspaceService.invite(userId, workspaceId, dto);
    }

    @Post('invitations/accept')
    acceptInvitation(
        @CurrentUser('id') userId: string,
        @Query('token') token: string
    ) {
        return this.workspaceService.acceptInvitation(token, userId);
    }

    // --- Member Management ---

    @Get(':id/members')
    getMembers(
        @CurrentUser('id') userId: string,
        @Param('id') workspaceId: string
    ) {
        return this.workspaceService.getMembers(userId, workspaceId);
    }

    @Patch(':id/members/:userId/role')
    updateMemberRole(
        @CurrentUser('id') currentUserId: string,
        @Param('id') workspaceId: string,
        @Param('userId') targetUserId: string,
        @Body('role') role: 'OWNER' | 'EDITOR' | 'VIEWER'
    ) {
        return this.workspaceService.updateMemberRole(currentUserId, workspaceId, targetUserId, role);
    }

    @Delete(':id/members/:userId')
    removeMember(
        @CurrentUser('id') currentUserId: string,
        @Param('id') workspaceId: string,
        @Param('userId') targetUserId: string
    ) {
        return this.workspaceService.removeMember(currentUserId, workspaceId, targetUserId);
    }
}