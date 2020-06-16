import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usuario: Usuario;

  constructor(
    private usuarioService: UsuarioService
  ) {
    this.usuario = new Usuario(null, null, null, null, null, null);
  }

  async ngOnInit() {
    await this.getUsuario();

    this.usuarioService.loginEmitter
      .subscribe(response => {
        this.usuario = response;
      });

    this.usuarioService.logoutEmitter
      .subscribe(response => {
        this.usuario = response;
      });
  }

  async getUsuario() {
    this.usuario = await this.usuarioService.getUsuario();
  }
}
