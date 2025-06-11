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
	public eventoId: number;
	public evaluacion: number;
	public comentario: string;
	public estatus: boolean;
}

export class Response {
	public id: number;
	public usuario: any;
	public evento: any;
	public evaluacion: number;
	public comentario: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface ActualizarCalificacionState {
	lang: string,
	id: number,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ActualizarCalificacionInitialState: ActualizarCalificacionState = {
	lang: 'es',
	id: 0,
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const actualizarCalificacionLoading = createAction('[actualizarCalificacion] actualizar calificacion loading', props<{ lang: string, id: number, request: Request }>());
export const actualizarCalificacionSuccess = createAction('[actualizarCalificacion] actualizar calificacion success', props<{ response: Response }>());
export const actualizarCalificacionFail = createAction('[actualizarCalificacion] actualizar calificacion fail', props<{ payload: any }>());

export const ActualizarCalificacionReducer = createReducer(
    ActualizarCalificacionInitialState,
    on(actualizarCalificacionLoading, (state, { lang, id, request }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id, request: request }) ),
    on(actualizarCalificacionSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(actualizarCalificacionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ActualizarCalificacionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadActualizarCalificacion$ = createEffect(() => this.actions$.pipe(
        ofType(actualizarCalificacionLoading),
        mergeMap((action) => this.http.put(environment.apiUrl + action.lang + '/calificacion/' + action.id, action.request)
            .pipe(
                map((response: any) => actualizarCalificacionSuccess({ response: response })),
                catchError(err => of(actualizarCalificacionFail({ payload: err })))
            )
        )
    ));
}
