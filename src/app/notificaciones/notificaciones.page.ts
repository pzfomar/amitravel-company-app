import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from './store/store';
import { obtenerNotificacionesLoading, Page } from './store/obtenerNotificaciones.store';
import { crearNotificacionLoading } from './store/crearNotificacion.store';
import { actualizarNotificacionLoading } from './store/actualizarNotificacion.store';
import { eliminarNotificacionLoading } from './store/eliminarNotificacion.store';
import { listaNegociosLoading } from './store/listaNegocios.store';
import { listaUsuariosLoading } from './store/listaUsuarios.store';
import { Storage } from "@capacitor/storage";

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.page.html',
  styleUrls: ['./notificaciones.page.scss'],
})
export class NotificacionesPage implements OnInit {

  form: FormGroup;
  page: Page;
  id: number;
  busqueda: string = '';
  negocios;
  usuarios;
  isModalOpen: boolean = false;

  constructor(public formBuilder: FormBuilder, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('listaNegocios').subscribe(s => {
      this.negocios = s.negocios;
    });
    this.store.dispatch(listaNegociosLoading({ lang: 'es' }));

    this.store.select('listaUsuarios').subscribe(s => {
      this.usuarios = s.usuarios;
    });
    this.store.dispatch(listaUsuariosLoading({ lang: 'es' }));

    this.store.select('obtenerNotificaciones').subscribe(s => {
      this.page = s.pageNotificacion;
    });
    this.seleccionarPagina(0);

    this.store.select('crearNotificacion').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('actualizarNotificacion').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('eliminarNotificacion').subscribe(s => {
      if (s.loaded) {
        this.seleccionarPagina(0);
      }
    });

    this.form = this.formBuilder.group({
      usuarioIds: [],
      nombre: ['', [Validators.required, Validators.minLength(1)]],
      descripcion: ['', []],
      tipo: ['', [Validators.required, Validators.minLength(1)]],
      imagen: ['', [Validators.required, Validators.minLength(1), Validators.pattern(/^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/\(\)]*)?$/)]],
      estatus: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  async guardar() {
    let negocio = await Storage.get({ key: 'negocioId' });
    if (!negocio.value) {
      return false;
    }
    
    let dato = this.form.value;
    dato.negocioId = Number(negocio.value);
    console.log(dato);
    if (this.id) {
      this.store.dispatch(actualizarNotificacionLoading({ lang: 'es', id: this.id, request: dato }));
    } else {
      this.store.dispatch(crearNotificacionLoading({ lang: 'es', request: dato }));      
    }
  }

  editar(dato: any) {
    this.isModalOpen = true;
    this.id = dato.id;
    this.form.controls.usuarioIds.setValue(dato.usuarios.map(usuario => usuario.id.toString()));
    this.form.controls.nombre.setValue(dato.nombre);
    this.form.controls.descripcion.setValue(dato.descripcion);
    this.form.controls.tipo.setValue(dato.tipo);
    this.form.controls.imagen.setValue(dato.imagen);
    this.form.controls.estatus.setValue(dato.estatus.toString());
  }

  eliminar(id: number){
    this.store.dispatch(eliminarNotificacionLoading({ lang: 'es', id: id }));
  }

  limpiar() {
    this.id = null;
    this.form.reset();
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
    this.store.dispatch(obtenerNotificacionesLoading({ lang: 'es', pagina: pagina, tamanio: 5, busqueda: this.busqueda, negocioId }));
  }
  
  refrescar(event) {
    this.ngOnInit();
    event.target.complete();
  }
}
