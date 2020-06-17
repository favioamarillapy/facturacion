import { Component, OnInit } from '@angular/core';
import { Timbrado } from 'src/app/models/timbrado';
import { TimbradoService } from 'src/app/services/timbrado.service';
import * as moment from "moment";

@Component({
  selector: 'app-timbrado',
  templateUrl: './timbrado.component.html',
  styleUrls: ['./timbrado.component.css']
})
export class TimbradoComponent implements OnInit {

  public cargando: boolean = false;
  public form = false;
  public accion: string = 'Listado';
  public timbrado: Timbrado;
  public listaTimbrado: Timbrado;
  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []
  public paginaActual = 1;
  public porPagina;
  public total;

  constructor(
    private timbradoService: TimbradoService
  ) {
    this.inicializarFiltros();
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      nombre: ''
    }
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;

    if (flag && accion == 'Registrar') {
      this.timbrado = new Timbrado(null, null, null, null, null);
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaTimbrado = null;
    this.accion = 'Listado';
    this.cargando = true;

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

    const response: any = await this.timbradoService.get(null, this.parametros);
    if (response.success) {
      this.listaTimbrado = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {

    }

    this.cargando = false;
  }

  async getTimbrado(id) {
    this.accion = 'Listado';
    this.cargando = true;
    const response: any = await this.timbradoService.get(id);
    
    if (response.success) {
      this.timbrado = response.data;

      this.mostrarFormulario(true, 'Actualizar');
    } else {

      this.mostrarFormulario(false, 'Listado');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;

    this.timbrado.fecha_desde = moment(this.timbrado.fecha_desde).format('YYYY-MM-DD')
    this.timbrado.fecha_hasta = moment(this.timbrado.fecha_hasta).format('YYYY-MM-DD');

    const response: any = await this.timbradoService.registrar(this.timbrado);
    this.cargando = false;
    if (response.success) {
      this.paginacion();
      this.mostrarFormulario(false, 'Listado');
    } else {

    }
  }

  async actualizar() {
    this.cargando = true;

    this.timbrado.fecha_desde = moment(this.timbrado.fecha_desde).format('YYYY-MM-DD')
    this.timbrado.fecha_hasta = moment(this.timbrado.fecha_hasta).format('YYYY-MM-DD');
console.log(this.timbrado);
    const response: any = await this.timbradoService.actualizar(this.timbrado, this.timbrado.id);
console.log(response)
    this.cargando = false;
    if (response.success) {
      this.paginacion();
      this.mostrarFormulario(false, 'Listado');
    } else {

    }
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

  cambiarFormatoFecha(event: any, verificador: string) {
    if (this.accion == 'Registrar') {
      if (verificador == 'desde') {
        this.timbrado.fecha_desde = moment(event.value).format('YYYY-MM-DD');
      } else {
        this.timbrado.fecha_hasta = moment(event.value).format('YYYY-MM-DD');
      }
    }
  }

  getFechaDatepicker(date) {
    const separado = date.split("/");
    return new Date(separado[2], separado[1] - 1, separado[0]);
  }

}
