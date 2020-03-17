const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const { logger, accessLogger } = require('./logger');
const exec = require('child_process').exec
// https://www.alibabacloud.com/help/zh/doc-detail/60714.htm
const config = require('./config')

app.use(accessLogger())

app.use(bodyParser())

app.use(async (ctx) => {
    if ( ctx.url === '/' && ctx.method === 'GET' ) {
        ctx.body = 'get hello monitor'
    } else if ( ctx.url === '/' && ctx.method === 'POST' ) {
        const postData = ctx.request.body
        logger.error(postData);
        ctx.body = 'post hello monitor'
        if (postData.userId === config.userId
            && postData.alertName === config.alertName
            && postData.alertState === config.alertState) {
            logger.error('exec restart script');
            exec('bash restart.sh')
        }
    }
})
app.listen(3033)
console.log('server running at localhost:3033')