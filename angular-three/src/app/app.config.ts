import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { AppComponent } from './app.component';
import { StatsComponent } from './pages/Stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    StatsComponent
  ],
  imports: [
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch()) ,provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration()]
};


