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