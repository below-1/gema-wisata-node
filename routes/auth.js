import Multer from 'fastify-multer'
import { User } from '../models/user.model.js'

const upload = Multer({ dest: 'uploads/' })

export default async (fastify) => {

  fastify.get('/login', {
    handler: async (request, reply) => {
      let errors = {
        username: reply.flash('username.errors'),
        password: reply.flash('password.errors'),
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
        const stored_message = request.flash('username.errors', ['username tidak dapat ditemukan'])
        return reply.redirect('/auth/login')
      }
      reply.send('OK')
    }
  })
}