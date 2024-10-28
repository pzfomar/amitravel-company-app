import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class Request {
	public negocioId: number;
	public usuarioIds: number[];
	public nombre: string;
	public descripcion: string;
	public tipo: string;
	public imagen: string;
	public estatus: boolean;
}

export class Response {
	public id: number;
	public negocio: any;
	public usuarios: any[];
	public nombre: string;
	public descripcion: string;
	public tipo: string;
	public imagen: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface CrearNotificacionState {
	lang: string,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const CrearNotificacionInitialState: CrearNotificacionState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const crearNotificacionLoading = createAction('[crearNotificacion] crear notificacion loading', props<{ lang: string, request: Request }>());
export const crearNotificacionSuccess = createAction('[crearNotificacion] crear notificacion success', props<{ response: Response }>());
export const crearNotificacionFail = createAction('[crearNotificacion] crear notificacion fail', props<{ payload: any }>());

export const CrearNotificacionReducer = createReducer(
    CrearNotificacionInitialState,
    on(crearNotificacionLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(crearNotificacionSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(crearNotificacionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class CrearNotificacionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadCrearNotificacion$ = createEffect(() => this.actions$.pipe(
        ofType(crearNotificacionLoading),
        mergeMap((action) => this.http.post(environment.apiUrl + action.lang + '/notificacion', action.request)
            .pipe(
                map((response: any) => crearNotificacionSuccess({ response: response })),
                catchError(err => of(crearNotificacionFail({ payload: err })))
            )
        )
    ));
}
