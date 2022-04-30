import { sum, zip, range, max, min } from 'lodash-es'
import { map as map_fasilitas } from './fasilitas.js'
import { map as map_biaya } from './biaya.js'
import { map as map_waktu } from './waktu.js'
import { map as map_jarak } from './jarak.js'
import { map as map_transportasi } from './transportasi.js'

const N_KRITERIA = 5;
const KRITERIA_TYPES = ['benefit', 'cost', 'benefit', 'benefit', 'cost'];

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
  let Xs = items.map(wisata_to_value)
  console.log(Xs)
  throw new Error('stop')
  let Rs = []
  for (let i = 0; i < N_KRITERIA; i++) {
    const norm = norm_column(Xs, i);
    console.log(column(Xs, i))
    console.log(norm)
    const Ri = column(Xs, i).map(x => x / norm)
    Rs.push(Ri) 
  }
  const ideal_pos = KRITERIA_TYPES.map((c, i) => {
    if (c == 'benefit') {
      return max(Rs[i])
    } else {
      return min(Rs[i])
    }
  })
  const ideal_neg = KRITERIA_TYPES.map((c, i) => {
    if (c == 'benefit') {
      return min(Rs[i])
    } else {
      return max(Rs[i])
    }
  })

  // Transpose Rs matrix
  Xs = zip(...Rs)

  // Calculate distance to ideal positive
  const D_pos = Xs.map(row => {
    const t1 = row.map((x, i) => x - ideal_pos[i])
    const t2 = t1.map(x => Math.pow(x, 2))
    const t3 = sum(t2)
    const t4 = Math.sqrt(t3)
    return t4
  })
  const D_neg = Xs.map(row => {
    const t1 = row.map((x, i) => x - ideal_neg[i])
    const t2 = t1.map(x => Math.pow(x, 2))
    const t3 = sum(t2)
    const t4 = Math.sqrt(t3)
    return t4
  })

  const prefs = range(Xs.length).map(ix => {
    return D_neg[ix] / (D_pos[ix] + D_neg[ix])
  })
  console.log('prefs')
  console.log(prefs)

  let biggest_index = -1;
  let biggest_pref = -1;
  for (let ix = 0; ix < Xs.length; ix++) {
    if (prefs[ix] > biggest_pref) {
      biggest_pref = prefs[ix]
      biggest_index = ix;
    }
  }
  if (biggest_index == -1) {
    throw new Error(`tidak dapat menemukan rekomendasi terbaik`)
  }

  return {
    pref: biggest_pref,
    ...items[biggest_index]
  }
}