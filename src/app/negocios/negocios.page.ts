import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Store } from '@ngrx/store';
import { AppState } from './store/store';
import { obtenerNegociosLoading, Page } from './store/obtenerNegocios.store';
import { crearNegocioLoading } from './store/crearNegocio.store';
import { actualizarNegocioLoading } from './store/actualizarNegocio.store';
import { AlertController } from '@ionic/angular';
import { actualizarPersonaLoading } from './store/actualizarPersona.store';
import { crearPersonaLoading } from './store/crearPersona.store';
import { actualizarUsuarioLoading } from './store/actualizarUsuario.store';
import { crearUsuarioLoading } from './store/crearUsuario.store';
import { obtenerUsuariosLoading } from './store/obtenerUsuarios.store';
import { obtenerPersonasLoading } from './store/obtenerPersonas.store';
import { Storage } from "@capacitor/storage";

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.page.html',
  styleUrls: ['./negocios.page.scss'],
})
export class NegociosPage implements OnInit {

  negocioId: number;
  usuarioId: number;
  personaId: number;
  horarios: any[] = []; 
  formNegocio: FormGroup;
  formUsuario: FormGroup;
  formPersona: FormGroup;
  modificarNegocio: boolean = true;
  modificarUsuario: boolean = true;
  modificarPersona: boolean = true;

  constructor(private alertController: AlertController, public formBuilder: FormBuilder, private store: Store<AppState>) { }

