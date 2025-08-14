import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'Username', example: 'admin' })
    @IsString()
    username: string;
    @ApiProperty({ description: 'Password', example: 'admin123' })
    password: string;
}
