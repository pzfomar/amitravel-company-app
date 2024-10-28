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
	public imagen: string;
	public url: string;
	public estatus: boolean;
}

export class Response {
	public id: number;
	public negocio: any;
	public usuarios: any[];
	public nombre: string;
	public descripcion: string;
	public imagen: string;
	public url: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export interface CrearAnuncioState {
	lang: string,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const CrearAnuncioInitialState: CrearAnuncioState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const crearAnuncioLoading = createAction('[crearAnuncio] crear anuncio loading', props<{ lang: string, request: Request }>());
export const crearAnuncioSuccess = createAction('[crearAnuncio] crear anuncio success', props<{ response: Response }>());
export const crearAnuncioFail = createAction('[crearAnuncio] crear anuncio fail', props<{ payload: any }>());

export const CrearAnuncioReducer = createReducer(
    CrearAnuncioInitialState,
    on(crearAnuncioLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(crearAnuncioSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(crearAnuncioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class CrearAnuncioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadCrearAnuncio$ = createEffect(() => this.actions$.pipe(
        ofType(crearAnuncioLoading),
        mergeMap((action) => this.http.post(environment.apiUrl + action.lang + '/anuncio', action.request)
            .pipe(
                map((response: any) => crearAnuncioSuccess({ response: response })),
                catchError(err => of(crearAnuncioFail({ payload: err })))
            )
        )
    ));
}
