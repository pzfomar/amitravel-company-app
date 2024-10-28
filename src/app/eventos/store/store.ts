import { ActionReducerMap } from '@ngrx/store';
import { ActualizarEventoEffects, ActualizarEventoReducer, ActualizarEventoState } from './actualizarEvento.store';
import { CrearEventoEffects, CrearEventoReducer, CrearEventoState } from './crearEvento.store';
import { EliminarEventoEffects, EliminarEventoReducer, EliminarEventoState } from './eliminarEvento.store';
import { ObtenerEventosEffects, ObtenerEventosReducer, ObtenerEventosState } from './obtenerEventos.store';
import { ListaNegociosEffects, ListaNegociosReducer, ListaNegociosState } from './listaNegocios.store';

export interface AppState {
    crearEvento: CrearEventoState,
    obtenerEventos: ObtenerEventosState,
    actualizarEvento: ActualizarEventoState,
    eliminarEvento: EliminarEventoState,
    listaNegocios: ListaNegociosState
}

export const appReducers: ActionReducerMap<AppState> = {
    crearEvento: CrearEventoReducer,
    obtenerEventos: ObtenerEventosReducer,
    actualizarEvento: ActualizarEventoReducer,
    eliminarEvento: EliminarEventoReducer,
    listaNegocios: ListaNegociosReducer
}

export const EffectsArray: any[] = [
    CrearEventoEffects,
    ObtenerEventosEffects,
    ActualizarEventoEffects,
    EliminarEventoEffects,
    ListaNegociosEffects
];
