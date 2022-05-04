import { Kriteria } from '../../models/kritsch.model.js'
import { format_weight, format_number_option } from '../../serv/kriteria.js'
import Multer from 'fastify-multer'

const upload = Multer({ dest: 'uploads/' })

export default async (fastify) => {

  fastify.get('/', {
    handler: async (request, reply) => {
      const items = await Kriteria.find({})
      return reply.view('app/kriteria/list', {
        items
      })
    }
  })

  fastify.get('/create', {
    handler: async (request, reply) => {
      return reply.view('app/kriteria/create')
    }
  })

  fastify.post('/create', {
    preHandler: upload.none(),
    handler: async (request, reply) => {
      let payload = {
        ...request.body,
        benefit: request.body.benefit ? true : false
      }
      if (payload.type == 'MULTIPLE') {
        payload.type = 'OPTIONS'
        payload.multiple = true
      } 
      let kriteria = new Kriteria(payload)
      await kriteria.save()
      return reply.redirect('/app/kriteria')
    }
  })

  fastify.get('/:id/detail', {
    handler: async (request, reply) => {
      const kriteria = await Kriteria.findById(request.params.id)
      console.log(kriteria)
      // throw new Error('kriteria')
      if (!kriteria) {
        request.session.error = {
          status: 404,
          message: 'Tidak dapat menemukan data kriteria'
        }
        reply.redirect('/app/not-found')
        return
      }
      reply.view('app/kriteria/detail', {
        kriteria,
        format_weight,
        format_number_option
      })
    }
  })

  fastify.post('/update', {
    preHandler: upload.none(),
    handler: async (request, reply) => {
      const body = request.body;      
      let payload = {
        nama: body.nama,
        weight: body.weight,
      }
      payload.benefit = body.tcrit == 'BENEFIT';
      const kriteria = await Kriteria.findById(request.query.kriteria)
      if (!kriteria) {
        request.session.error = {
          status: 404,
          message: 'Tidak dapat menemukan data kriteria'
        }
        reply.redirect('/app/not-found')
        return
      }
      kriteria.nama = payload.nama
      kriteria.weight = payload.weight
      kriteria.benefit = payload.benefit
      await kriteria.save()
      reply.redirect(`/app/kriteria/${kriteria._id}/detail`)
    }
  })

  fastify.get('/:id/delete',{
    schema: {
      params: {
        type: 'object',
        props: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    },
    handler: async (request, reply) => {
      const id = request.params.id
      console.log('id')
      console.log(id)
      const kriteria = await Kriteria.findById(id)
      console.log('kriteria')
      console.log(kriteria)
      if (!kriteria) {
        request.flash('error', [
          `Gagal menemukan data kriteria#${id}`,
          '404'
        ])
        reply.redirect('/app/not-found')
        return
      }
      await kriteria.delete()
      reply.redirect('/app/kriteria')
    }
  })

}
