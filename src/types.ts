export type Users = {
  id: string;
  name: string;
  number: string;
  code: string;
  process: string;
  done: boolean;
}

export type Orders = {
  code: string;
  corte: boolean;
  corteUser: string;
  corteStarted: string;
  corteEnded: string;
  cajones: boolean;
  cajonesUser: string;
  cajonesStarted: string;
  cajonesEnded: string;
  unero: boolean;
  uneroUser: string;
  uneroStarted: string;
  uneroEnded: string;
  montaje: boolean;
  montajeUser: string;
  montajeStarted: string;
  montajeEnded: string;
  espejos: boolean;
  espejosUser: string;
  espejosStarted: string;
  espejosEnded: string;
  admin: boolean;
  adminUser: string;
  adminStarted: string;
  adminEnded: string;
  canteado: boolean;
  canteadoUser: string;
  canteadoStarted: string;
  canteadoEnded: string;
  mecanizado: boolean;
  mecanizadoUser: string;
  mecanizadoStarted: string;
  mecanizadoEnded: string;
  embalaje: boolean;
  embalajeUser: string;
  embalajeStarted: string;
  embalajeEnded: string;
  laca: boolean;
  lacaUser: string;
  lacaStarted: string;
  lacaEnded: string;

}

export interface Transports {
  address: string;
  albaraNum: string;
  clientNum: string;
  date: string;
  firstTel: string;
  observations: string;
  pdfUrl: string;
  secondTel: string;
  status: string;
  time: string;
  [key: string]: string;
  id: string;
  transId: string;
  transName: string;
}

export interface TransportersData {
  name: string;
  [key: string]: string;
  id: string;
}

export interface AdminsData {
  name: string;
  [key: string]: string;
  id: string;
}

export interface TecnicData {
  name: string;
  [key: string]: string;
  id: string;
}

export interface ServeiTecnic {
  key: string;
  tecnicId: string;
  tecnicName: string;
  comentarisTecnic: string;
  currentDate: number;
  revisionDate: number;
  codeDistributor: string;
  nameDistributor: string;
  emailDistributor: string;
  albaraType: string;
  albaraNumber: string;
  isMesura: boolean;
  description: string;
  revision: string;
  finalClientName: string;
  finalClientPhone: string;
  finalClientAddress: string;
  albaraFile: string;
  albaraFileName: string;
  documents: string[];
  documentsNames: string[];
  documentsTecnic: string[];
  documentsTecnicNames: string[];
  actionDate: number|undefined|null;
  stateServei: string;
}

export interface FormaRegistre {
  key: number;
  name: string;
}

export const formaRegistreObject: FormaRegistre[] = [
  {
    key: 2,
    name: 'WhatsApp',
  },
  {
    key: 3,
    name: 'e-mail',
  },
  {
    key: 4,
    name: 'Web',
  },
  {
    key: 5,
    name: 'Presencial',
  },
  {
    key: 6,
    name: 'Altres',
  },
];

export interface ComandaType {
  key: number;
  type: string;
}

export interface Incidencia {
  key: string;
  ncNum: number;
  date: string;
  adminId: string;
  comandaType: string;
  formaRegistre: string;
  comandaNum: string;
  codiDistribuidor: string;
  nomDistribuidor: string;
  nomTrucador: string;
  correuTrucador: string;
  tlfTrucador: string;
  direccioClientFinal: string;
  tlfClientFinal: string;
  refProducte: string;
  descrProducte: string;
  comentarisNC: string;
  serveioproducte: string;
  documents: string[];
  documentsNames: string[];
  resolucio: string;
  resolucioTimestamp: string;
  state: string;
}

export const comandaTypeObject: ComandaType[] = [
  {
    key: 1,
    type: 'Albarà',
  },
  {
    key: 2,
    type: 'Comanda',
  },
  {
    key: 3,
    type: 'Comanda client',
  },
];
