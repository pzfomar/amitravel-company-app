import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class AuthoUsuarioRequest {
	public apodo: string;
	public contrasenia: string;
}

export class AuthoUsuarioResponse {
	public id: number;
    public negocioId: number;
	public apodo: string;
	public rol: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface AuthoUsuarioState {
	lang: string,
	request: AuthoUsuarioRequest,
    response: AuthoUsuarioResponse | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const AuthoUsuarioInitialState: AuthoUsuarioState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const authoUsuarioLoading = createAction('[authoUsuario] autho usuario loading', props<{ lang: string, request: AuthoUsuarioRequest }>());
export const authoUsuarioSuccess = createAction('[authoUsuario] autho usuario success', props<{ response: AuthoUsuarioResponse }>());
export const authoUsuarioFail = createAction('[authoUsuario] autho usuario fail', props<{ payload: any }>());

export const AuthoUsuarioReducer = createReducer(
    AuthoUsuarioInitialState,
    on(authoUsuarioLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(authoUsuarioSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(authoUsuarioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class AuthoUsuarioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadAuthoUsuario$ = createEffect(() => this.actions$.pipe(
        ofType(authoUsuarioLoading),
        mergeMap((action) => this.http.post(environment.apiUrlApp + action.lang + '/usuario/autho', action.request)
            .pipe(
                map((response: any) => authoUsuarioSuccess({ response: response })),
                catchError(err => of(authoUsuarioFail({ payload: err })))
            )
        )
    ));
}
