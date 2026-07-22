import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ type: "varchar", nullable: true })
    avatarUrl!: string | null;

    @Column({ type: "varchar", nullable: true, select: false })
    passwordHash!: string | null;

    @OneToMany(() => Garden, (garden) => garden.owner)
    gardens!: Garden[];

    @CreateDateColumn()
    createdAt!: Date;
}

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

    @ManyToOne(() => User, (user) => user.gardens, { onDelete: "CASCADE" })
    owner!: User;

    @OneToMany(() => Plant, (plant) => plant.garden)
    plants!: Plant[];

    @CreateDateColumn()
    createdAt!: Date;
}

@Entity("plants")
export class Plant {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    species!: string;

    @Column({ type: "date" })
    plantedAt!: Date;

    @ManyToOne(() => Garden, (garden) => garden.plants, { onDelete: "CASCADE" })
    garden!: Garden;

    @OneToMany(() => CareLog, (careLog) => careLog.plant)
    careLogs!: CareLog[];

    @CreateDateColumn()
    createdAt!: Date;
}

@Entity("care_logs")
export class CareLog {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Plant, (plant) => plant.careLogs, { onDelete: "CASCADE" })
    plant!: Plant;

    @Column({ type: "varchar", nullable: true })
    photoUrl!: string | null;

    @Column({ type: "text", nullable: true })
    note!: string | null;

    @Column({ type: "date" })
    loggedAt!: Date;

    @CreateDateColumn()
    createdAt!: Date;
}