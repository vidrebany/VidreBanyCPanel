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

export interface StandByOrder {
  code: string;
  process: string;
  started: string;
  ended: string|null;
  mark:  string|null;
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

export interface FormaDefectoType {
  key: number;
  name: string;
}
/*
DEFECTE DE FABRICACIÓ ( SIFONAT, MIDA, ACABAT…)   

DEFECTUÓS PROVEÏDOR   

ENVIAMENT ERRONI (REF. UNITATS,COLOR......)   

ERROR CLIENT   

FALTA ALGUN ELEMENT DE LA COMANDA    

INCIDÈNCIA ADMINISTRATIVA( ERROR COMANDA, PRESA MIDES…)  

INCIDÈNCIA TRANSPORT   

VARIS  

DEVOLUCIÓ
*/
export const formaDefectoObject: FormaDefectoType[] = [
  {key: 1, name: 'ARRIBA TRENCAT / AMB COP'},
  {key: 2, name: 'DEFECTE DE FABRICACIÓ ( SIFONAT, MIDA, ACABAT…)'},
  {key: 3, name: 'DEFECTUÓS PROVEÏDOR'},
  {key: 4, name: 'ENVIAMENT ERRONI (REF. UNITATS,COLOR...)'},
  {key: 5, name: 'ERROR CLIENT'},
  {key: 6, name: 'FALTA ALGUN ELEMENT DE LA COMANDA'},
  {key: 7, name: 'INCIDÈNCIA ADMINISTRATIVA( ERROR COMANDA, PRESA MIDES…)'},
  {key: 8, name: 'INCIDÈNCIA TRANSPORT'},
  {key: 9, name: 'VARIS'},
  {key: 10, name: 'DEVOLUCIÓ'},
  {key: 11, name: 'SENSE ASSIGNAR'},
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
  comandaNovaType: string;
  formaRegistre: string;
  comandaNum: string;
  comandaNovaNum: string;
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
  comentarisInicialsNC: string;
  serveioproducte: string;
  documents: string[];
  documentsNames: string[];
  resolucio: string;
  resolucioTimestamp: string;
  state: string;
  tipusDefecte: string;
  nomProveidor: string;
  numProveidor: string;

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
