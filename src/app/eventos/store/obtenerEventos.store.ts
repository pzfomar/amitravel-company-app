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
	public evento: any;
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

export class Page {
	public paginas: number;
	public paginaSeleccionada: number;
	public contenido: Response[];
}

export interface ObtenerEventosState {
	lang: string,
	pagina: number,
	tamanio: number,
	busqueda: string,
	negocioId: number,
    pageEvento: Page | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerEventosInitialState: ObtenerEventosState = {
	lang: 'es',
	pagina: 0,
	tamanio: 0,
	busqueda: '',
	negocioId: 0,
    pageEvento: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerEventosLoading = createAction('[obtenerEventos] obtener eventos loading', props<{ lang: string, pagina: number, tamanio: number, busqueda: string, negocioId: number }>());
export const obtenerEventosSuccess = createAction('[obtenerEventos] obtener eventos success', props<{ pageEvento: Page }>());
export const obtenerEventosFail = createAction('[obtenerEventos] obtener eventos fail', props<{ payload: any }>());

export const ObtenerEventosReducer = createReducer(
    ObtenerEventosInitialState,
    on(obtenerEventosLoading, (state, { lang, pagina, tamanio, busqueda, negocioId }) => ({ ...state, loading: true, loaded: false, lang: lang, pagina: pagina, tamanio: tamanio, busqueda: busqueda, negocioId: negocioId }) ),
    on(obtenerEventosSuccess, (state, { pageEvento }) => ({ ...state, loading: false, loaded: true, pageEvento: { ...pageEvento } })),
    on(obtenerEventosFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerEventosEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerEventos$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerEventosLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/evento?pagina=' + action.pagina + '&tamanio=' + action.tamanio + (action.busqueda.trim().length > 0? '&busqueda=' + action.busqueda: '') + '&negocioId=' + action.negocioId)
            .pipe(
                map((pageEvento: any) => obtenerEventosSuccess({ pageEvento: pageEvento })),
                catchError(err => of(obtenerEventosFail({ payload: err })))
            )
        )
    ));
}
