import { 
  requestContext as rc 
} from 'fastify-request-context';

import { Wisata } from '../../models/wisata.model.js'
import WisataRoutes from './wisata.js'
import RekomendasiRoutes from './rekomendasi.js'
import KriteriaRoutes from './kriteria.js'

export default async (fastify) => {

  fastify.addHook('onRequest', async (request, reply) => {
    const user = request.session.get('user');
    if (!user) {
      reply.redirect('/')
      return
    }
    rc.set('user', user)
  })

  fastify.get('/', async (request, reply) => {
    console.log(`trying to insert one wisata doc ..`)
    console.log()
    reply.xview('app/base', {
      message: 'hallo'
    })
  })

  fastify.register(WisataRoutes, { prefix: 'wisata' })
  fastify.register(RekomendasiRoutes, { prefix: 'rekomendasi' })
  fastify.register(KriteriaRoutes, { prefix: 'kriteria' })

}
