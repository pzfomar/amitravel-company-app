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

export interface ActualizarNegocioState {
	lang: string,
	id: number,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ActualizarNegocioInitialState: ActualizarNegocioState = {
	lang: 'es',
	id: 0,
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const actualizarNegocioLoading = createAction('[actualizarNegocio] actualizar negocio loading', props<{ lang: string, id: number, request: Request }>());
export const actualizarNegocioSuccess = createAction('[actualizarNegocio] actualizar negocio success', props<{ response: Response }>());
export const actualizarNegocioFail = createAction('[actualizarNegocio] actualizar negocio fail', props<{ payload: any }>());

export const ActualizarNegocioReducer = createReducer(
    ActualizarNegocioInitialState,
    on(actualizarNegocioLoading, (state, { lang, id, request }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id, request: request }) ),
    on(actualizarNegocioSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(actualizarNegocioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ActualizarNegocioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadActualizarNegocio$ = createEffect(() => this.actions$.pipe(
        ofType(actualizarNegocioLoading),
        mergeMap((action) => this.http.put(environment.apiUrl + action.lang + '/negocio/' + action.id, action.request)
            .pipe(
                map((response: any) => actualizarNegocioSuccess({ response: response })),
                catchError(err => of(actualizarNegocioFail({ payload: err })))
            )
        )
    ));
}
