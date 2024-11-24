import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { AuthService } from '.././auth.service';
import { Modal } from 'bootstrap';

import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-misdatos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './misdatos.component.html',
  styleUrl: './misdatos.component.css'
})
export class MisdatosComponent implements OnInit{
public miFormulario: FormGroup;
public idUsuario: number = 0;
public misDatos :any[] = [];
public localidades :any[] = [];
public error: boolean = false;

constructor (public AuthService: AuthService, private http: HttpClient, private fb: FormBuilder){
 this.miFormulario = this.fb.group({
      id: [null, []],
      nombre: ['', [Validators.required ]],
      dni: ['', [Validators.required ]],
      email: ['', [Validators.required, Validators.email ]],
      domicilio: ['', [Validators.required ]],
      id_localidad: ['', [Validators.required, Validators.min(1) ]],
      password: ['', [Validators.required ]],
      
    });
}

ngOnInit()
{
  if(this.AuthService.getUsuario()!==false)
  {
    this.idUsuario = <number>this.AuthService.getUsuario();
    this.traerDatos(this.idUsuario);
    this.traerLocalidades();
  }
}

traerDatos(id: number) {
  this.http.get('http://localhost/mercadobyte/public/api/misdatos/' + id)
      .subscribe(
        (response: any) => {
          this.miFormulario.reset(response);
          this.misDatos = response;
          //console.log(this.misDatos);
        },
        (error: any) => {
          this.error = true;
          console.error(error);
        }
      );
}

traerLocalidades() {
    this.http.get('http://localhost/mercadobyte/public/api/localidades')
      .subscribe(
        (response: any) => {
          this.localidades = response;
        },
        (error: any) => {
          this.error = true;
          console.error(error);
        }
      );
}

guardar() {
  this.http.patch('http://localhost/mercadobyte/public/api/usuario/' + this.miFormulario.value.id, this.miFormulario.value)
        .subscribe(
          (response: any) => {
                const modalElement = document.getElementById('cambiosModal');
          if (modalElement) {
            const modal = new Modal(modalElement);
            modal.show();
          }
    
            this.traerDatos(this.idUsuario);
            this.traerLocalidades();
          },
          (error) => {
            console.error(error);
          }
        );
}
}
