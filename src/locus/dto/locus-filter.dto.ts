import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

const SIDELOAD_OPTIONS = ['locusMembers'] as const;

export class LocusFilterDto {
    @ApiPropertyOptional({ description: 'ID Locus (one or a list separated by comma)' })
    @IsOptional()
    @IsString()
    id?: string;

    @ApiPropertyOptional({ description: 'ID Assembly' })
    @IsOptional()
    @IsString()
    assemblyId?: string;

    @ApiPropertyOptional({ description: 'ID Region (one or a list separated by comma)' })
    @IsOptional()
    @IsString()
    regionId?: string;

    @ApiPropertyOptional({ description: 'Membership status', enum: ["member","highlighted"]  })
    @IsOptional()
    @IsString()
    membershipStatus?: string;

    @ApiPropertyOptional({ description: 'Sideload related entities, e.g. "locusMembers"', enum: SIDELOAD_OPTIONS })
    @IsOptional()
    @IsString()
    @IsIn(SIDELOAD_OPTIONS as any)
    sideload?: string;

    @ApiPropertyOptional({ description: 'Limit for pagination', type: Number })
    @IsOptional()
    @IsNumberString()
    limit?: string;

    @ApiPropertyOptional({ description: 'Offset for pagination' })
    @IsOptional()
    @IsNumberString()
    offset?: string;

    @ApiPropertyOptional({ description: 'Sort order' })
    @IsOptional()
    @IsString()
    sort?: string; // e.g. 'id:asc' or 'memberCount:desc'
}
