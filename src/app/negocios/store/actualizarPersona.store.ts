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

export interface ActualizarPersonaState {
	lang: string,
	id: number,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ActualizarPersonaInitialState: ActualizarPersonaState = {
	lang: 'es',
	id: 0,
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const actualizarPersonaLoading = createAction('[actualizarPersona] actualizar persona loading', props<{ lang: string, id: number, request: Request }>());
export const actualizarPersonaSuccess = createAction('[actualizarPersona] actualizar persona success', props<{ response: Response }>());
export const actualizarPersonaFail = createAction('[actualizarPersona] actualizar persona fail', props<{ payload: any }>());

export const ActualizarPersonaReducer = createReducer(
    ActualizarPersonaInitialState,
    on(actualizarPersonaLoading, (state, { lang, id, request }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id, request: request }) ),
    on(actualizarPersonaSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(actualizarPersonaFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ActualizarPersonaEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadActualizarPersona$ = createEffect(() => this.actions$.pipe(
        ofType(actualizarPersonaLoading),
        mergeMap((action) => this.http.put(environment.apiUrl + action.lang + '/persona/' + action.id, action.request)
            .pipe(
                map((response: any) => actualizarPersonaSuccess({ response: response })),
                catchError(err => of(actualizarPersonaFail({ payload: err })))
            )
        )
    ));
}
