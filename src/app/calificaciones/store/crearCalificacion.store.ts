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

export interface CrearCalificacionState {
	lang: string,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const CrearCalificacionInitialState: CrearCalificacionState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const crearCalificacionLoading = createAction('[crearCalificacion] crear calificacion loading', props<{ lang: string, request: Request }>());
export const crearCalificacionSuccess = createAction('[crearCalificacion] crear calificacion success', props<{ response: Response }>());
export const crearCalificacionFail = createAction('[crearCalificacion] crear calificacion fail', props<{ payload: any }>());

export const CrearCalificacionReducer = createReducer(
    CrearCalificacionInitialState,
    on(crearCalificacionLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(crearCalificacionSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(crearCalificacionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class CrearCalificacionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadCrearCalificacion$ = createEffect(() => this.actions$.pipe(
        ofType(crearCalificacionLoading),
        mergeMap((action) => this.http.post(environment.apiUrl + action.lang + '/calificacion', action.request)
            .pipe(
                map((response: any) => crearCalificacionSuccess({ response: response })),
                catchError(err => of(crearCalificacionFail({ payload: err })))
            )
        )
    ));
}
