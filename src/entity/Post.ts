import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Blogs} from "./Blogs";
import {User} from "./User";

@Entity()
export class Post {

    @PrimaryGeneratedColumn()
    post_id: number;

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    img_link: string;

    @ManyToOne(type => Blogs, blog => blog.posts)
    blog: Blogs;

    @ManyToOne(type => User, user => user.posts)
    author: User;
}