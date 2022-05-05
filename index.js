import { join } from 'path'
import { readFileSync } from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import Fastify from 'fastify'
import mongoose from 'mongoose'
import POV from 'point-of-view'
import nunjucks from 'nunjucks'
import Multer from 'fastify-multer'
import Static from 'fastify-static'
import Session from 'fastify-secure-session'
import Flash from 'fastify-flash'
import { 
  fastifyRequestContextPlugin as RCPlugin, 
  requestContext as rc 
} from 'fastify-request-context';

import XView from './xview.js'
import DB from './db.js'
import Routes from './routes/index.js'; 

const __dirname = dirname(fileURLToPath(import.meta.url));

const fastify = Fastify({
  logger: false
})

fastify
  .register(DB)
  .register(RCPlugin)
  .register(Session, {
    key: readFileSync(join(__dirname, '.session_secret')),
    cookie: {
      path: '/'
    }
  })
  .register(Flash)
  .register(Static, {
    root: join(__dirname, 'static'),
    prefix: '/static'
  })
  fastify.register(Static, {
    root: join(__dirname, 'resources'),
    prefix: '/resources',
    // the reply decorator has been added by the first plugin registration
    decorateReply: false 
  })
  .register(POV, {
    engine: {
      nunjucks,
    },
    root: join(__dirname, 'views'),
    viewExt: 'html',
    includeViewExtension: true,
    defaultContext: {
      static: '/static',
      appTitle: 'ApWisata'
    },
    options: {
      onConfigure: (env) => {
        env.addFilter('static', (str) => {
          return `/static/${str}`
        })
      }
    }
  })
  .register(Multer.contentParser)
  .register(XView)
  .register(Routes)

async function main() {
  try {
    await fastify.listen(process.env.PORT || 5000)
    console.log(`now listening`)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

main();