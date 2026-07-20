import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("gardens")
export class Garden {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ type: "float", nullable: true })
    latitude!: number | null;

    @Column({ type: "float", nullable: true })
    longitude!: number | null;

    @CreateDateColumn()
    createdAt!: Date;
}