import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    username: string;

    @Column()
    password: string;
}
