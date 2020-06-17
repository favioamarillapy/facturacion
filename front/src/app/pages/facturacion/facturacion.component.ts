import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from "moment";
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { FacturaService } from 'src/app/services/factura.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TimbradoService } from 'src/app/services/timbrado.service';
import { Timbrado } from 'src/app/models/timbrado';
import { Factura } from 'src/app/models/factura';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {

  public page = 'cabecera';
  public mensajeError = '';

  listaFactura: any;
  listaClientes: any;
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

  constructor(
    private facturaService: FacturaService,
    private clienteService: ClienteService,
    private timbradoService: TimbradoService
  ) {
    this.factura = new Factura(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
    this.goFrmRegFactura = false;
    this.goFrmServicio = false;
  }

  ngOnInit() {
    this.mostrarFormulario(false, "Listado");
    this.paginacion();
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
    this.formulario = flag;
    this.accion = accion;

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
        console.log(this.timbrado);
        (this.timbrado.ult_usado) ? this.factura.numero = this.setearNroFactura(this.timbrado.ult_usado + 1) : this.factura.numero = this.setearNroFactura(1);
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
    let parametros = {
      paginar: true
    }
    const response: any = await this.facturaService.get(null, parametros);

    if (response.success) {
      this.listaFactura = null;
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
      const dataUlt = {
        ult_usado: this.factura.numero
      };

      const responseUltUsado: any = await this.timbradoService.updateUltUsado(dataUlt, this.factura.id_timbrado);

      this.paginacion();
      this.generarPdf();

      this.goFrmRegFactura = false;
      this.mostrarFormulario(false, "Listado");
    } else {

    }

  }

  async getFactura(id_factura) {
    const response: any = await this.facturaService.get(id_factura);

    if (response.success) {
      this.factura = response.data;
      await this.getTimbradoById(this.factura.id_timbrado);
      await this.getClienteById(this.factura.id_cliente);
      await this.getDetalleFactura(id_factura);
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

  generarPdf() {
    let data = document.getElementById('pdf');
    html2canvas(data).then(canvas => {
      let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
      // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
      // pdf.save('Filename.pdf');
      pdf.output('dataurlnewwindow');
    });
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
        this.mensajeError = 'No se encuentra el cliente'
      }
    } else {
      this.mensajeError = 'Error al obtener cliente'
    }
  }

  async getClienteById(id) {
    const response: any = await this.clienteService.get(id, null);

    if (response.success) {
      this.getCliente(response.data.ruc);
    } else {
      this.mensajeError = 'Error al obtener cliente'
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

  setearNroFactura(numero: number) {
    let str = numero.toString();
    let longitud: number = str.length;
    let ceros: string = "";

    for (let index = 1; longitud <= 7; index++) {
      ceros += "0";
      console.log(index);
    }

    return parseInt(ceros + str);
  }

}
