import Multer from 'fastify-multer'
import { Kritsch } from '../../models/kritsch.model.js'

const upload = Multer({ dest: 'uploads/' })

export default async (fastify) => {

  fastify.get('/', {
    handler: async (request, reply) => {
      const schemas = await Kritsch.find()
      reply.xview('app/kriteria/list', {
        items: schemas
      })
    }
  })

  fastify.get('/create', {
    handler: async (request, reply) => {
      reply.xview('app/kriteria/create')
    }
  })

  fastify.post('/create', {
    handler: async (request, reply) => {
      const lastSchema = await Kritsch.findOne().sort({ version: -1 })
      console.log(lastSchema)
      let newSchema = {}
      if (lastSchema) {
        newSchema.version = lastSchema.version + 1
      } else {
        newSchema.version = 1
      }
      let p = new Kritsch(newSchema)
      await p.save()
      reply.redirect('/app/kriteria')
    }
  })

}