const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const Router = require('koa-router');
const faker = require('faker');
const { v4: uuidv4 } = require('uuid');

const router = new Router();
const app = new Koa();

const objectMessages = {
    status: 'ok',
    timestamp: new Date().getTime(),
    messages: [],
}

function generationMessage(array) {
    const timer = Math.random() * 1000000;
    setTimeout(() => {
        array.push({
            id: uuidv4(),
            from: faker.internet.email(),
            subject: `Hello from ${faker.name.findName()}`,
            body: faker.lorem.words(5),
            received: faker.time.recent(),
        })
    }, timer);
    console.log(timer);
}

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

router.get('/messages/unread', async (ctx) => {
    generationMessage(objectMessages.messages);
    console.log(objectMessages.messages);
    ctx.response.body = objectMessages;
    ctx.status = 200;
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 3333;
app.listen(port, () => console.log('Server started'));