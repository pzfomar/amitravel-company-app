import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { actualizarEventoLoading } from './store/actualizarEvento.store';
import { crearEventoLoading } from './store/crearEvento.store';
import { eliminarEventoLoading } from './store/eliminarEvento.store';
import { obtenerEventosLoading, Page } from './store/obtenerEventos.store';
import { AppState } from './store/store';
import { listaNegociosLoading } from './store/listaNegocios.store';
import { AlertController } from '@ionic/angular';
import { Storage } from "@capacitor/storage";

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

  form: FormGroup;
  page: Page;
  id: number;
  busqueda: string = '';
  negocios;
  horarios: any[] = []; 
  isModalOpen: boolean = false;

  constructor(private alertController: AlertController, public formBuilder: FormBuilder, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('listaNegocios').subscribe(s => {
      this.negocios = s.negocios;
    });
    this.store.dispatch(listaNegociosLoading({ lang: 'es' }));

    this.store.select('obtenerEventos').subscribe(s => {
      this.page = s.pageEvento;
    });
    this.seleccionarPagina(0);

    this.store.select('crearEvento').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('actualizarEvento').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('eliminarEvento').subscribe(s => {
      if (s.loaded) {
        this.seleccionarPagina(0);
      }
    });

    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      estatus: ['', [Validators.required, Validators.minLength(1)]],
      descripcion: ['', []],
      mapa: ['', [Validators.required, Validators.minLength(1)]],
      imagen: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/\(\)]*)?$/)]],
      tipo: ['', [Validators.required, Validators.minLength(1)]],
      lugar: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  async guardar() {
    let negocio = await Storage.get({ key: 'negocioId' });
    if (!negocio.value) {
      return false;
    }
    
    let dato = this.form.value;
    dato.negocioId = Number(negocio.value);
    dato.horarios = this.horarios;
    console.log(dato);
    if (this.id) {
      this.store.dispatch(actualizarEventoLoading({ lang: 'es', id: this.id, request: dato }));
    } else {
      this.store.dispatch(crearEventoLoading({ lang: 'es', request: dato }));      
    }
  }

  editar(dato: any) {
    this.isModalOpen = true;
    this.id = dato.id;
    this.form.controls.nombre.setValue(dato.nombre);
    this.form.controls.estatus.setValue(dato.estatus.toString());
    this.form.controls.descripcion.setValue(dato.descripcion);
    this.form.controls.imagen.setValue(dato.imagen);
    this.form.controls.tipo.setValue(dato.tipo);
    this.form.controls.lugar.setValue(dato.lugar);
    this.form.controls.mapa.setValue(dato.mapa);
    this.horarios = [];
    this.horarios = dato.horarios.map(horario => { return { abre: horario.abre, cierre: horario.cierre, dia: horario.dia }; });
  }

  eliminar(id: number){
    this.store.dispatch(eliminarEventoLoading({ lang: 'es', id: id }));
  }

  limpiar() {
    this.id = null;
    this.form.reset();
    this.horarios = [];
    this.isModalOpen = false;
  }

  buscar(texto: string){
    this.busqueda = texto;
    this.seleccionarPagina(0);
  }

  iArray(size: number): number[] {
    let i: number[] = [];
    for (let index = 0; index < size; index++) {
      i.push(index);
    }
    return i
  }

  async seleccionarPagina(pagina: number) {
    let negocio = await Storage.get({ key: 'negocioId' });
    let negocioId = (negocio.value)? Number(negocio.value): 0;
    this.store.dispatch(obtenerEventosLoading({ lang: 'es', pagina: pagina, tamanio: 5, busqueda: this.busqueda, negocioId }));
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
