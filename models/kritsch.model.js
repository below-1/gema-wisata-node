import mongoose from 'mongoose';

const KriteriaType = {
  NUMBER: 'NUMBER',
  OPTIONS: 'OPTIONS'
}

const WeightType = {
  TIDAK_PENTING: 'TIDAK_PENTING',
  KURANG_PENTING: 'KURANG_PENTING',
  CUKUP_PENTING: 'CUKUP_PENTING',
  PENTING: 'PENTING',
  SANGAT_PENTING: 'SANGAT_PENTING'
}

const NumberOptionSchema = new mongoose.Schema({
  lower: Number,
  lower_sign: { type: String, enum: ['<', '<='] },
  upper: Number,
  upper_sign: { type: String, enum: ['>', '>='] },
  value: Number,
})

const TextOptionSchema = new mongoose.Schema({
  label: String,
  value: Number,
})

export const KriteriaSchema = new mongoose.Schema({
  nama: String,
  type: {
    type: String,
    enum: Object.values(KriteriaType)
  },
  weight: { type: String, enum: Object.values(WeightType), required: true },
  number_options: [NumberOptionSchema],
  text_options: [TextOptionSchema],
  benefit: {
    type: Boolean,
    required: true,
  },
  text_value: {
    type: [String],
    required: false,
  },
  number_value: {
    type: Number,
    required: false,
  }
})

export const KritschSchema = new mongoose.Schema({
  version: {
    type: Number,
    required: true,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  krits: [KriteriaSchema]
}, { timestamps: true })

export const Kritsch = mongoose.model("Kritsch", KritschSchema);
