import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';

@ValidatorConstraint({ name: 'EmailUnique', async: true })
@Injectable()
export class EmailUnique implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) { }

  async validate(email: string) {
    if (!email) return false;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !user;
  }
  defaultMessage(args: ValidationArguments) {
    return 'Email already exists';
  }
}
