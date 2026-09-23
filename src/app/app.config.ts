import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';

// Importaciones de MSAL
import {
  MsalGuard, MsalInterceptor, MsalBroadcastService, MsalService,
  MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration, MsalInterceptorConfiguration
} from '@azure/msal-angular';
import {
  IPublicClientApplication, PublicClientApplication, InteractionType, BrowserCacheLocation
} from '@azure/msal-browser';

// 1. Configuración principal de la instancia de MSAL
export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientId,
      authority: `https://login.microsoftonline.com/${environment.tenantId}`,
      redirectUri: environment.redirectUri
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage
    }
  });
}

// 2. Configuración del Interceptor (El puente a tu BFF/API en la nube)
export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();

  // Apuntamos directamente a la API configurada en el environment de forma centralizada y limpia
  protectedResourceMap.set(`${environment.apiUrl}/*`, ['api://07250aed-3169-4f84-aebf-a14b946a0807/.default']);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

// 3. Configuración del Guard (Protección de pantallas)
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read']
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true },
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ]
};
