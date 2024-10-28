import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class Request {
	public nombre: string;
	public descripcion: string;
	public imagen: string;
	public estatus: boolean;
}

export class Response {
	public id: number;
	public nombre: string;
	public descripcion: string;
	public imagen: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
	public notificaciones: any;
	public promociones: any;
	public productos: any;
	public calificaciones: any;
	public eventos: any;
	public anuncios: any;
	public agendas: any;
}

export interface ActualizarAnuncioState {
	lang: string,
	id: number,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ActualizarAnuncioInitialState: ActualizarAnuncioState = {
	lang: 'es',
	id: 0,
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const actualizarAnuncioLoading = createAction('[actualizarAnuncio] actualizar anuncio loading', props<{ lang: string, id: number, request: Request }>());
export const actualizarAnuncioSuccess = createAction('[actualizarAnuncio] actualizar anuncio success', props<{ response: Response }>());
export const actualizarAnuncioFail = createAction('[actualizarAnuncio] actualizar anuncio fail', props<{ payload: any }>());

export const ActualizarAnuncioReducer = createReducer(
    ActualizarAnuncioInitialState,
    on(actualizarAnuncioLoading, (state, { lang, id, request }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id, request: request }) ),
    on(actualizarAnuncioSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(actualizarAnuncioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ActualizarAnuncioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadActualizarAnuncio$ = createEffect(() => this.actions$.pipe(
        ofType(actualizarAnuncioLoading),
        mergeMap((action) => this.http.put(environment.apiUrl + action.lang + '/anuncio/' + action.id, action.request)
            .pipe(
                map((response: any) => actualizarAnuncioSuccess({ response: response })),
                catchError(err => of(actualizarAnuncioFail({ payload: err })))
            )
        )
    ));
}
