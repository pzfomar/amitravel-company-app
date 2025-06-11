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
	public negocioId: number;
	public tipo: string;
	public lugar: string;
	public nombre: string;
	public descripcion: string;
	public imagen: string;
	public estatus: boolean;
	public horarios: Horarios[];
}

export class Response {
	public id: number;
	public negocio: any;
	public nombre: string;
	public descripcion: string;
	public tipo: string;
	public lugar: string;
	public imagen: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
	public agendas: any;
	public calificaciones: any;
	public horarios: Horarios[];
}

export interface CrearEventoState {
	lang: string,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const CrearEventoInitialState: CrearEventoState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const crearEventoLoading = createAction('[crearEvento] crear evento loading', props<{ lang: string, request: Request }>());
export const crearEventoSuccess = createAction('[crearEvento] crear evento success', props<{ response: Response }>());
export const crearEventoFail = createAction('[crearEvento] crear evento fail', props<{ payload: any }>());

export const CrearEventoReducer = createReducer(
    CrearEventoInitialState,
    on(crearEventoLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(crearEventoSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(crearEventoFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class CrearEventoEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadCrearEvento$ = createEffect(() => this.actions$.pipe(
        ofType(crearEventoLoading),
        mergeMap((action) => this.http.post(environment.apiUrl + action.lang + '/evento', action.request)
            .pipe(
                map((response: any) => crearEventoSuccess({ response: response })),
                catchError(err => of(crearEventoFail({ payload: err })))
            )
        )
    ));
}
