import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost/mercadobyte/public/api';

  constructor(private http: HttpClient) {}

  login(credenciales: { email: string; clave: string }) {
    return this.http.post(this.apiUrl + '/login', credenciales).pipe(
      tap((response: any) => {
        if (response.jwt) {
          localStorage.setItem('jwt_token', response.jwt);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  esVigente(): boolean {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));  // Decodifica el payload del JWT
        const expira = payload.exp || 0;  // Extrae el campo exp (tiempo de expiración en segundos)
        const horaActual = Math.floor(Date.now() / 1000);  // Obtiene el tiempo actual en segundos
        return expira > horaActual;  // Retorna true si el token está expirado
      } catch (error) {
        return false;  // Si hay un error en el token, asume que está expirado
      }
    }
    return false
  }

  estaAutenticado(): boolean {
    return this.esVigente();
  }

  getUsuario(): number | boolean {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));  // Decodifica el payload del JWT
        const id = payload.id || 0;  // Extrae el campo exp (tiempo de expiración en segundos)
        const expira = payload.exp || 0;  // Extrae el campo exp (tiempo de expiración en segundos)
        const horaActual = Math.floor(Date.now() / 1000);  // Obtiene el tiempo actual en segundos
        if (expira > horaActual) {
          return id;  
          }
         
      } catch (error) {
        return false;  // Si hay un error en el token, asume que está expirado
      }
    }
    return false;
  }
}
