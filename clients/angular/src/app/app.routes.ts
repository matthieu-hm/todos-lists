import { Routes } from '@angular/router';
import { LayoutComponent } from './components';
import { currentUserResolver } from './resolvers';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/route-auth/route-auth.module').then((m) => m.RouteAuthModule),
  },
  {
    path: '',
    resolve: {
      currentUser: currentUserResolver,
    },
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./modules/route-home/route-home.module').then((m) => m.RouteHomeModule),
      },
    ],
  },
];
