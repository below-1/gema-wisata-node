import Multer from 'fastify-multer'
import { promises as fs } from 'fs'
import { imagekit } from '../../util.js'
import { Wisata, JenisWisata } from '../../models/wisata.model.js'
import { Kriteria, KriteriaValue } from '../../models/kritsch.model.js'
import { pick, map as _map } from 'lodash-es'

const upload = Multer({ dest: 'uploads/' })

export default async (fastify) => {

  fastify.get('/', async (request, reply) => {
    const jenis = request.query.jenis
    let filter = {}
    if (jenis) {
      filter.jenis = jenis
    }
    const items = await Wisata.find(filter) 
    reply.xview('app/wisata/list', {
      items,
      jenis
    })
  })

  fastify.get('/:id/detail', async (request, reply) => {
    const item = await Wisata.findById(request.params.id)
    const kriteria_values = await KriteriaValue
      .find({ wisata: item._id })
      .populate('kriteria')
      .sort({ 'kriteria.createdAt': 1 })
    // console.log('kriteria_values');
    // console.log(kriteria_values.map(it => it.value.includes('Parkiran')));
    reply.xview('app/wisata/detail', {
      item,
      readonly: false,
      kriteria_values
    })
  })

  fastify.get('/create', async (request, reply) => {
    const kriteria_list = await Kriteria.find();
    reply.xview('app/wisata/create', {
      message: '',
      kriteria_list
    })
  })

  fastify.post('/create', {
    preHandler: upload.single('avatar'),
    handler: async (request, reply) => {
      const kriteria_list = await Kriteria.find().sort({ createdAt: 1 });
      let payload = {...request.body}

      let kriteria_name_map = new Map();
      let kriteria_names = [];
      kriteria_list.forEach(k => {
        kriteria_name_map.set(k.nama, k);
        kriteria_names.push(k.nama);
      })
      const wisata_data = pick(payload, ['nama', 'jenis']);
      const kriteria_inputs = pick(payload, kriteria_names);

      // Avatar file
      const f = request.file
      // Read content as buffer asynchronously
      const buff = await fs.readFile(f.path);
      const uploadResponse = await imagekit.upload({
        file: buff,
        fileName: f.originalname,
      })
      const avatar_url = uploadResponse.url
      const avatar = {
        url: avatar_url
      }
      let wisata = new Wisata({
        ...wisata_data,
        avatar
      })
      await wisata.save();

      const kriteria_values = kriteria_names.map(name => {
        return {
          kriteria: kriteria_name_map.get(name)._id,
          value: kriteria_inputs[name],
          wisata: wisata._id
        }
      });

      const bulk_insert_kriteria_values_result = await KriteriaValue.insertMany(kriteria_values);
      console.log(bulk_insert_kriteria_values_result);

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
      let wisata = await Wisata.findById(request.params.id)
      if (!wisata) {
        request.session.error = {
          status: 404,
          message: 'Tidak dapat menemukan data wisata'
        }
        reply.redirect('/app/not-found')
      } else {
        await wisata.delete()
        reply.redirect('/app/wisata')
      }
    }
  })

  fastify.get('/:id/add-media', {
    handler: async (request, reply) => {
      const item = await Wisata.findById(request.params.id)
      reply.xview('app/wisata/add-media', {
        item
      })
    }
  })

  fastify.post('/:id/add-media', {
    preHandler: upload.single('media'),
    handler: async (request, reply) => {
      let wisata = await Wisata.findById(request.params.id)
      // Avatar file
      const f = request.file
      // Read content as buffer asynchronously
      const buff = await fs.readFile(f.path)
      const uploadResponse = await imagekit.upload({
        file: buff,
        fileName: f.originalname,
      })
      const media_url = uploadResponse.url
      const media = {
        url: media_url
      }
      wisata.medias.push(media)
      await wisata.save()
      reply.redirect(`/app/wisata/${wisata._id}/detail`)
    }
  })

  fastify.get('/:id/set-avatar/:avatar_id', {
    handler: async (request, reply) => {
      const { params } = request;
      const { id, avatar_id } = params;
      let wisata = await Wisata.findById(id)
      if (!wisata) {
        request.session.error = {
          status: 404,
          message: 'Tidak dapat menemukan data wisata'
        }
        reply.redirect('/app/')
        return;
      }
      const new_avatar = wisata.medias.find(m => m._id.toString() == avatar_id)
      if (!new_avatar) {
        request.session.error = {
          status: 404,
          message: 'Tidak dapat menemukan data wisata'
        }
        reply.redirect('/app/')
        return;
      }
      wisata.avatar = new_avatar;
      await wisata.save();
      reply.redirect(`/app/wisata/${id}/detail`);
    }
  })

}