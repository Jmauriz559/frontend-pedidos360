import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App implements OnInit {

  constructor(
    private msalService: MsalService,
    private router: Router // Agregamos el enrutador
  ) { }

  ngOnInit(): void {
    this.msalService.instance.initialize().then(() => {
      // Esta función "atrapa" al usuario cuando vuelve de Microsoft
      this.msalService.handleRedirectObservable().subscribe({
        next: (respuesta) => {
          // Si hay una respuesta válida con una cuenta, iniciamos sesión y cambiamos de ruta
          if (respuesta !== null && respuesta.account !== null) {
            this.msalService.instance.setActiveAccount(respuesta.account);
            this.router.navigate(['/dashboard']); // ¡El salto automático al Dashboard!
          }
        }
      });
    });
  }
}