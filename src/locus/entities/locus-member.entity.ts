import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, ValueTransformer } from 'typeorm';
import { Locus } from './locus.entity';

const bigintToNumber: ValueTransformer = {
    to: (value: any) => value,
    from: (value: any) => (value !== null && value !== undefined ? Number(value) : value),
};

@Entity({ schema: 'rnacen', name: 'rnc_locus_members' })
export class LocusMember {
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        transformer: bigintToNumber,
    })
    id: number;

    @Column({ name: 'urs_taxid', type: 'text', nullable: true })
    ursTaxid: string;

    @Column({ name: 'region_id', type: 'integer', nullable: true })
    regionId: number;

    @Column({
        name: 'locus_id',
        type: 'bigint',
        transformer: bigintToNumber,
    })
    locusId: number;

    @Column({ name: 'membership_status', type: 'text', nullable: true })
    membershipStatus: string;

    @ManyToOne(() => Locus, (locus) => locus.locusMembers)
    @JoinColumn({ name: 'locus_id' })
    locus: Locus;
}
