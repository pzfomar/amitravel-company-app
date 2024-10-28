import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class Request {
	public apodo: string;
	public contrasenia: string;
	public rol: string;
	public estatus: boolean;
}

export class Response {
	public id: number;
	public apodo: string;
	public contrasenia: string;
	public rol: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
	public persona: any;
	public agendas: any[];
	public calificaciones: any[];
	public busquedas: any[];
	public aficiones: any[];
	public notificaciones: any[];
	public anuncios: any[];
}

export interface ActualizarUsuarioState {
	lang: string,
	id: number,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ActualizarUsuarioInitialState: ActualizarUsuarioState = {
	lang: 'es',
	id: 0,
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const actualizarUsuarioLoading = createAction('[actualizarUsuario] actualizar usuario loading', props<{ lang: string, id: number, request: Request }>());
export const actualizarUsuarioSuccess = createAction('[actualizarUsuario] actualizar usuario success', props<{ response: Response }>());
export const actualizarUsuarioFail = createAction('[actualizarUsuario] actualizar usuario fail', props<{ payload: any }>());

export const ActualizarUsuarioReducer = createReducer(
    ActualizarUsuarioInitialState,
    on(actualizarUsuarioLoading, (state, { lang, id, request }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id, request: request }) ),
    on(actualizarUsuarioSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(actualizarUsuarioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ActualizarUsuarioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadActualizarUsuario$ = createEffect(() => this.actions$.pipe(
        ofType(actualizarUsuarioLoading),
        mergeMap((action) => this.http.put(environment.apiUrl + action.lang + '/usuario/' + action.id, action.request)
            .pipe(
                map((response: any) => actualizarUsuarioSuccess({ response: response })),
                catchError(err => of(actualizarUsuarioFail({ payload: err })))
            )
        )
    ));
}
