import mongoose from 'mongoose';

export const MediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: false,
  }
})

MediaSchema.post('remove', async function () {
  console.log(`removing image(url=${this.url})`)
})
