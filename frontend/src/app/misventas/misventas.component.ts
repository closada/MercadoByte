import { Component, OnInit } from '@angular/core';
import { AuthService } from '.././auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-misventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './misventas.component.html',
  styleUrl: './misventas.component.css'
})
export class MisventasComponent implements OnInit {
  public idUsuario : number = 0;
  public tieneventas :boolean = false;
  public error: boolean = false;
  public ventas : any[] = [];

constructor (public AuthService: AuthService, private http: HttpClient) {}

ngOnInit() {
  if(this.AuthService.getUsuario()!==false)
  {
  this.idUsuario = <number>this.AuthService.getUsuario();
  this.traerCompras();
  }
}


traerCompras() {
  this.http.get('http://localhost/mercadobyte/public/api/ventas/' + this.idUsuario)
      .subscribe(
        (response: any) => {
          this.ventas = response;
          //console.log(this.compras);
          if(this.ventas.length > 0)
          {
            this.tieneventas = true;
          }
        },
        (error: any) => {
          this.error = true;
        }
      );
}

}