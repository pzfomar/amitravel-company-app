import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class Horarios {
    public abre: string;
    public cierre: string;
    public dia: string;
}

export class Request {
	public nombre: string;
	public descripcion: string;
	public imagen: string;
	public estatus: boolean;
	public horarios: Horarios[];
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
	public horarios: Horarios[];
}

export interface CrearNegocioState {
	lang: string,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const CrearNegocioInitialState: CrearNegocioState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const crearNegocioLoading = createAction('[crearNegocio] crear negocio loading', props<{ lang: string, request: Request }>());
export const crearNegocioSuccess = createAction('[crearNegocio] crear negocio success', props<{ response: Response }>());
export const crearNegocioFail = createAction('[crearNegocio] crear negocio fail', props<{ payload: any }>());

export const CrearNegocioReducer = createReducer(
    CrearNegocioInitialState,
    on(crearNegocioLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(crearNegocioSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(crearNegocioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class CrearNegocioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadCrearNegocio$ = createEffect(() => this.actions$.pipe(
        ofType(crearNegocioLoading),
        mergeMap((action) => this.http.post(environment.apiUrl + action.lang + '/negocio', action.request)
            .pipe(
                map((response: any) => crearNegocioSuccess({ response: response })),
                catchError(err => of(crearNegocioFail({ payload: err })))
            )
        )
    ));
}
