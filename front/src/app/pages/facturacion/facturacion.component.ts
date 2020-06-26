import { Component, OnInit } from '@angular/core';
import { FacturaService } from 'src/app/services/factura.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TimbradoService } from 'src/app/services/timbrado.service';
import { Timbrado } from 'src/app/models/timbrado';
import { Factura } from 'src/app/models/factura';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  public mensajeOperacion = '';
  public page = 'cabecera';
  public mensajeError = '';

  listaClientes: any;
  listaFactura: any;
  listaServicios = [];

  detalleFactura: any;
  detalleTotal: any;

  accion: string;
  formulario: boolean;

  goFrmServicio: boolean;
  goFrmRegFactura: boolean;

  paginaActual = 1;
  porPagina = 5;
  total;

  tipoFactura = 'CO';
  timbrado: Timbrado
  factura: Factura

  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []

  
  constructor(
    private facturaService: FacturaService,
    private clienteService: ClienteService,
    private timbradoService: TimbradoService
  ) {
    this.inicializarFiltros();
    this.factura = new Factura(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
    this.goFrmRegFactura = false;
    this.goFrmServicio = false;
  }

  async ngOnInit() {
    this.mostrarFormulario(false, "Listado");
    await this.getClientes();
    await this.paginacion();
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      numero: '',
      tipo: null,
      id_cliente: null,
      total: ''
    }
  }

  inicilizarDetalleFactura() {
    this.detalleFactura = {
      cantidad: '',
      descripcion: '',
      precio_unitario: '',
      impuesto: null,
      exento: 0,
      iva_5: 0,
      iva_10: 0
    };
  }

  inicilizarDetalleTotal() {
    this.detalleTotal = {
      total: 0,
      exento: 0,
      iva_5: 0,
      iva_10: 0
    };
  }

  async mostrarFormulario(flag, accion) {
    this.mensajeOperacion = '';
    this.formulario = flag;
    this.accion = accion;

    if (accion == 'Listado') {
      this.paginacion();
    }


    if (flag && accion == 'Registrar') {
      this.factura = new Factura(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
      this.page = 'cabecera';
      this.listaServicios = [];

      await this.getTimbradoActivo();
      this.inicilizarDetalleFactura();
      this.inicilizarDetalleTotal();
    }
    this.goFrmRegFactura = false;
  }

  async getTimbradoActivo(pagina?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaFactura = null;
    this.accion = 'Listado';
    let parametros = {
      paginar: true
    }
    const response: any = await this.timbradoService.getTimbradoActivo(null, parametros);

    if (response.success) {
      if (response.data) {
        this.timbrado = response.data;
        this.factura.id_timbrado = this.timbrado.id;
        this.factura.timbrado = this.timbrado.numero;

        let numero: number;
        (this.timbrado.ult_usado) ? numero = this.timbrado.ult_usado + 1 : numero = this.timbrado.numero_desde;
        this.factura.numero = '001-001-' + this.setearNroFactura(numero.toString());

      }
    } else {

    }
  }

  async getTimbradoById(id) {
    const response: any = await this.timbradoService.get(id, null);

    if (response.success) {
      this.factura.id_timbrado = response.data[0].id;
      this.factura.timbrado = response.data[0].numero;
    } else {
      this.mensajeError = 'Error al obtener cliente'
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaFactura = null;
    this.accion = 'Listado';

    this.parametros = null;
    this.parametros = {
      paginar: true,
      page: this.paginaActual
    };

    if (parametrosFiltro) {
      this.parametrosTabla.forEach(element => {
        this.parametros[element.key] = element.value;
      });
    }

    const response: any = await this.facturaService.get(null, this.parametros);
    if (response.success) {
      this.listaFactura = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {

    }

  }

  async submit() {
    this.goFrmRegFactura = true;

    this.factura.fecha_emision = moment(this.factura.fecha_emision).format('YYYY-MM-DD');
    this.factura.detalles = this.listaServicios;

    const response: any = await this.facturaService.registrar(this.factura);

    if (response.success) {

      let number = this.timbrado.ult_usado + 1;
      let ult_usado: string = number.toString();
      const dataUlt = {
        ult_usado: parseInt(ult_usado)
      };

      const responseUltUsado: any = await this.timbradoService.updateUltUsado(dataUlt, this.factura.id_timbrado);
      if (responseUltUsado.success) {
        this.mensajeOperacion = 'success';
      } else {

        this.mensajeOperacion = 'error';
      }

      setTimeout(() => {
        this.generarPdf(response.data.id);
      }, 1500);

      this.goFrmRegFactura = false;

      setTimeout(() => {
        this.mostrarFormulario(false, "Listado");
      }, 2000);

    } else {

    }

  }

  async getFactura(id_factura) {
    const response: any = await this.facturaService.get(id_factura);

    if (response.success) {
      this.factura = response.data;

      await this.getTimbradoById(this.factura.id_timbrado);
      await this.getCliente(response.data.cliente.ruc);
      let event = {
        value: this.factura.id_cliente
      }

      this.factura.ruc = this.factura.ruc;
      this.factura.razon_social = this.factura.razon_social;
      this.factura.direccion = this.factura.direccion;
      
      await this.getDetalleFactura(id_factura);
      this.page = 'cabecera';
      this.mostrarFormulario(true, 'Ver Factura');
    } else {

    }
  }

  async getDetalleFactura(id_factura) {
    const response: any = await this.facturaService.getDetalle(id_factura);

    if (response.success) {
      this.listaServicios = [];
      this.listaServicios = response.data;
      this.factura.detalles = response.data;
      this.mostrarFormulario(true, 'Ver Factura');
    } else {

    }
  }

  cambiarFormatoFecha(event: any) {
    if (this.accion == 'Registrar') {
      this.factura.fecha_emision = moment(this.factura.fecha_emision).format('DD/MM/YYYY');
    }
  }

  getFechaDatepicker(date) {
    const separado = date.split("/");
    return new Date(separado[2], separado[1] - 1, separado[0]);
  }

  agregarServicio() {
    if (!this.detalleFactura.cantidad || !this.detalleFactura.descripcion || !this.detalleFactura.precio_unitario
      || !this.detalleFactura.impuesto) {
      this.goFrmServicio = true;
      return;
    }

    this.detalleTotal.total += this.detalleFactura.precio_unitario * this.detalleFactura.cantidad;

    if (this.detalleFactura.impuesto == 0) {
      this.detalleTotal.exento += this.detalleFactura.precio_unitario;
      this.detalleFactura.exento = this.detalleFactura.precio_unitario;
      this.detalleFactura.iva_5 = 0;
      this.detalleFactura.iva_10 = 0;
    }
    if (this.detalleFactura.impuesto == 5) {
      this.detalleTotal.iva_5 += this.detalleFactura.precio_unitario;
      this.detalleFactura.exento = 0;
      this.detalleFactura.iva_5 = this.detalleFactura.precio_unitario;
      this.detalleFactura.iva_10 = 0;
    }
    if (this.detalleFactura.impuesto == 10) {
      this.detalleTotal.iva_10 += this.detalleFactura.precio_unitario;
      this.detalleFactura.exento = 0;
      this.detalleFactura.iva_5 = 0;
      this.detalleFactura.iva_10 = this.detalleFactura.precio_unitario;
    }

    this.listaServicios.push(this.detalleFactura);

    //cargamos los totales por cada servicio insertado
    this.factura.total = this.detalleTotal.total;
    this.factura.exento = this.detalleTotal.exento;
    this.factura.iva_5 = this.detalleTotal.iva_5;
    this.factura.iva_10 = this.detalleTotal.iva_10;


    this.inicilizarDetalleFactura();

    this.goFrmServicio = false;

  }

  eliminarServicio(index) {
    //se restan los totales
    this.detalleTotal.total -= this.listaServicios[0].precio_unitario * this.listaServicios[0].cantidad;

    if (this.listaServicios[0].impuesto == 0) {
      this.detalleTotal.exento -= this.listaServicios[0].precio_unitario;
    }
    if (this.listaServicios[0].impuesto == 5) {
      this.detalleTotal.iva_5 -= this.listaServicios[0].precio_unitario;
    }
    if (this.listaServicios[0].impuesto == 10) {
      this.detalleTotal.iva_10 -= this.listaServicios[0].precio_unitario;
    }

    //cargamos los totales por cada servicio insertado
    this.factura.total = this.detalleTotal.total;
    this.factura.exento = this.detalleTotal.exento;
    this.factura.iva_5 = this.detalleTotal.iva_5;
    this.factura.iva_10 = this.detalleTotal.iva_10;

    //se elimina el item
    this.listaServicios.splice(index, 1);

  }

  async getCliente(rucBusqueda?) {
    let parametros = {
      ruc: rucBusqueda
    }

    const response: any = await this.clienteService.get(null, parametros);

    if (response.success) {
      if (response.data[0]) {
        this.factura.id_cliente = response.data[0].id;
        this.factura.ruc = response.data[0].ruc;
        this.factura.razon_social = response.data[0].razon_social;
        this.factura.direccion = response.data[0].direccion;
      } else {
        this.mensajeError = 'No se encuentra el cliente';
      }
    } else {
      this.mensajeError = 'Error al obtener cliente';
    }
  }

  moverPage(pageValue) {
    if (pageValue == 'detalle') {
      if (!this.factura.numero || !this.factura.fecha_emision
        || !this.factura.ruc || !this.factura.razon_social || !this.factura.direccion) {
        this.goFrmRegFactura = true;
        this.mensajeError = 'Debe completar todos los campos'
        return;
      }
    }
    this.page = pageValue;
  }

  setearNroFactura(numero: string) {
    let longitud: number = 7 - numero.length;
    let ceros: string = "";

    for (let index = 0; index < longitud; index++) {
      ceros += "0";
    }

    return ceros + numero;
  }

  generarPdf(idFactura) {
    window.open(`${environment.api}/factura/${idFactura}/generarPDF`, '_blank');
  }

  async filtrarTabla(event?) {
    if (event) {
      let key = event.target.name;
      let value = event.target.value;
      let parametros = { key, value };
      this.parametrosTabla.push(parametros);

      await this.paginacion(null, parametros);
    } else {
      await this.inicializarFiltros();
      await this.paginacion(null, null);
    }
  }

  async getClientes() {
    const response: any = await this.clienteService.get(null, null);
    
    if (response.success) {
      this.listaClientes = response.data;
    } else {

    }

  }
  
}
