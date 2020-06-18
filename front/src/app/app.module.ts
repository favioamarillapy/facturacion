import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NgxPaginationModule } from 'ngx-pagination';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MAT_DATE_LOCALE, MatSelectModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FacturacionComponent } from './pages/facturacion/facturacion.component';
import { HeaderComponent } from './pages/header/header.component';
import { UsuarioService } from './services/usuario.service';
import { FooterComponent } from './pages/footer/footer.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PaginacionComponent } from './common/paginacion/paginacion.component';
import { HttpClientModule } from '@angular/common/http';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { TimbradoComponent } from './pages/timbrado/timbrado.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FacturacionComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    PaginacionComponent,
    ClienteComponent,
    TimbradoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBuZNII7koDWPXeKDT9IeSEuWezvQqlZ8c'
    }),
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [
    UsuarioService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
