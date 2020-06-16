import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from "moment";
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { FacturaService } from 'src/app/services/factura.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { TimbradoService } from 'src/app/services/timbrado.service';
import { Timbrado } from 'src/app/models/timbrado';

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
  frmRegFactura: FormGroup

  paginaActual = 1;
  porPagina = 5;
  total;

  tipoFactura = 'CO';
  timbrado: Timbrado

  constructor(
    private formBuilder: FormBuilder,
    private facturaService: FacturaService,
    private clienteService: ClienteService,
    private timbradoService: TimbradoService
  ) {
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
      await this.getTimbradoActivo();
      this.crearFormulario();
    }
    this.goFrmRegFactura = false;
  }

  async getTimbradoActivo(pagina?, parametrosFiltro?) {
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
      }
    } else {

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

  crearFormulario(factura: any = {}) {
    if (!this.timbrado.ult_usado) {
      this.timbrado.ult_usado = "1";
    }else{
      this.timbrado.ult_usado = this.timbrado.ult_usado + 1;
    }

    factura.numero = this.setearNroFactura(this.timbrado.ult_usado);
    console.log(this.setearNroFactura(this.timbrado.ult_usado));
    console.log(factura);
    
    this.frmRegFactura = this.formBuilder.group({
      id: [factura.id],
      timbrado: [this.timbrado.numero, [Validators.required]],
      id_timbrado: [this.timbrado.id, [Validators.required]],
      fecha_emision: [factura.fecha_emision, [Validators.required]],
      numero: [factura.numero, [Validators.required]],
      tipo: [factura.tipo, [Validators.required]],
      id_cliente: [factura.id_cliente, [Validators.required]],
      ruc: [factura.ruc, [Validators.required]],
      razon_social: [factura.razon_social, [Validators.required]],
      direccion: [factura.direccion, [Validators.required]],
      total: [factura.total, [Validators.required]],
      exento: [factura.exento, [Validators.required]],
      iva_5: [factura.iva_5, [Validators.required]],
      iva_10: [factura.iva_10, [Validators.required]]
    });

    this.frmRegFactura.controls['timbrado'].disable();
    this.frmRegFactura.controls['numero'].disable();

    this.page = 'cabecera';
    this.listaServicios = [];

    this.inicilizarDetalleFactura();
    this.inicilizarDetalleTotal();
  }

  async submit() {
    this.goFrmRegFactura = true;

    this.frmRegFactura.controls['fecha_emision'].setValue(moment(this.frmRegFactura.value.fecha_emision).format('YYYY-MM-DD'));
    let factura: any = this.frmRegFactura.value;
    factura.detalles = this.listaServicios;


    const response: any = await this.facturaService.registrar(factura);

    if (response.success) {
      this.paginacion();
      this.generarPdf();

      this.goFrmRegFactura = false;
      this.frmRegFactura.reset();
      this.mostrarFormulario(false, "Listado");
    } else {

    }

  }

  async getFactura(id_factura) {
    const response: any = await this.facturaService.get(id_factura);

    if (response.success) {
      this.mostrarFormulario(true, 'Ver Factura');
    } else {

    }
  }

  cambiarFormatoFecha(event: any) {
    if (this.accion == 'Registrar') {
      this.frmRegFactura.value.fechaNacimiento = moment(event.value).format('DD/MM/YYYY');
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
      this.detalleTotal.iva_5 += this.detalleFactura.precio_unitario;
      this.detalleFactura.exento = this.detalleFactura.precio_unitario;
      this.detalleFactura.iva_5 = 0;
      this.detalleFactura.iva_10 = 0;
    }
    if (this.detalleFactura.impuesto == 5) {
      this.detalleFactura.exento = 0;
      this.detalleTotal.iva_5 += this.detalleFactura.precio_unitario;
      this.detalleFactura.iva_5 = this.detalleFactura.precio_unitario;
      this.detalleFactura.iva_10 = 0;
    }
    if (this.detalleFactura.impuesto == 10) {
      this.detalleFactura.exento = 0;
      this.detalleFactura.iva_5 = 0;
      this.detalleTotal.iva_10 += this.detalleFactura.precio_unitario;
      this.detalleFactura.iva_10 = this.detalleFactura.precio_unitario;
    }

    this.listaServicios.push(this.detalleFactura);

    //cargamos los totales por cada servicio insertado
    this.frmRegFactura.controls['total'].setValue(this.detalleTotal.total);
    this.frmRegFactura.controls['exento'].setValue(this.detalleTotal.iva_5);
    this.frmRegFactura.controls['iva_5'].setValue(this.detalleTotal.iva_5);
    this.frmRegFactura.controls['iva_10'].setValue(this.detalleTotal.iva_10);

    this.inicilizarDetalleFactura();

    this.goFrmServicio = false;

  }

  eliminarServicio(index) {
    //se restan los totales
    this.detalleTotal.total -= this.listaServicios[0].precio_unitario * this.listaServicios[0].cantidad;

    if (this.listaServicios[0].impuesto == 0) {
      this.detalleTotal.iva_5 -= this.listaServicios[0].precio_unitario;
    }
    if (this.listaServicios[0].impuesto == 5) {
      this.detalleTotal.iva_5 -= this.listaServicios[0].precio_unitario;
    }
    if (this.listaServicios[0].impuesto == 10) {
      this.detalleTotal.iva_10 -= this.listaServicios[0].precio_unitario;
    }

    //cargamos los totales por cada servicio insertado
    this.frmRegFactura.controls['total'].setValue(this.detalleTotal.total);
    this.frmRegFactura.controls['exento'].setValue(this.detalleTotal.iva_5);
    this.frmRegFactura.controls['iva_5'].setValue(this.detalleTotal.iva_5);
    this.frmRegFactura.controls['iva_10'].setValue(this.detalleTotal.iva_10);

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

  async getCliente(rucBusqueda) {
    let parametros = {
      ruc: rucBusqueda
    }

    const response: any = await this.clienteService.get(null, parametros);

    if (response.success) {
      if (response.data[0].razon_social) {
        this.frmRegFactura.controls['id_cliente'].setValue(response.data[0].id);
        this.frmRegFactura.controls['razon_social'].setValue(response.data[0].razon_social);
        this.frmRegFactura.controls['direccion'].setValue(response.data[0].direccion);
      } else {

        this.mensajeError = 'No se encuentra el cliente'
      }
    } else {
      this.mensajeError = 'Error al obtener cliente'
    }
  }

  moverPage(pageValue) {
    if (pageValue == 'detalle') {
      if (!this.frmRegFactura.value.numero || !this.frmRegFactura.value.fecha_emision
        || !this.frmRegFactura.value.ruc || !this.frmRegFactura.value.razon_social || !this.frmRegFactura.value.direccion) {
        this.goFrmRegFactura = true;
        this.mensajeError = 'Debe completar todos los campos'
        return;
      }
    }
    this.page = pageValue;
  }

  setearNroFactura(numero){
    let longitud: number = numero.length;
    let ceros: string = "";
    console.log(longitud);
    // for (let index = 1; longitud <= 7; index++) {
    //   ceros += "0";
    //   console.log(ceros);
    // }

    return ceros + numero;
  }

}
