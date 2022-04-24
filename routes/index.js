import AppRoutes from './app/index.js'
import AuthRoutes from './auth.js'

export default async (fastify) => {
  fastify.get('/', async (request, reply) => {
    reply.view('landing/index')
  })
  fastify.register(AuthRoutes, { prefix: '/auth' })
  fastify.register(AppRoutes, { prefix: '/app' })
}