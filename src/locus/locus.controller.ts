import { Controller, Get, Query, UseGuards, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { LocusService } from './locus.service';
import { LocusFilterDto } from './dto/locus-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/roles.decorator';

@ApiTags('Locus')
@ApiBearerAuth()
@Controller('locus')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class LocusController {
    constructor(private readonly service: LocusService) {}

    @Get()
    @ApiOperation({
        summary: 'Get Locus List',
        description: 'Retrieve a list of Locus entities with optional filters and pagination.',
    })
    @ApiOkResponse({ description: 'List of Locus entries' })
    @ApiResponse({ status: 403 , description: 'Sideloading Forbidden' })
    @Roles('admin', 'normal', 'limited')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAll(@Query() query: LocusFilterDto, @Req() req: any) {
        const user = req.user;
        return this.service.getAll(query, user);
    }
}
