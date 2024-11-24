import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { MisdatosComponent } from './misdatos/misdatos.component';
import { MiscomprasComponent } from './miscompras/miscompras.component';
import { MisventasComponent } from './misventas/misventas.component';
import { MispublicacionesComponent } from './mispublicaciones/mispublicaciones.component';

import { authGuard } from './auth.guard';

export const routes: Routes = [
{path: '', component: InicioComponent},
{path: 'misdatos', component: MisdatosComponent, canActivate: [authGuard]},
{path: 'miscompras', component: MiscomprasComponent, canActivate: [authGuard]},
{path: 'misventas', component: MisventasComponent, canActivate: [authGuard]},
{path: 'mispublicaciones', component: MispublicacionesComponent, canActivate: [authGuard]},

	];
