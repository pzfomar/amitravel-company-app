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

export interface ActualizarNotificacionState {
	lang: string,
	id: number,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ActualizarNotificacionInitialState: ActualizarNotificacionState = {
	lang: 'es',
	id: 0,
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const actualizarNotificacionLoading = createAction('[actualizarNotificacion] actualizar notificacion loading', props<{ lang: string, id: number, request: Request }>());
export const actualizarNotificacionSuccess = createAction('[actualizarNotificacion] actualizar notificacion success', props<{ response: Response }>());
export const actualizarNotificacionFail = createAction('[actualizarNotificacion] actualizar notificacion fail', props<{ payload: any }>());

export const ActualizarNotificacionReducer = createReducer(
    ActualizarNotificacionInitialState,
    on(actualizarNotificacionLoading, (state, { lang, id, request }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id, request: request }) ),
    on(actualizarNotificacionSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(actualizarNotificacionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ActualizarNotificacionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadActualizarNotificacion$ = createEffect(() => this.actions$.pipe(
        ofType(actualizarNotificacionLoading),
        mergeMap((action) => this.http.put(environment.apiUrl + action.lang + '/notificacion/' + action.id, action.request)
            .pipe(
                map((response: any) => actualizarNotificacionSuccess({ response: response })),
                catchError(err => of(actualizarNotificacionFail({ payload: err })))
            )
        )
    ));
}
