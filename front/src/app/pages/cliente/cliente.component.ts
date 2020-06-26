import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  public cargando: boolean = false;
  public form = false;
  public accion: string = 'Listado';
  public cliente: Cliente;
  public listaCliente: Cliente;
  public parametros: any = {};
  public filtrosTabla: any = {};
  public parametrosTabla: any = []
  public paginaActual = 1;
  public porPagina;
  public total;

  public mensaje: '';
  public success: false;

  constructor(
    private clienteService: ClienteService
  ) {
    this.inicializarFiltros();
    this.cliente = new Cliente(null, null, null, null, null);
  }

  ngOnInit() {
    this.paginacion(this.paginaActual);
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      ruc: '',
      razon_social: '',
      telefono: '',
      direccion: ''
    }
  }

  mostrarFormulario(flag, accion, limpiarError?) {
    this.form = flag
    this.accion = accion;
    this.mensaje = '';
    this.success = false;

    if (flag && accion == 'Registrar') {
      this.cliente = new Cliente(null, null, null, null, null);
    }
  }

  async paginacion(pagina?, parametrosFiltro?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listaCliente = null;
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

    const response: any = await this.clienteService.get(null, this.parametros);
    if (response.success) {
      this.listaCliente = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {

    }

    this.cargando = false;
  }

  async getCliente(id) {
    this.accion = 'Listado';
    this.cargando = true;
    const response: any = await this.clienteService.get(id);

    if (response.success) {
      this.cliente = response.data;
      this.mostrarFormulario(true, 'Actualizar');
    } else {

      this.mostrarFormulario(false, 'Listado');
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    const response: any = await this.clienteService.registrar(this.cliente);

    this.cargando = false;

    this.mensaje = response.message;
    this.success = response.success

    if (response.success) {
      this.paginacion();
      setTimeout(() => {
        this.mostrarFormulario(false, 'Listado');
      }, 1500);
    } else {

    }
  }

  async actualizar() {
    this.cargando = true;
    const response: any = await this.clienteService.actualizar(this.cliente, this.cliente.id);

    this.cargando = false;
    
    this.mensaje = response.message;
    this.success = response.success

    if (response.success) {
      this.paginacion();
      setTimeout(() => {
        this.mostrarFormulario(false, 'Listado');
      }, 1500);
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

}
