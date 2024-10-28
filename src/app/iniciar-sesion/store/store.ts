import { ActionReducerMap } from '@ngrx/store';
import { AuthoUsuarioEffects, AuthoUsuarioReducer, AuthoUsuarioState } from './IniciarSesion.store';
 
export interface AppState {
    authoUsuario: AuthoUsuarioState
}

export const appReducers: ActionReducerMap<AppState> = {
    authoUsuario: AuthoUsuarioReducer
}

export const EffectsArray: any[] = [
    AuthoUsuarioEffects
];
