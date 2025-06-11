import { ActionReducerMap } from '@ngrx/store';
import { ActualizarPromocionEffects, ActualizarPromocionReducer, ActualizarPromocionState } from './actualizarPromocion.store';
import { CrearPromocionEffects, CrearPromocionReducer, CrearPromocionState } from './crearPromocion.store';
import { EliminarPromocionEffects, EliminarPromocionReducer, EliminarPromocionState } from './eliminarPromocion.store';
import { ObtenerPromocionesEffects, ObtenerPromocionesReducer, ObtenerPromocionesState } from './obtenerPromociones.store';
import { ListaNegociosEffects, ListaNegociosReducer, ListaNegociosState } from './listaNegocios.store';

export interface AppState {
    crearPromocion: CrearPromocionState,
    obtenerPromociones: ObtenerPromocionesState,
    actualizarPromocion: ActualizarPromocionState,
    eliminarPromocion: EliminarPromocionState,
    listaNegocios: ListaNegociosState
}

export const appReducers: ActionReducerMap<AppState> = {
    crearPromocion: CrearPromocionReducer,
    obtenerPromociones: ObtenerPromocionesReducer,
    actualizarPromocion: ActualizarPromocionReducer,
    eliminarPromocion: EliminarPromocionReducer,
    listaNegocios: ListaNegociosReducer
}

export const EffectsArray: any[] = [
    CrearPromocionEffects,
    ObtenerPromocionesEffects,
    ActualizarPromocionEffects,
    EliminarPromocionEffects,
    ListaNegociosEffects
];
