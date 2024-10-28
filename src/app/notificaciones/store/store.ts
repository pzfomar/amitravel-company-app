import { ActionReducerMap } from '@ngrx/store';
import { ActualizarNotificacionEffects, ActualizarNotificacionReducer, ActualizarNotificacionState } from './actualizarNotificacion.store';
import { CrearNotificacionEffects, CrearNotificacionReducer, CrearNotificacionState } from './crearNotificacion.store';
import { EliminarNotificacionEffects, EliminarNotificacionReducer, EliminarNotificacionState } from './eliminarNotificacion.store';
import { ObtenerNotificacionesEffects, ObtenerNotificacionesReducer, ObtenerNotificacionesState } from './obtenerNotificaciones.store';
import { ListaNegociosEffects, ListaNegociosReducer, ListaNegociosState } from './listaNegocios.store';
import { ListaUsuariosEffects, ListaUsuariosReducer, ListaUsuariosState } from './listaUsuarios.store';
 
export interface AppState {
    crearNotificacion: CrearNotificacionState,
    obtenerNotificaciones: ObtenerNotificacionesState,
    actualizarNotificacion: ActualizarNotificacionState,
    eliminarNotificacion: EliminarNotificacionState,
    listaUsuarios: ListaUsuariosState,
    listaNegocios: ListaNegociosState
}

export const appReducers: ActionReducerMap<AppState> = {
    crearNotificacion: CrearNotificacionReducer,
    obtenerNotificaciones: ObtenerNotificacionesReducer,
    actualizarNotificacion: ActualizarNotificacionReducer,
    eliminarNotificacion: EliminarNotificacionReducer,
    listaUsuarios: ListaUsuariosReducer,
    listaNegocios: ListaNegociosReducer
}

export const EffectsArray: any[] = [
    CrearNotificacionEffects,
    ObtenerNotificacionesEffects,
    ActualizarNotificacionEffects,
    EliminarNotificacionEffects,
    ListaUsuariosEffects,
    ListaNegociosEffects
];
