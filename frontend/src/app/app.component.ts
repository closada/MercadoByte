import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { popper } from '@popperjs/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Modal } from 'bootstrap';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, NgbModule, FormsModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'mercadobyte';
  usuarioaut = false;
  public opMenu: any[] = [];
  public email: string = '';
  public clave: string = '';
  public error: boolean = false;

constructor (public AuthService: AuthService, private router: Router, private http: HttpClient) {}

    openModal() {
    const modalElement = document.getElementById('loginModal');
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

ngOnInit () {
  this.usuarioaut = this.AuthService.estaAutenticado();
  this.router.navigate(['/']);
  if (this.usuarioaut)
    {
      this.setMenu();
    }

}
    logout() {
    this.AuthService.logout();
    this.router.navigate(['/']);
    this.usuarioaut = this.AuthService.estaAutenticado();
    this.setMenu();
  }

    setMenu() {
      //console.log(localStorage.getItem('jwt_token'));
    const token = this.AuthService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));  // Decodifica el payload del JWT
        const idRol = payload.id_rol || 0;  // Extrae el campo exp (tiempo de expiración en segundos)
        this.traerMenu(idRol);  
        return true
      } catch (error) {
        return false;  // Si hay un error en el token, asume que está expirado
      }
    }
    return false
    }

    traerMenu(idRol: number) {

    this.http.get('http://localhost/mercadobyte/public/api/menu/' + idRol)
      .subscribe(
        (response: any) => {
          this.opMenu = response;
          //console.log(this.opMenu);
        },
        (error: any) => {
          this.error = true;
        }
      );
    } 

    login(): void {
    this.AuthService.login({ email: this.email, clave: this.clave })
      .subscribe(
        (response) => {
           // Cierra el modal correctamente
      const modalElement = document.getElementById('loginModal');
      if (modalElement) {
        const modalInstance = Modal.getInstance(modalElement); // Recupera la instancia del modal
        if (modalInstance) {
          modalInstance.hide(); // Cierra el modal
        }
      }

      // Elimina manualmente el backdrop si persiste
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      // modificamos la variable de usuario autenticado
      //this.router.navigate(['/misdatos']);
      this.usuarioaut = this.AuthService.estaAutenticado();;

      // traemos el menu correspondiente
      this.setMenu();
        },
        (error) => {
          this.error = true;
          this.email = this.clave = '';
        }
      );
  }
}
