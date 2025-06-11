import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { authoUsuarioLoading } from './store/IniciarSesion.store';
import { AppState } from './store/store';
import { Storage } from "@capacitor/storage";

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})
export class IniciarSesionPage implements OnInit {

  form: FormGroup;

  constructor(public formBuilder: FormBuilder, private menuCtrl: MenuController, private router: Router, private store: Store<AppState>, private alertController: AlertController) { }

  ngOnInit() {
    this.menuCtrl.enable(false);

    this.store.select('authoUsuario').subscribe(async s => {
      if (s.response && s.response.rol == 'CLIENTE') {
        await Storage.set({ key: 'negocioId', value: s.response.negocioId.toString() });
        await Storage.set({ key: 'usuarioId', value: s.response.id.toString() });
        this.limpiar();
        this.menuCtrl.enable(true);
        this.router.navigate(['/negocios'])
      }
      if (s.error) {
        this.alertaError('Alerta', 'Credenciales erróneas');
      }
    });

    this.form = this.formBuilder.group({
      apodo: ['', [Validators.required, Validators.minLength(1)]],
      contrasenia: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  guardar() {
    this.store.dispatch(authoUsuarioLoading({ lang: 'es', request: this.form.value }));
  }

  limpiar() {
    this.form.reset();
  }
  
  async alertaError(titulo: string, mensage: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensage,
      buttons: ['Cerrar']
    });
    await alert.present();
  }
}
