import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from './store/store';
import { obtenerCalificacionesLoading, Page } from './store/obtenerCalificaciones.store';
import { crearCalificacionLoading } from './store/crearCalificacion.store';
import { actualizarCalificacionLoading } from './store/actualizarCalificacion.store';
import { eliminarCalificacionLoading } from './store/eliminarCalificacion.store';
import { listaUsuariosLoading } from './store/listaUsuarios.store';
import { listaEventosLoading } from './store/listaEventos.store';
import { Storage } from "@capacitor/storage";

@Component({
  selector: 'app-calificaciones',
  templateUrl: './calificaciones.page.html',
  styleUrls: ['./calificaciones.page.scss'],
})
export class CalificacionesPage implements OnInit {

  form: FormGroup;
  page: Page;
  id: number;
  busqueda: string = '';
  usuarios;
  eventos;

  constructor(public formBuilder: FormBuilder, private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select('listaUsuarios').subscribe(s => {
      this.usuarios = s.usuarios;
    });
    this.store.dispatch(listaUsuariosLoading({ lang: 'es' }));

    this.store.select('listaEventos').subscribe(s => {
      this.eventos = s.eventos;
    });
    this.store.dispatch(listaEventosLoading({ lang: 'es' }));

    this.store.select('obtenerCalificaciones').subscribe(s => {
      this.page = s.pageCalificacion;
    });
    this.seleccionarPagina(0);

    this.store.select('crearCalificacion').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('actualizarCalificacion').subscribe(s => {
      if (s.loaded) {
        this.limpiar();
        this.seleccionarPagina(0);
      }
    });

    this.store.select('eliminarCalificacion').subscribe(s => {
      if (s.loaded) {
        this.seleccionarPagina(0);
      }
    });

    this.form = this.formBuilder.group({
      usuarioId: ['', [Validators.required, Validators.minLength(1)]],
      eventoId: ['', [Validators.required, Validators.minLength(1)]],
      evaluacion: ['', [Validators.required, Validators.minLength(1)]],
      estatus: ['', [Validators.required, Validators.minLength(1)]],
      comentario: ['', [Validators.required, Validators.minLength(1)]],
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
      this.store.dispatch(actualizarCalificacionLoading({ lang: 'es', id: this.id, request: dato }));
    } else {
      this.store.dispatch(crearCalificacionLoading({ lang: 'es', request: dato }));
    }
  }

  editar(dato: any) {
    this.id = dato.id;
    this.form.controls.usuarioId.setValue(dato.usuario.id.toString());
    this.form.controls.eventoId.setValue(dato.evento.id.toString());
    this.form.controls.evaluacion.setValue(dato.evaluacion);
    this.form.controls.estatus.setValue(dato.estatus.toString());
    this.form.controls.comentario.setValue(dato.comentario);
  }

  eliminar(id: number){
    this.store.dispatch(eliminarCalificacionLoading({ lang: 'es', id: id }));
  }

  limpiar() {
    this.id = null;
    this.form.reset();
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
    this.store.dispatch(obtenerCalificacionesLoading({ lang: 'es', pagina: pagina, tamanio: 5, busqueda: this.busqueda, negocioId }));
  }
  
  refrescar(event) {
    this.ngOnInit();
    event.target.complete();
  }
}
