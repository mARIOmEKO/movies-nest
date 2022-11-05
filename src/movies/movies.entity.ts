import { User } from "src/user/users.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Movies{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title : string;

    @Column()
    description: string;

    @Column()
    rating: number;

    @ManyToMany(type => User, user => user.moviesWatched, { eager: true })
    @JoinTable()
    watchedBy: User[]
    @Column("text", { array: true , default:[],unique:true})
    userIdWatched: string[];

    @ManyToMany(type => User, user => user.moviesWatched, { eager: true })
    @JoinTable()
    wishlistedBy: User[]; 

    @Column("text", { array: true , default:[],unique:true})
    userIdWishlisted: string[];


}