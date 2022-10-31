import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Exclude } from "class-transformer";
import { userInfo } from "os";
import { Role } from "./role.enum";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({nullable: true})
    @Exclude()
    salt: string;

    @Column({type: 'enum',
        enum: Role,
        default: Role.User
    })
    @Exclude()
    role: Role;
    

    async validateUserPassword(password: string): Promise<boolean>{
        const hash = await bcrypt.hash(password,this.salt);
        return hash === this.password;
    }
}
