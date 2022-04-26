import { sum } from 'lodash-es'
import { map as map_fasilitas } from './fasilitas.js'
import { map as map_biaya } from './biaya.js'
import { map as map_waktu } from './waktu.js'
import { map as map_jarak } from './jarak.js'
import { map as map_transportasi } from './transportasi.js'

const N_KRITERIA = 5;

export function wisata_to_value(wisata) {
  return [
    map_fasilitas(wisata.fasilitas),
    map_biaya(wisata.biaya),
    map_waktu(wisata.waktu),
    map_jarak(wisata.jarak),
    map_transportasi(wisata.transportasi)
  ]
}

function column(Xs, i) {
  return Xs.map(row => row[i])
}

function norm_column(Xs, i) {
  return Math.sqrt(sum(Xs.map(row => Math.pow(row[i], 2))))
}

export function topsis(items, weights) {
  const Xs = items.map(wisata_to_value)
  let Rs = []
  for (let i = 0; i < N_KRITERIA; i++) {
    const norm = norm_column(Xs, i);
    console.log(column(Xs, i))
    console.log(norm)
    const Ri = column(Xs, i).map(x => x / norm)
    Rs.push(Ri)
  }
  console.log(Rs)
  return items[0]
}