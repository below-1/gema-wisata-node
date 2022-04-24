import Multer from 'fastify-multer'
import { User } from '../models/user.model.js'

const upload = Multer({ dest: 'uploads/' })

export default async (fastify) => {

  fastify.get('/login', {
    handler: async (request, reply) => {
      let errors = {
        username: request.flash('username.error'),
        password: request.flash('password.error'),
      }
      reply.view('auth/login', {
        errors
      })
    }
  })

  fastify.post('/login', {
    preHandler: upload.none(),
    handler: async (request, reply) => {
      const payload = {...request.body}
      const {
        username,
        password
      } = payload;
      const user = await User.findOne({
        where: {
          username
        }
      })
      if (!user) {
        request.flash('username.error', 'username tidak dapat ditemukan')
        reply.redirect('/auth/login')
      }
      reply.send('OK')
    }
  })
}