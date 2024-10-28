import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class Request {
	public usuarioId: number;
	public correo: string;
	public nombre: string;
	public apellidoPaterno: string;
	public apellidoMaterno: string;
	public edad: number;
	public telefono: string;
	public estatus: boolean;
}

export class Response {
	public id: number;
	public usuario: any;
	public correo: string;
	public nombre: string;
	public apellidoPaterno: string;
	public apellidoMaterno: string;
	public edad: number;
	public telefono: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface CrearPersonaState {
	lang: string,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const CrearPersonaInitialState: CrearPersonaState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const crearPersonaLoading = createAction('[crearPersona] crear persona loading', props<{ lang: string, request: Request }>());
export const crearPersonaSuccess = createAction('[crearPersona] crear persona success', props<{ response: Response }>());
export const crearPersonaFail = createAction('[crearPersona] crear persona fail', props<{ payload: any }>());

export const CrearPersonaReducer = createReducer(
    CrearPersonaInitialState,
    on(crearPersonaLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(crearPersonaSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(crearPersonaFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class CrearPersonaEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadCrearPersona$ = createEffect(() => this.actions$.pipe(
        ofType(crearPersonaLoading),
        mergeMap((action) => this.http.post(environment.apiUrl + action.lang + '/persona', action.request)
            .pipe(
                map((response: any) => crearPersonaSuccess({ response: response })),
                catchError(err => of(crearPersonaFail({ payload: err })))
            )
        )
    ));
}
