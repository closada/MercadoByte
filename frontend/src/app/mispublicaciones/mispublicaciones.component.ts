import { Component, OnInit } from '@angular/core';
import { AuthService } from '.././auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-mispublicaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mispublicaciones.component.html',
  styleUrl: './mispublicaciones.component.css'
})
export class MispublicacionesComponent implements OnInit {
  public idUsuario : number = 0;
  public tienepublic :boolean = false;
  public error: boolean = false;
  public publicaciones : any[] = [];

constructor (public AuthService: AuthService, private http: HttpClient) {}

ngOnInit() {
  if(this.AuthService.getUsuario()!==false)
  {
  this.idUsuario = <number>this.AuthService.getUsuario();
  this.traerCompras();
  }
}


traerCompras() {
  this.http.get('http://localhost/mercadobyte/public/api/publicaciones/' + this.idUsuario)
      .subscribe(
        (response: any) => {
          this.publicaciones = response;
          //console.log(this.compras);
          if(this.publicaciones.length > 0)
          {
            this.tienepublic = true;
          }
        },
        (error: any) => {
          this.error = true;
        }
      );
}

}