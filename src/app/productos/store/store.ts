import { ActionReducerMap } from '@ngrx/store';
import { ActualizarProductoEffects, ActualizarProductoReducer, ActualizarProductoState } from './actualizarProducto.store';
import { CrearProductoEffects, CrearProductoReducer, CrearProductoState } from './crearProducto.store';
import { EliminarProductoEffects, EliminarProductoReducer, EliminarProductoState } from './eliminarProducto.store';
import { ObtenerProductosEffects, ObtenerProductosReducer, ObtenerProductosState } from './obtenerProductos.store';
import { ListaNegociosEffects, ListaNegociosReducer, ListaNegociosState } from './listaNegocios.store';

export interface AppState {
    crearProducto: CrearProductoState,
    obtenerProductos: ObtenerProductosState,
    actualizarProducto: ActualizarProductoState,
    eliminarProducto: EliminarProductoState,
    listaNegocios: ListaNegociosState
}

export const appReducers: ActionReducerMap<AppState> = {
    crearProducto: CrearProductoReducer,
    obtenerProductos: ObtenerProductosReducer,
    actualizarProducto: ActualizarProductoReducer,
    eliminarProducto: EliminarProductoReducer,
    listaNegocios: ListaNegociosReducer
}

export const EffectsArray: any[] = [
    CrearProductoEffects,
    ObtenerProductosEffects,
    ActualizarProductoEffects,
    EliminarProductoEffects,
    ListaNegociosEffects
];
