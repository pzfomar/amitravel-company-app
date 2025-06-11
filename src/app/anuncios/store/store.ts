import { ActionReducerMap } from '@ngrx/store';
import { ActualizarAnuncioEffects, ActualizarAnuncioReducer, ActualizarAnuncioState } from './actualizarAnuncio.store';
import { CrearAnuncioEffects, CrearAnuncioReducer, CrearAnuncioState } from './crearAnuncio.store';
import { EliminarAnuncioEffects, EliminarAnuncioReducer, EliminarAnuncioState } from './eliminarAnuncio.store';
import { ObtenerAnunciosEffects, ObtenerAnunciosReducer, ObtenerAnunciosState } from './obtenerAnuncios.store';
import { ListaNegociosEffects, ListaNegociosReducer, ListaNegociosState } from './listaNegocios.store';
import { ListaUsuariosEffects, ListaUsuariosReducer, ListaUsuariosState } from './listaUsuarios.store';

export interface AppState {
    crearAnuncio: CrearAnuncioState,
    obtenerAnuncios: ObtenerAnunciosState,
    actualizarAnuncio: ActualizarAnuncioState,
    eliminarAnuncio: EliminarAnuncioState,
    listaUsuarios: ListaUsuariosState,
    listaNegocios: ListaNegociosState
}

export const appReducers: ActionReducerMap<AppState> = {
    crearAnuncio: CrearAnuncioReducer,
    obtenerAnuncios: ObtenerAnunciosReducer,
    actualizarAnuncio: ActualizarAnuncioReducer,
    eliminarAnuncio: EliminarAnuncioReducer,
    listaUsuarios: ListaUsuariosReducer,
    listaNegocios: ListaNegociosReducer
}

export const EffectsArray: any[] = [
    CrearAnuncioEffects,
    ObtenerAnunciosEffects,
    ActualizarAnuncioEffects,
    EliminarAnuncioEffects,
    ListaUsuariosEffects,
    ListaNegociosEffects
];
