import { IsString, MinLength, IsEmail, IsEnum, IsOptional } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @MinLength(3)
  name: string;
}

export class UpdateWorkspaceDto {
  @IsString()
  @MinLength(3)
  name: string;
}

export class InviteUserDto {
  @IsEmail()
  email: string;

  @IsEnum(['OWNER', 'EDITOR', 'VIEWER'])
  @IsOptional()
  role: 'OWNER' | 'EDITOR' | 'VIEWER' = 'VIEWER';
}
