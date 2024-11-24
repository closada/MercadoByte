import { Component, OnInit } from '@angular/core';
import { AuthService } from '.././auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-miscompras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './miscompras.component.html',
  styleUrl: './miscompras.component.css'
})
export class MiscomprasComponent implements OnInit {
  public idUsuario : number = 0;
  public tienecompras :boolean = false;
  public error: boolean = false;
  public compras : any[] = [];

constructor (public AuthService: AuthService, private http: HttpClient) {}

ngOnInit() {
  if(this.AuthService.getUsuario()!==false)
  {
  this.idUsuario = <number>this.AuthService.getUsuario();
  this.traerCompras();
  }
}


traerCompras() {
  this.http.get('http://localhost/mercadobyte/public/api/compras/' + this.idUsuario)
      .subscribe(
        (response: any) => {
          this.compras = response;
          //console.log(this.compras);
          if(this.compras.length > 0)
          {
            this.tienecompras = true;
          }
        },
        (error: any) => {
          this.error = true;
        }
      );
}

}
