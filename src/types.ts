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
  corteUser: string;
  corteStarted: string;
  corteEnded: string;
  cajonesUser: string;
  cajonesStarted: string;
  cajonesEnded: string;
  uneroUser: string;
  uneroStarted: string;
  uneroEnded: string;
  montajeUser: string;
  montajeStarted: string;
  montajeEnded: string;
  espejosUser: string;
  espejosStarted: string;
  espejosEnded: string;
  adminUser: string;
  adminStarted: string;
  adminEnded: string;
  canteadoUser: string;
  canteadoStarted: string;
  canteadoEnded: string;
  mecanizadoUser: string;
  mecanizadoStarted: string;
  mecanizadoEnded: string;
  embalajeUser: string;
  embalajeStarted: string;
  embalajeEnded: string;
}

export interface Transports {
  address: string;
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
