import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  acceso: boolean;
  goFrmLogin: boolean;
  frmLogin: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.crearFormulario();
    this.goFrmLogin = false;
    this.acceso = true;
  }

  async crearFormulario() {
    this.frmLogin = this.formBuilder.group({
      email: ['', [Validators.required]],
      clave_acceso: ['', [Validators.required]],
    });
  }

  async login() {
    const response: any = await this.usuarioService.iniciarSession(this.frmLogin.value);
    if (response.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.acceso = false;
    };

  }
}
