import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { Storage } from "@capacitor/storage";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private menuCtrl: MenuController, private router: Router) { }

  async ngOnInit() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd && event.url === '/iniciar-sesion') {
        this.menuCtrl.enable(false);
      }
    });

    let negocio = await Storage.get({ key: 'negocioId' });
    if (!negocio.value) {
      this.router.navigate(['/iniciar-sesion']);
    }
  }

  async close() {
    await Storage.remove({ key: 'usuarioId' });
    await Storage.remove({ key: 'personaId' });
    await Storage.remove({ key: 'negocioId' });
    this.menuCtrl.enable(true);
    window.location.reload();
  }
}
