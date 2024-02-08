import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { routes } from './app.routes';
import { EnvModule } from './modules/env';
import { ApiModule } from './modules/api';
import { AuthModule } from './modules/auth';

// import 'bootstrap/js/src/alert';
// import 'bootstrap/js/src/button';
// import 'bootstrap/js/src/carousel';
// import 'bootstrap/js/src/collapse';
import 'bootstrap/js/src/dropdown';
// import 'bootstrap/js/src/modal'; // ngx-bootstrap
import 'bootstrap/js/src/offcanvas';
// import 'bootstrap/js/src/popover';
// import 'bootstrap/js/src/scrollspy';
// import 'bootstrap/js/src/tab';
// import 'bootstrap/js/src/toast';
// import 'bootstrap/js/src/tooltip';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(EnvModule.forRoot(environment)),
    importProvidersFrom(ApiModule),
    importProvidersFrom(AuthModule),
    importProvidersFrom(ModalModule.forRoot()),
    importProvidersFrom(ReactiveFormsModule),
  ],
};
