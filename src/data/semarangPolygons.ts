export interface LandmarkPoint {
  id: string;
  name: string;
  category: 'TRANSPORT' | 'CIVIC' | 'EDUCATION' | 'LANDMARK';
  lat: number;
  lng: number;
  svgX: number;
  svgY: number;
}

export const SEMARANG_LANDMARKS: LandmarkPoint[] = [
  { id: 'simpang-lima', name: 'Simpang Lima', category: 'CIVIC', lat: -6.9903, lng: 110.4229, svgX: 432, svgY: 335 },
  { id: 'tanjung-emas', name: 'Pelabuhan Tj. Emas', category: 'TRANSPORT', lat: -6.9485, lng: 110.4220, svgX: 433, svgY: 215 },
  { id: 'ahmad-yani', name: 'Bandara Ahmad Yani', category: 'TRANSPORT', lat: -6.9734, lng: 110.3752, svgX: 343, svgY: 272 },
  { id: 'kota-lama', name: 'Kota Lama', category: 'LANDMARK', lat: -6.9680, lng: 110.4285, svgX: 445, svgY: 260 },
  { id: 'tugu-muda', name: 'Tugu Muda', category: 'LANDMARK', lat: -6.9840, lng: 110.4093, svgX: 408, svgY: 297 },
  { id: 'undip-tembalang', name: 'Undip Tembalang', category: 'EDUCATION', lat: -7.0498, lng: 110.4398, svgX: 466, svgY: 448 },
  { id: 'sam-poo-kong', name: 'Sam Poo Kong', category: 'LANDMARK', lat: -6.9962, lng: 110.3981, svgX: 387, svgY: 325 },
  { id: 'waduk-jatibarang', name: 'Waduk Jatibarang', category: 'LANDMARK', lat: -7.0384, lng: 110.3508, svgX: 296, svgY: 422 },
];

export const DISTRICT_POLYGONS: Record<string, [number, number][]> = {
  'semarang-selatan': [
    [-6.99016, 110.40491],
    [-6.99233, 110.43619],
    [-7.01188, 110.44140],
    [-7.01840, 110.41534],
    [-7.00319, 110.39970],
  ],
  'semarang-timur': [
    [-6.97278, 110.44140],
    [-6.97713, 110.46746],
    [-6.99885, 110.47267],
    [-7.00319, 110.44661],
    [-6.98581, 110.43097],
  ],
  'candisari': [
    [-7.02057, 110.41012],
    [-7.02057, 110.43619],
    [-7.04229, 110.44140],
    [-7.04664, 110.41534],
    [-7.02926, 110.40491],
  ],
  'semarang-tengah': [
    [-6.96409, 110.39970],
    [-6.96626, 110.42576],
    [-6.98364, 110.43358],
    [-6.98581, 110.40491],
    [-6.97278, 110.39449],
  ],
  'semarang-barat': [
    [-6.96409, 110.35800],
    [-6.96626, 110.38928],
    [-6.98581, 110.39970],
    [-6.99016, 110.37364],
    [-6.97495, 110.35279],
  ],
  'semarang-utara': [
    [-6.93803, 110.39970],
    [-6.94020, 110.43619],
    [-6.96192, 110.43619],
    [-6.95975, 110.39970],
  ],
  'gajahmungkur': [
    [-7.00319, 110.38406],
    [-7.00536, 110.41012],
    [-7.02926, 110.40752],
    [-7.02491, 110.38146],
  ],
  'pedurungan': [
    [-6.99016, 110.46746],
    [-6.99450, 110.50394],
    [-7.02491, 110.50134],
    [-7.01840, 110.46485],
  ],
  'gayamsari': [
    [-6.99885, 110.44140],
    [-7.00102, 110.46485],
    [-7.02057, 110.46225],
    [-7.01840, 110.43619],
  ],
  'banyumanik': [
    [-7.05098, 110.40491],
    [-7.05315, 110.43619],
    [-7.08139, 110.43358],
    [-7.07705, 110.40231],
  ],
  'tembalang': [
    [-7.04446, 110.43879],
    [-7.04664, 110.47267],
    [-7.07270, 110.47006],
    [-7.06836, 110.43619],
  ],
  'ngaliyan': [
    [-6.99016, 110.32673],
    [-6.99233, 110.36322],
    [-7.02057, 110.36843],
    [-7.01840, 110.33194],
  ],
  'genuk': [
    [-6.94237, 110.45703],
    [-6.94671, 110.49873],
    [-6.97061, 110.48831],
    [-6.96626, 110.45182],
  ],
  'gunungpati': [
    [-7.04664, 110.35800],
    [-7.04881, 110.39449],
    [-7.08573, 110.39188],
    [-7.07922, 110.34758],
  ],
  'mijen': [
    [-7.03795, 110.29546],
    [-7.04012, 110.33716],
    [-7.08139, 110.33194],
    [-7.07270, 110.29025],
  ],
  'tugu': [
    [-6.95540, 110.30067],
    [-6.95758, 110.34758],
    [-6.98581, 110.34497],
    [-6.98147, 110.29806],
  ],
};
