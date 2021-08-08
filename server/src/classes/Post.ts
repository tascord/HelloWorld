import { databases } from "../helpers/data";
import User from "./User";

type PostOpts = {

    id: string
    author: User

    title: string
    body: string

    likes: User[]

}

export type PostData = {

    id: string
    author: string,
    title: string,
    body: string,
    likes: string[]

}

export default class Post {

    id: string;
    author: User;
    title: string;
    body: string;
    likes: User[];

    constructor(opts: PostOpts) {

        this.id = opts.id;
        this.author = opts.author;

        this.title = opts.title;
        this.body = opts.body;

        this.likes = opts.likes;
    }

    static get_post_by_id(id: string): Post | undefined {

        if (!databases.posts.has(id)) return undefined;

        const data = databases.posts.get(id) as {

            id: string,
            author: string,

            title: string,
            body: string,

            likes: string[]

        };

        return new Post({

            id: data.id,
            title: data.title,
            body: data.body,

            likes: (
                data.likes
                    .map(id => User.get_user_by_id(id))
                    .filter(user => user instanceof User)
            ) as User[],

            author: (User.get_user_by_id(data.author) as User)

        })



    }

}