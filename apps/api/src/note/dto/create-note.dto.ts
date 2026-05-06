import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  transcript?: string;

  @IsOptional()
  @IsString()
  workspaceId?: string;
}
