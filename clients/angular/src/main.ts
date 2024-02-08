import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';

import { environment } from './environments/environment';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/components';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
