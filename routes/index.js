import AppRoutes from './app/index.js'
import AuthRoutes from './auth.js'
import { User } from '../models/user.model.js'

export default async (fastify) => {
  fastify.get('/', async (request, reply) => {
    reply.view('landing/index')
  })

  fastify.get('/dev', async (request, reply) => {
    const user = await User.create({
      username: 'adminzero',
      password: 'adminzero',
      avatar: 'https://i.pravatar.cc/150?img=3'
    })
    reply.send(user)
  })

  fastify.register(AuthRoutes, { prefix: '/auth' })
  fastify.register(AppRoutes, { prefix: '/app' })
}