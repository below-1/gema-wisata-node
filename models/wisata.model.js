import mongoose from 'mongoose';
import { MediaSchema } from './media.model.js';

export const Fasilitas = {
  Parkiran: 'Parkiran',
  Toilet: 'Toilet',
  Lopo: 'Lopo',
  Kantin: 'Kantin',
  Penginapan: 'Penginapan',
}

export const JenisWisata = {
  Alam: 'Alam',
  Budaya: 'Budaya',
  Religi: 'Religi',
}

export const Transportasi = {
  AngkutanUmum: 'AngkutanUmum',
  Motor: 'Motor',
  Mobil: 'Mobil',
  Pickup: 'Pickup',
  Bus: 'Bus',
}

export const WisataSchema = new mongoose.Schema({
  jenis: {
    type: String,
    enum: Object.values(JenisWisata),
    required: true
  },
  nama: { type: String, required: true },
  description: { type: String, required: false },
  alamat: { type: String, required: false },
  fasilitas: [{ 
    type: String, 
    enum: Object.values(Fasilitas),
    required: true
  }],
  transportasi: [{ 
    type: String, 
    enum: Object.values(Transportasi),
    required: true
  }],
  biaya: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },
  waktu: {
    type: Number,
    required: true
  },
  jarak: {
    type: Number,
    required: true
  },
  avatar: MediaSchema,
  medias: [MediaSchema]
}, { timestamps: true })

export const Wisata = mongoose.model('Wisata', WisataSchema);
