import "reflect-metadata";
import {createConnection, getConnection, getManager, getRepository} from "typeorm";
import * as express from 'express'
import {Request, Response} from 'express'
import {Post} from "./entity/Post";
import {User} from "./entity/User";
import {Blogs} from "./entity/Blogs";

const init = () => {
    const entityManager = getManager();

    const user = new User();
    user.firstName = 'Margarita';
    user.lastName = 'Kovalenko';
    entityManager.save(user);
    const blog = new Blogs();
    blog.title = 'Blog 1'
    //
};

createConnection().then(async connection => {

    const cors = require('cors');
    const app = express();
    app.use(cors());
    app.use(express.json());

    //Методы Rest - Api
    app.post('/post/create', create);
    app.post('/post/update', update);
    app.get('/post/get', get);
    app.get('/post/getAll', getAll);
    app.delete('/post/delete', delete_post);

    app.listen(3001, () => console.log(`Server runs!!`));

}).catch(error => console.log(error));


async function create(req: Request, response: Response){
    try{
        init();
        const request = await req;
        const { title, text, img, userId, blogId } = request.body;

        const entityManager = getManager(); // you can also get it via getConnection().manager
        //create a article
        const post = new Post();
        post.title = title;
        post.text = text;
        post.img_link = img;
        await entityManager.save(post);

        //add article to Author
        const user = await entityManager.findOne(User, userId);
        user.posts = user.posts ? [...user.posts, post] : [post];
        await entityManager.save(user);

        //add article to Blog
        const blog = await entityManager.findOne(Blogs, blogId);
        blog.posts =  blog.posts ? [...blog.posts, post] : [post];
        await entityManager.save(blog);

        response.json('Success!!!');
    }
    catch (e) {
        console.log(e.message)
    }
};

async function update(req: Request, response: Response) {
    try{
        const request = await req;
        const { title, text, img} = request.body;

        const entityManager = getManager();

        //create a article
        const post = await entityManager.findOne(Post, request.query.id);
        post.title = title;
        post.text = text;
        post.img_link = img;

        response.json('Success update!!!');
    }
    catch (e) {
        console.log(e.message)
    }
}

export const delete_post = async (req: Request, response: Response) => {
    try {
        const request = await req;
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Post)
            .where("post_id = :id", { id:request.query.id })
            .execute();
        response.send('deleted')
    } catch (e) {
        console.log(e.message)
    }
};


export const get = async (req: Request, response: Response) => {
    try {
        const request = await req;

        const articlesRepo = getRepository(Post); // you can also get it via getConnection().manager
        //search a article

        const post = await articlesRepo.findOne(request.query.id);
        response.json(post);
    } catch (e) {
        console.log(e.message)
    }
};

export const getAll = async (req: Request, response: Response) => {
    try {
        const request = await req;
        const articlesRepo = getRepository(Post);
        const post = await articlesRepo.find();
        response.json(post);
    } catch (e) {
        console.log(e.message)
    }
};