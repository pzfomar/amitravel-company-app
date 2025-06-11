import { ActionReducerMap } from '@ngrx/store';
import { CrearNegocioEffects, CrearNegocioReducer, CrearNegocioState } from './crearNegocio.store';
import { ActualizarNegocioEffects, ActualizarNegocioReducer, ActualizarNegocioState } from './actualizarNegocio.store';
import { ObtenerNegociosEffects, ObtenerNegociosReducer, ObtenerNegociosState } from './obtenerNegocios.store';
import { CrearUsuarioEffects, CrearUsuarioReducer, CrearUsuarioState } from './crearUsuario.store';
import { ActualizarUsuarioEffects, ActualizarUsuarioReducer, ActualizarUsuarioState } from './actualizarUsuario.store';
import { ObtenerUsuariosEffects, ObtenerUsuariosReducer, ObtenerUsuariosState } from './obtenerUsuarios.store';
import { CrearPersonaEffects, CrearPersonaReducer, CrearPersonaState } from './crearPersona.store';
import { ActualizarPersonaEffects, ActualizarPersonaReducer, ActualizarPersonaState } from './actualizarPersona.store';
import { ObtenerPersonasEffects, ObtenerPersonasReducer, ObtenerPersonasState } from './obtenerPersonas.store';
 
export interface AppState {
    crearNegocio: CrearNegocioState,
    obtenerNegocios: ObtenerNegociosState,
    actualizarNegocio: ActualizarNegocioState,
    crearUsuario: CrearUsuarioState,
    actualizarUsuario: ActualizarUsuarioState,
    obtenerUsuarios: ObtenerUsuariosState,
    crearPersona: CrearPersonaState,
    actualizarPersona: ActualizarPersonaState,
    obtenerPersonas: ObtenerPersonasState,
}

export const appReducers: ActionReducerMap<AppState> = {
    crearNegocio: CrearNegocioReducer,
    obtenerNegocios: ObtenerNegociosReducer,
    actualizarNegocio: ActualizarNegocioReducer,
    crearUsuario: CrearUsuarioReducer,
    actualizarUsuario: ActualizarUsuarioReducer,
    obtenerUsuarios: ObtenerUsuariosReducer,
    crearPersona: CrearPersonaReducer,
    actualizarPersona: ActualizarPersonaReducer,
    obtenerPersonas: ObtenerPersonasReducer,
}

export const EffectsArray: any[] = [
    CrearNegocioEffects,
    ObtenerNegociosEffects,
    ActualizarNegocioEffects,
    CrearUsuarioEffects,
    ActualizarUsuarioEffects,
    ObtenerUsuariosEffects,
    CrearPersonaEffects,
    ActualizarPersonaEffects,
    ObtenerPersonasEffects,
];
