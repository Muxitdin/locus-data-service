import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'User login and JWT token retrieval' })
    @ApiBody({ type: LoginDto, description: 'User credentials for authentication' })
    @ApiResponse({ status: 201, description: 'JWT token successfully generated' })
    @ApiResponse({ status: 401, description: 'Invalid username or password' })
    async login(@Body() body: LoginDto) {
        return this.authService.login(body.username, body.password);
    }
}
