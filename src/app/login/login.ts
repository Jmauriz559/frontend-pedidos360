import { Component, Inject } from '@angular/core';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService
  ) { }

  async iniciarSesion() {
    // 1. Forzamos el encendido del motor de MSAL antes de hacer cualquier cosa
    await this.authService.instance.initialize();

    // 2. Ejecutamos la redirección oficial a Microsoft
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
  }
}