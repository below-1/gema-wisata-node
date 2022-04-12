import Fastify from 'fastify'
import mongoose from 'mongoose'
import POV from 'point-of-view'
import nunjucks from 'nunjucks'
import DB from './db.js'
import Multer from 'fastify-multer'
import Static from 'fastify-static'
import Cookie from 'fastify-cookie'
import Session from './session.js'
import { join } from 'path'
import AppRoutes from './routes/app/index.js';
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({
  logger: false
})

fastify
  .register(DB)
  .register(Cookie)
  .register(Session)
  .register(Static, {
    root: join(__dirname, 'static'),
    prefix: '/static'
  })
  fastify.register(Static, {
    root: join(__dirname, 'resources'),
    prefix: '/resources',
    decorateReply: false // the reply decorator has been added by the first plugin registration
  })
  .register(POV, {
    engine: {
      nunjucks,
    },
    root: join(__dirname, 'views'),
    viewExt: 'html',
    includeViewExtension: true
  })
  .register(Multer.contentParser)
// fastify.register(Multipart)
  .register(AppRoutes, { prefix: '/app' })

async function main() {
  try {
    await fastify.listen(5000)
    console.log(`now listening at 5000`)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

main();