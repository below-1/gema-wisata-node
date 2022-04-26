import { pick, values, sum } from 'lodash-es'
import Multer from 'fastify-multer'
import { promises as fs } from 'fs'
import { imagekit } from '../../util.js'
import { Wisata, JenisWisata } from '../../models/wisata.model.js'
import { topsis } from '../../serv/topsis.js'

const upload = Multer({ dest: 'uploads/' })

export default async fastify => {
  fastify.get('/', {
    handler: async (request, reply)  => {
      reply.xview('app/rekomendasi/form')
    }
  })

  fastify.post('/', {
    preHandler: upload.none(),
    handler: async (request, reply) => {
      let payload = {...request.body}
      const keys = ['fasilitas', 'biaya', 'waktu', 'jarak', 'transportasi']
      let weights = values(pick(payload, keys)).map(it => parseInt(it))
      const total_weights = sum(weights)
      weights = weights.map(it => it * 1.0 / total_weights)
      let filter = {}
      // Processing the filter based on jenis
      const items = await Wisata.find(filter)
      const rekomendasi = topsis(items, weights)
      reply.send(rekomendasi)
    }
  })
}