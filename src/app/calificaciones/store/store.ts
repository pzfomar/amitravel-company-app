import { ActionReducerMap } from '@ngrx/store';
import { ActualizarCalificacionEffects, ActualizarCalificacionReducer, ActualizarCalificacionState } from './actualizarCalificacion.store';
import { CrearCalificacionEffects, CrearCalificacionReducer, CrearCalificacionState } from './crearCalificacion.store';
import { EliminarCalificacionEffects, EliminarCalificacionReducer, EliminarCalificacionState } from './eliminarCalificacion.store';
import { ObtenerCalificacionesEffects, ObtenerCalificacionesReducer, ObtenerCalificacionesState } from './obtenerCalificaciones.store';
import { ListaNegociosEffects, ListaNegociosReducer, ListaNegociosState } from './listaNegocios.store';
import { ListaUsuariosEffects, ListaUsuariosReducer, ListaUsuariosState } from './listaUsuarios.store';
import { ListaEventosEffects, ListaEventosReducer, ListaEventosState } from './listaEventos.store';

export interface AppState {
    crearCalificacion: CrearCalificacionState,
    obtenerCalificaciones: ObtenerCalificacionesState,
    actualizarCalificacion: ActualizarCalificacionState,
    eliminarCalificacion: EliminarCalificacionState,
    listaUsuarios: ListaUsuariosState,
    listaNegocios: ListaNegociosState,
    listaEventos: ListaEventosState
}

export const appReducers: ActionReducerMap<AppState> = {
    crearCalificacion: CrearCalificacionReducer,
    obtenerCalificaciones: ObtenerCalificacionesReducer,
    actualizarCalificacion: ActualizarCalificacionReducer,
    eliminarCalificacion: EliminarCalificacionReducer,
    listaUsuarios: ListaUsuariosReducer,
    listaNegocios: ListaNegociosReducer,
    listaEventos: ListaEventosReducer
}

export const EffectsArray: any[] = [
    CrearCalificacionEffects,
    ObtenerCalificacionesEffects,
    ActualizarCalificacionEffects,
    EliminarCalificacionEffects,
    ListaUsuariosEffects,
    ListaNegociosEffects,
    ListaEventosEffects
];
