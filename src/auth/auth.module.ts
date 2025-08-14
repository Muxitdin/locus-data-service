import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../users/users.service';
import { JWT_SECRET } from '../config/constants';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: '8h' },
        }),
    ],
    providers: [AuthService, JwtStrategy, UsersService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
