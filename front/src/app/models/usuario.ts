export class Usuario {
    constructor(
        public id: number,
        public nombre_completo: string,
        public email: string,
        public clave_acceso: string,
        public telefono: string,
        public rol: string,
        public sub?: number
    ) { }
}
