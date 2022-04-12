import { Wisata } from '../../models/wisata.model.js'
import WisataRoutes from './wisata.js'

export default async (fastify) => {

  fastify.get('/', async (request, reply) => {
    console.log(`trying to insert one wisata doc ..`)
    console.log()
    reply.view('app/base', {
      message: 'hallo'
    })
  })
  fastify.register(WisataRoutes, { prefix: 'wisata' })

}
