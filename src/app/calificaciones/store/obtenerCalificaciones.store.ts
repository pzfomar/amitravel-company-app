import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

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

export class Page {
	public paginas: number;
	public paginaSeleccionada: number;
	public contenido: Response[];
}

export interface ObtenerCalificacionesState {
	lang: string,
	pagina: number,
	tamanio: number,
	busqueda: string,
	negocioId: number,
    pageCalificacion: Page | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerCalificacionesInitialState: ObtenerCalificacionesState = {
	lang: 'es',
	pagina: 0,
	tamanio: 0,
	busqueda: '',
	negocioId: 0,
    pageCalificacion: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerCalificacionesLoading = createAction('[obtenerCalificaciones] obtener calificaciones loading', props<{ lang: string, pagina: number, tamanio: number, busqueda: string, negocioId: number }>());
export const obtenerCalificacionesSuccess = createAction('[obtenerCalificaciones] obtener calificaciones success', props<{ pageCalificacion: Page }>());
export const obtenerCalificacionesFail = createAction('[obtenerCalificaciones] obtener calificaciones fail', props<{ payload: any }>());

export const ObtenerCalificacionesReducer = createReducer(
    ObtenerCalificacionesInitialState,
    on(obtenerCalificacionesLoading, (state, { lang, pagina, tamanio, busqueda, negocioId }) => ({ ...state, loading: true, loaded: false, lang: lang, pagina: pagina, tamanio: tamanio, busqueda: busqueda, negocioId: negocioId }) ),
    on(obtenerCalificacionesSuccess, (state, { pageCalificacion }) => ({ ...state, loading: false, loaded: true, pageCalificacion: { ...pageCalificacion } })),
    on(obtenerCalificacionesFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerCalificacionesEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerCalificaciones$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerCalificacionesLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/calificacion?pagina=' + action.pagina + '&tamanio=' + action.tamanio + (action.busqueda.trim().length > 0? '&busqueda=' + action.busqueda: '') + '&negocioId=' + action.negocioId)
            .pipe(
                map((pageCalificacion: any) => obtenerCalificacionesSuccess({ pageCalificacion: pageCalificacion })),
                catchError(err => of(obtenerCalificacionesFail({ payload: err })))
            )
        )
    ));
}
