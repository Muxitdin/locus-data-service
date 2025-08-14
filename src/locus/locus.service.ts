import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Locus } from './entities/locus.entity';
import { LocusMember } from './entities/locus-member.entity';
import { LIMITED_ALLOWED_REGION_IDS, DEFAULT_LIMIT } from '../config/constants';

type SortDirection = 'ASC' | 'DESC';

@Injectable()
export class LocusService {
    constructor(
        @InjectRepository(Locus)
        private locusRepo: Repository<Locus>,
        @InjectRepository(LocusMember)
        private locusMemberRepo: Repository<LocusMember>,
    ) {}

    private parseCsvToNumbers(csv?: string): number[] | undefined {
        if (!csv) return undefined;
        return csv
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => !Number.isNaN(n));
    }

    private mapSort(field?: string): { column: string; direction: SortDirection } {
        if (!field) return { column: 'locus.id', direction: 'ASC' };
        const [f, d] = field.split(':');
        const dir = d && d.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        const map: Record<string, string> = {
            id: 'locus.id',
            assemblyId: 'locus.assemblyId',
            memberCount: 'locus.memberCount',
        };
        if (map[f]) return { column: map[f], direction: dir };
        return { column: 'locus.id', direction: 'ASC' };
    }

    async getAll(query: any, user: any) {
        const qb = this.locusRepo.createQueryBuilder('locus');

        // Sideload relations if allowed
        // const hasLmJoin = qb.expressionMap.joinAttributes.some((j) => j.alias?.name === 'lm');
        // if (query.sideload === 'locusMembers' && user.role !== 'normal') {
        //     
        // }
        if ((query.sideload === 'locusMembers' && user.role !== 'normal') || query.regionId || query.membershipStatus) {
            qb.leftJoinAndSelect('locus.locusMembers', 'lm');
        }

        // Filtering
        if (query.id) {
            qb.andWhere('locus.id IN (:...ids)', { ids: this.parseCsvToNumbers(query.id) });
        }
        if (query.assemblyId) {
            qb.andWhere('locus.assemblyId = :assemblyId', { assemblyId: query.assemblyId });
        }
        if (query.regionId) {
            qb.andWhere('lm.regionId IN (:...regionIds)', {
                regionIds: this.parseCsvToNumbers(query.regionId),
            });
        }
        if (query.membershipStatus) {
            qb.andWhere('lm.membershipStatus = :status', { status: query.membershipStatus });
        }

        // Role restrictions
        if (user.role === 'normal') {
            if (query.sideload) {
                throw new ForbiddenException('Sideloading not allowed for normal role');
            }
        } else if (user.role === 'limited') {
            qb.andWhere('lm.regionId IN (:...allowed)', { allowed: LIMITED_ALLOWED_REGION_IDS });
        }

        // Sorting
        const sort = this.mapSort(query.sort);
        qb.orderBy(sort.column, sort.direction);

        // Pagination
        const limit = Math.min(Number(query.limit || DEFAULT_LIMIT), 5000);
        qb.take(limit).skip(Number(query.offset || 0));

        const result = await qb.getMany();

        // Normal role — strip relations
        if (user.role === 'normal') {
            return result.map((l) => {
                const { locusMembers, ...rest } = l;
                return rest;
            });
        }

        // If no sideload requested — remove relations anyway
        if (query.sideload !== 'locusMembers') {
            return result.map((l) => {
                const { locusMembers, ...rest } = l;
                return rest;
            });
        }

        return result;
    }
}
