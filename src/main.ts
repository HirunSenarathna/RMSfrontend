import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { routes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideHttpClient(),providePrimeNG({
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: false || 'none'
    }
    }
})]
})
  .catch((err) => console.error(err));
