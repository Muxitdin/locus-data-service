import {
    Entity,
    PrimaryColumn,
    Column,
    OneToMany,
    ValueTransformer,
} from 'typeorm';
import { LocusMember } from './locus-member.entity';

const bigintToNumber: ValueTransformer = {
    to: (value: any) => value,
    from: (value: any) =>
        value !== null && value !== undefined ? Number(value) : value,
};

@Entity({ schema: 'rnacen', name: 'rnc_locus' })
export class Locus {
    @PrimaryColumn()
    id: number;

    @Column({ name: 'assembly_id', nullable: true })
    assemblyId: string;

    @Column({ name: 'locus_name', nullable: true })
    locusName: string;

    @Column({ name: 'public_locus_name', nullable: true })
    publicLocusName: string;

    @Column({ nullable: true })
    chromosome: string;

    @Column({ nullable: true })
    strand: string;

    @Column({
        name: 'locus_start',
        type: 'bigint',
        nullable: true,
        transformer: bigintToNumber,
    })
    locusStart: number;

    @Column({
        name: 'locus_stop',
        type: 'bigint',
        nullable: true,
        transformer: bigintToNumber,
    })
    locusStop: number;

    @Column({ name: 'member_count', type: 'int', nullable: true })
    memberCount: number;

    @OneToMany(() => LocusMember, (member) => member.locus)
    locusMembers: LocusMember[];
}
