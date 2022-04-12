import Multer from 'fastify-multer'
import { promises as fs } from 'fs'
import { imagekit } from '../../util.js'
import { Wisata } from '../../models/wisata.model.js'

const upload = Multer({ dest: 'uploads/' })

export default async (fastify) => {

  fastify.get('/', async (request, reply) => {
    const items = await Wisata.find({})
    reply.view('app/wisata/list', {
      items
    })
  })

  fastify.get('/:id/detail', async (request, reply) => {
    const item = await Wisata.findById(request.params.id)
    console.log('item')
    console.log(item)
    reply.view('app/wisata/detail', {
      item
    })
  })

  fastify.get('/create', async (request, reply) => {
    reply.view('app/wisata/create', {
      message: ''
    })
  })

  fastify.post('/create', {
    preHandler: upload.single('avatar'),
    handler: async (request, reply) => {
      let payload = {...request.body}

      // Avatar file
      const f = request.file
      // Read content as buffer asynchronously
      const buff = await fs.readFile(f.path)
      const uploadResponse = await imagekit.upload({
        file: buff,
        fileName: f.originalname,
      })
      const avatar_url = uploadResponse.url
      const avatar = {
        url: avatar_url
      }
      let wisata = new Wisata({
        ...payload,
        avatar
      })
      await wisata.save()

      fastify.log.info('created new wisata')
      fastify.log.info(wisata)

      // Redirect to detail wisata
      const redirect_url = `/app/wisata/${wisata._id}/detail`
      reply.redirect(redirect_url)
    }
  })

  fastify.post('/:id/update', {
    preHandler: upload.none(),
    handler: async (request, reply) => {
      let payload = {...request.body}
      let wisata = await Wisata.findById(request.params.id)
      wisata.set(payload)
      await wisata.save()

      fastify.log.info(`update wisata(id=${request.params.id})`)
      fastify.log.info(wisata)

      // Redirect to detail wisata
      const redirect_url = `/app/wisata/${wisata._id}/detail`
      reply.redirect(redirect_url)
    }
  })

  fastify.get('/:id/delete', {
    handler: async (request, reply) => {
      reply.redirect('/app/wisata')
    }
  })

}