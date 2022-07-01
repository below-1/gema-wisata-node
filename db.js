import mongoose from 'mongoose';
import fp from 'fastify-plugin'

const mongo_uri = process.env.MONGO_URI
if (!mongo_uri) {
  throw new Error('mongo_uri is not defined')
}

export default fp(async (fastify) => {
  try {
    await mongoose.connect(mongo_uri)
    fastify.decorate('get_mongo_client', mongoose.connection.getClient())
    console.log(`done connection to mongo`)
  } catch (err) {
    throw err;
  }
})
