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

export class Page {
	public paginas: number;
	public paginaSeleccionada: number;
	public contenido: Response[];
}

export interface ObtenerNotificacionesState {
	lang: string,
	pagina: number,
	tamanio: number,
	busqueda: string,
	negocioId: number,
    pageNotificacion: Page | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerNotificacionesInitialState: ObtenerNotificacionesState = {
	lang: 'es',
	pagina: 0,
	tamanio: 0,
	busqueda: '',
	negocioId: 0,
    pageNotificacion: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerNotificacionesLoading = createAction('[obtenerNotificaciones] obtener notificaciones loading', props<{ lang: string, pagina: number, tamanio: number, busqueda: string, negocioId: number }>());
export const obtenerNotificacionesSuccess = createAction('[obtenerNotificaciones] obtener notificaciones success', props<{ pageNotificacion: Page }>());
export const obtenerNotificacionesFail = createAction('[obtenerNotificaciones] obtener notificaciones fail', props<{ payload: any }>());

export const ObtenerNotificacionesReducer = createReducer(
    ObtenerNotificacionesInitialState,
    on(obtenerNotificacionesLoading, (state, { lang, pagina, tamanio, busqueda, negocioId }) => ({ ...state, loading: true, loaded: false, lang: lang, pagina: pagina, tamanio: tamanio, busqueda: busqueda, negocioId: negocioId }) ),
    on(obtenerNotificacionesSuccess, (state, { pageNotificacion }) => ({ ...state, loading: false, loaded: true, pageNotificacion: { ...pageNotificacion } })),
    on(obtenerNotificacionesFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerNotificacionesEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerNotificaciones$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerNotificacionesLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/notificacion?pagina=' + action.pagina + '&tamanio=' + action.tamanio + (action.busqueda.trim().length > 0? '&busqueda=' + action.busqueda: '') + '&negocioId=' + action.negocioId)
            .pipe(
                map((pageNotificacion: any) => obtenerNotificacionesSuccess({ pageNotificacion: pageNotificacion })),
                catchError(err => of(obtenerNotificacionesFail({ payload: err })))
            )
        )
    ));
}
