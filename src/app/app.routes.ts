import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Incidencias } from './pages/incidencias/incidencias';

import { IncidenciaDetalle } from './pages/incidencia-detalle/incidencia-detalle';

import { IncidenciaNueva } from './pages/incidencia-nueva/incidencia-nueva';

import { authGuard } from './core/guards/auth-guard';

import { Usuarios } from './pages/usuarios/usuarios';

import { TiposIncidencia } from './pages/tipos-incidencia/tipos-incidencia';

import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    component: Login,
  },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },

  {
    path: 'incidencias',
    component: Incidencias,
    canActivate: [authGuard],
  },

  // IMPORTANTE:
  // debe estar antes de incidencias/:id

  {
    path: 'incidencias/nueva',
    component: IncidenciaNueva,
    canActivate: [authGuard],
  },

  {
    path: 'incidencias/:id',
    component: IncidenciaDetalle,
    canActivate: [authGuard],
  },

  {
    path: 'usuarios',
    component: Usuarios,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'tipos-incidencia',
    component: TiposIncidencia,
    canActivate: [authGuard, adminGuard],
  },
];
