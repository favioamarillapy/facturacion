export class Factura {
    constructor(
        public id: number,
        public timbrado: string,
        public id_timbrado: number,
        public fecha_emision: string,
        public numero: string,
        public numeroComrpob: number,
        public tipo: string,
        public id_cliente: number,
        public ruc: string,
        public razon_social: string,
        public direccion: string,
        public total: number,
        public exento: number,
        public iva_5: number,
        public iva_10: number,
        public detalles: any
    ) { }
}