  async ngOnInit() {
    this.store.select('obtenerNegocios').subscribe(async s => {
      if (s.pageNegocio) {
        let dato = s.pageNegocio.contenido[0];
        await Storage.set({ key: 'negocioId', value: dato.id.toString() });
        this.negocioId = dato.id;
        this.formNegocio.controls.nombre.setValue(dato.nombre);
        this.formNegocio.controls.estatus.setValue(dato.estatus.toString());
        this.formNegocio.controls.descripcion.setValue(dato.descripcion);
        this.formNegocio.controls.lugar.setValue(dato.lugar);
        this.formNegocio.controls.mapa.setValue(dato.mapa);
        this.formNegocio.controls.imagen.setValue(dato.imagen);
        this.horarios = [];
        this.horarios = dato.horarios.map(horario => { return { abre: horario.abre, cierre: horario.cierre, dia: horario.dia }; });
      }
    });

    this.store.select('obtenerUsuarios').subscribe(async s => {
      if (s.pageUsuario) {
        let dato = s.pageUsuario.contenido[0];
        await Storage.set({ key: 'usuarioId', value: dato.id.toString() });
        this.usuarioId = dato.id;
        this.formUsuario.controls.apodo.setValue(dato.apodo);
        this.formUsuario.controls.contrasenia.setValue(dato.contrasenia);
        this.formUsuario.controls.rol.setValue(dato.rol);
        this.formUsuario.controls.estatus.setValue(dato.estatus.toString());    
      }
    });

    this.store.select('obtenerPersonas').subscribe(async s => {
      if (s.pagePersona) {
        let dato = s.pagePersona.contenido[0];
        await Storage.set({ key: 'personaId', value: dato.id.toString() });
        this.personaId = dato.id;
        this.formPersona.controls.correo.setValue(dato.correo);
        this.formPersona.controls.nombre.setValue(dato.nombre);
        this.formPersona.controls.apellidoPaterno.setValue(dato.apellidoPaterno);
        this.formPersona.controls.apellidoMaterno.setValue(dato.apellidoMaterno);
        this.formPersona.controls.edad.setValue(dato.edad);
        this.formPersona.controls.telefono.setValue(dato.telefono);
        this.formPersona.controls.estatus.setValue(dato.estatus.toString());
      }
    });

    this.store.select('crearNegocio').subscribe(s => {
      if (s.response) {
        this.modificarNegocio = false;
        this.store.dispatch(obtenerNegociosLoading({ lang: 'es', pagina: 0, tamanio: 5, busqueda: "", id: s.response.id }));
      }
    });

    this.store.select('crearUsuario').subscribe(s => {
      if (s.response) {
        this.modificarUsuario = false;
        this.store.dispatch(obtenerUsuariosLoading({ lang: 'es', pagina: 0, tamanio: 5, busqueda: "", id: s.response.id }));
      }
    });

    this.store.select('crearPersona').subscribe(s => {
      if (s.response) {
        this.modificarPersona = false;
        this.store.dispatch(obtenerPersonasLoading({ lang: 'es', pagina: 0, tamanio: 5, busqueda: "", usuarioId: s.response.usuario.id }));
      }
    });

    this.store.select('actualizarNegocio').subscribe(s => {
      if (s.response) {
        this.store.dispatch(obtenerNegociosLoading({ lang: 'es', pagina: 0, tamanio: 5, busqueda: "", id: s.response.id }));
      }
    });

    this.store.select('actualizarUsuario').subscribe(s => {
      if (s.response) {
        this.store.dispatch(obtenerUsuariosLoading({ lang: 'es', pagina: 0, tamanio: 5, busqueda: "", id: s.response.id }));
      }
    });

    this.store.select('actualizarPersona').subscribe(s => {
      if (s.response) {
        this.store.dispatch(obtenerPersonasLoading({ lang: 'es', pagina: 0, tamanio: 5, busqueda: "", usuarioId: s.response.usuario.id }));
      }
    });

    this.formNegocio = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      estatus: ['', [Validators.required, Validators.minLength(1)]],
      descripcion: ['', []],
      lugar: ['', [Validators.required, Validators.minLength(1)]],
      mapa: ['', [Validators.required, Validators.minLength(1)]],
      imagen: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/\(\)]*)?$/)]]
    });
    
    this.formUsuario = this.formBuilder.group({
      apodo: ['', [Validators.required, Validators.minLength(1)]],
      contrasenia: ['', [Validators.required, Validators.minLength(1)]],
      rol: ['', [Validators.required, Validators.minLength(1)]],
      estatus: ['', [Validators.required, Validators.minLength(1)]]
    });

    this.formPersona = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.minLength(1)]],
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(1)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(1)]],
      edad: ['', [Validators.required, Validators.minLength(1)]],
      telefono: ['', [Validators.required, Validators.minLength(1)]],
      estatus: ['', [Validators.required, Validators.minLength(1)]]
    });
    
    let negocio = await Storage.get({ key: 'negocioId' });
    if (negocio.value) {
      this.store.dispatch(obtenerNegociosLoading({ lang: 'es', pagina: 0, tamanio: 5, busqueda: "", id: Number(negocio.value) }));
    }

    let usuario = await Storage.get({ key: 'usuarioId' });
    if (usuario.value) {
      this.store.dispatch(obtenerUsuariosLoading({ lang: 'es', pagina: 0, tamanio: 5, busqueda: "", id: Number(usuario.value) }));
      this.store.dispatch(obtenerPersonasLoading({ lang: 'es', pagina: 0, tamanio: 5, busqueda: "", usuarioId: Number(usuario.value) }));
    }
  }

  guardarNegocio() {
    let dato = this.formNegocio.value;
    dato.horarios = this.horarios;
    if (this.negocioId) {
      this.store.dispatch(actualizarNegocioLoading({ lang: 'es', id: this.negocioId, request: dato }));
    } else {
      this.store.dispatch(crearNegocioLoading({ lang: 'es', request: dato }));      
    }
  }

  guardarPersona() {
    let dato = this.formPersona.value;
    dato.usuarioId = this.usuarioId;
    if (this.personaId) {
      this.store.dispatch(actualizarPersonaLoading({ lang: 'es', id: this.personaId, request: dato }));
    } else {
      this.store.dispatch(crearPersonaLoading({ lang: 'es', request: dato }));
    }
  }

  guardarUsuario() {
    let dato = this.formUsuario.value;
    dato.negocioId = this.negocioId;
    if (this.usuarioId) {
      this.store.dispatch(actualizarUsuarioLoading({ lang: 'es', id: this.usuarioId, request: dato }));
    } else {
      this.store.dispatch(crearUsuarioLoading({ lang: 'es', request: dato }));      
    }
  }

  tansformarIFrame(event) {
    let mapa: string = event.target.value;
    if (mapa.split('src="').length > 1) {
      event.target.value = mapa.split('src="')[1].split('"')[0]
    }
  }
  
  refrescar(event) {
    this.ngOnInit();
    event.target.complete();
  }

  async nuevoHorario(index: number = undefined) {
    let horario = { abre: '', cierre: '', dia:'' };
    const diaAlert = await this.alertController.create({
      header: 'Dia',
      inputs: [
        {
          label: 'LUNES',
          type: 'radio',
          value: 'LUNES',
          checked: (index != undefined)? this.horarios[index].dia == 'LUNES': false
        },
        {
          label: 'MARTES',
          type: 'radio',
          value: 'MARTES',
          checked: (index != undefined)? this.horarios[index].dia == 'MARTES': false
        },
        {
          label: 'MIERCOLES',
          type: 'radio',
          value: 'MIERCOLES',
          checked: (index != undefined)? this.horarios[index].dia == 'MIERCOLES': false
        },
        {
          label: 'JUEVES',
          type: 'radio',
          value: 'JUEVES',
          checked: (index != undefined)? this.horarios[index].dia == 'JUEVES': false
        },
        {
          label: 'VIERNES',
          type: 'radio',
          value: 'VIERNES',
          checked: (index != undefined)? this.horarios[index].dia == 'VIERNES': false
        },
        {
          label: 'SABADO',
          type: 'radio',
          value: 'SABADO',
          checked: (index != undefined)? this.horarios[index].dia == 'SABADO': false
        },
        {
          label: 'DOMINGO',
          type: 'radio',
          value: 'DOMINGO',
          checked: (index != undefined)? this.horarios[index].dia == 'DOMINGO': false
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: "Confirmar",
          handler: (value) => {
            if (!value) {
              return false;
            }
            horario.dia = value;
            if (index != undefined) {
              this.horarios = this.horarios.filter(horario => horario != this.horarios[index]);
            }
            this.horarios.push(horario);
          }
        }
      ]
    });

    const horarioAlert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Horario',
      inputs: [
        {
          type: 'text',
          disabled: true,
          placeholder: "Abre"
        },
        {
          name: 'abre',
          id: 'abre',
          type: 'time',
          value: (index != undefined)? this.horarios[index].abre: ''
        },
        {
          type: 'text',
          disabled: true,
          placeholder: "Cierre"
        },
        {
          name: 'cierre',
          id: 'cierre',
          type: 'time',
          value: (index != undefined)? this.horarios[index].cierre: ''
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: "Confirmar",
          handler: (value) => {
            if (!value.abre || !value.cierre) {
              return false;
            }
            horario.abre = value.abre;
            horario.cierre = value.cierre;
            diaAlert.present();
          }
        }
      ]
    });

    await horarioAlert.present();
  }

  eliminarHorario(index: number) {
    this.horarios = this.horarios.filter(horario => horario != this.horarios[index]);
  }
}
