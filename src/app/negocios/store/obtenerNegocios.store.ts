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

export class Response {
	public id: number;
	public nombre: string;
	public descripcion: string;
	public mapa: string;
	public lugar: string;
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

export class Page {
	public paginas: number;
	public paginaSeleccionada: number;
	public contenido: Response[];
}

export interface ObtenerNegociosState {
	lang: string,
	pagina: number,
	tamanio: number,
	busqueda: string,
	id: number,
    pageNegocio: Page | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerNegociosInitialState: ObtenerNegociosState = {
	lang: 'es',
	pagina: 0,
	tamanio: 0,
	busqueda: '',
	id: 0,
    pageNegocio: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerNegociosLoading = createAction('[obtenerNegocios] obtener negocios loading', props<{ lang: string, pagina: number, tamanio: number, busqueda: string, id: number }>());
export const obtenerNegociosSuccess = createAction('[obtenerNegocios] obtener negocios success', props<{ pageNegocio: Page }>());
export const obtenerNegociosFail = createAction('[obtenerNegocios] obtener negocios fail', props<{ payload: any }>());

export const ObtenerNegociosReducer = createReducer(
    ObtenerNegociosInitialState,
    on(obtenerNegociosLoading, (state, { lang, pagina, tamanio, busqueda, id }) => ({ ...state, loading: true, loaded: false, lang: lang, pagina: pagina, tamanio: tamanio, busqueda: busqueda, id: id }) ),
    on(obtenerNegociosSuccess, (state, { pageNegocio }) => ({ ...state, loading: false, loaded: true, pageNegocio: { ...pageNegocio } })),
    on(obtenerNegociosFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerNegociosEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerNegocios$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerNegociosLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/negocio?pagina=' + action.pagina + '&tamanio=' + action.tamanio + (action.busqueda.trim().length > 0? '&busqueda=' + action.busqueda: '') + (action.id? '&id=' + action.id: ''))
            .pipe(
                map((pageNegocio: any) => obtenerNegociosSuccess({ pageNegocio: pageNegocio })),
                catchError(err => of(obtenerNegociosFail({ payload: err })))
            )
        )
    ));
}
