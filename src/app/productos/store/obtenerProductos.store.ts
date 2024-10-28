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
	public nombre: string;
	public tipo: string;
	public descripcion: string;
	public imagen: string;
	public caducidad: Date;
	public cantidad: number;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export class Page {
	public paginas: number;
	public paginaSeleccionada: number;
	public contenido: Response[];
}

export interface ObtenerProductosState {
	lang: string,
	pagina: number,
	tamanio: number,
	busqueda: string,
	negocioId: number,
    pageProducto: Page | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerProductosInitialState: ObtenerProductosState = {
	lang: 'es',
	pagina: 0,
	tamanio: 0,
	busqueda: '',
	negocioId: 0,
    pageProducto: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerProductosLoading = createAction('[obtenerProductos] obtener productos loading', props<{ lang: string, pagina: number, tamanio: number, busqueda: string, negocioId: number }>());
export const obtenerProductosSuccess = createAction('[obtenerProductos] obtener productos success', props<{ pageProducto: Page }>());
export const obtenerProductosFail = createAction('[obtenerProductos] obtener productos fail', props<{ payload: any }>());

export const ObtenerProductosReducer = createReducer(
    ObtenerProductosInitialState,
    on(obtenerProductosLoading, (state, { lang, pagina, tamanio, busqueda, negocioId }) => ({ ...state, loading: true, loaded: false, lang: lang, pagina: pagina, tamanio: tamanio, busqueda: busqueda, negocioId: negocioId }) ),
    on(obtenerProductosSuccess, (state, { pageProducto }) => ({ ...state, loading: false, loaded: true, pageProducto: { ...pageProducto } })),
    on(obtenerProductosFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerProductosEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerProductos$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerProductosLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/producto?pagina=' + action.pagina + '&tamanio=' + action.tamanio + (action.busqueda.trim().length > 0? '&busqueda=' + action.busqueda: '') + '&negocioId=' + action.negocioId)
            .pipe(
                map((pageProducto: any) => obtenerProductosSuccess({ pageProducto: pageProducto })),
                catchError(err => of(obtenerProductosFail({ payload: err })))
            )
        )
    ));
}
