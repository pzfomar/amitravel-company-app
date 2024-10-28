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

export interface ActualizarEventoState {
	lang: string,
	id: number,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ActualizarEventoInitialState: ActualizarEventoState = {
	lang: 'es',
	id: 0,
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const actualizarEventoLoading = createAction('[actualizarEvento] actualizar evento loading', props<{ lang: string, id: number, request: Request }>());
export const actualizarEventoSuccess = createAction('[actualizarEvento] actualizar evento success', props<{ response: Response }>());
export const actualizarEventoFail = createAction('[actualizarEvento] actualizar evento fail', props<{ payload: any }>());

export const ActualizarEventoReducer = createReducer(
    ActualizarEventoInitialState,
    on(actualizarEventoLoading, (state, { lang, id, request }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id, request: request }) ),
    on(actualizarEventoSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(actualizarEventoFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ActualizarEventoEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadActualizarEvento$ = createEffect(() => this.actions$.pipe(
        ofType(actualizarEventoLoading),
        mergeMap((action) => this.http.put(environment.apiUrl + action.lang + '/evento/' + action.id, action.request)
            .pipe(
                map((response: any) => actualizarEventoSuccess({ response: response })),
                catchError(err => of(actualizarEventoFail({ payload: err })))
            )
        )
    ));
}
