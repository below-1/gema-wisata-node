import mongoose from 'mongoose';
import fp from 'fastify-plugin'

export default fp(async (fastify) => {
  try {
    await mongoose.connect('mongodb://localhost/gema_db')
    fastify.decorate('get_mongo_client', mongoose.connection.getClient())
    console.log(`done connection to mongo`)
  } catch (err) {
    throw err;
  }
})
