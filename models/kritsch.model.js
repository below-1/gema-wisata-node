import mongoose from 'mongoose';

const KriteriaType = {
  NUMBER: 'NUMBER',
  OPTIONS: 'OPTIONS'
}

export const KriteriaSchema = new mongoose.Schema({
  nama: String,
  type: {
    type: String,
    enum: Object.values(KriteriaType)
  },
  number_options: [{
    lower: Number,
    lower_sign: { type: String, enum: ['<', '<='] },
    upper: Number,
    upper_sign: { type: String, enum: ['>', '>='] },
    value: Number,
  }],
  text_options: [{
    label: String,
    value: Number,
  }],
  benefit: {
    type: Boolean,
    required: true,
  },
  text_value: {
    type: String,
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
  krits: [KriteriaSchema]
})
