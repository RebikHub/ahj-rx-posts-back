const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const Router = require('koa-router');
const faker = require('faker');
const { v4: uuidv4 } = require('uuid');

const router = new Router();
const app = new Koa();

const posts = {
    status: 'ok',
    data: [],
}
const comments = {
    status: 'ok',
    data: [],
}

function generationPosts(posts, comments) {
    for (let i = 0; i < 20; i++) {
        const id = uuidv4();
        posts.push({
            id: id,
            author_id: faker.internet.email(),
            title: faker.name.title(),
            author: faker.internet.userName(),
            avatar: faker.image.people(),
            image: faker.image.image(),
            created: faker.time.recent(),
        })
        for (let i = 0; i < 10; i++) {
            comments.push({
                id: uuidv4(),
                post_id: id,
                author_id: faker.internet.email(),
                author: faker.internet.userName(),
                avatar: faker.image.cats(),
                content: faker.lorem.text(1),
                created: faker.time.recent(),
            })
        }
    }
}

generationPosts(posts.data, comments.data);

app.use(koaBody({
    text: true,
    urlencoded: true,
    multipart: true,
    json: true,
}));

app.use(cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET']
}));

router.get('/posts', async (ctx) => {

    if (ctx.request.query.posts === 'latest') {
        ctx.status = 200;
        ctx.response.body = posts.data;
    } else {
        const comm = comments.data.filter((elem) => ctx.request.query.post_id === elem.post_id);
        ctx.response.body = comm;
    }
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3333;
app.listen(port, () => console.log('Server started'));