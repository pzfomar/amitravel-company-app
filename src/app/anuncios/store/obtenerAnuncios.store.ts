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
}

export class Page {
	public paginas: number;
	public paginaSeleccionada: number;
	public contenido: Response[];
}

export interface ObtenerAnunciosState {
	lang: string,
	pagina: number,
	tamanio: number,
	busqueda: string,
	negocioId: number,
    pageAnuncio: Page | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerAnunciosInitialState: ObtenerAnunciosState = {
	lang: 'es',
	pagina: 0,
	tamanio: 0,
	busqueda: '',
	negocioId: 0,
    pageAnuncio: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerAnunciosLoading = createAction('[obtenerAnuncios] obtener anuncios loading', props<{ lang: string, pagina: number, tamanio: number, busqueda: string, negocioId: number }>());
export const obtenerAnunciosSuccess = createAction('[obtenerAnuncios] obtener anuncios success', props<{ pageAnuncio: Page }>());
export const obtenerAnunciosFail = createAction('[obtenerAnuncios] obtener anuncios fail', props<{ payload: any }>());

export const ObtenerAnunciosReducer = createReducer(
    ObtenerAnunciosInitialState,
    on(obtenerAnunciosLoading, (state, { lang, pagina, tamanio, busqueda, negocioId }) => ({ ...state, loading: true, loaded: false, lang: lang, pagina: pagina, tamanio: tamanio, busqueda: busqueda, negocioId: negocioId }) ),
    on(obtenerAnunciosSuccess, (state, { pageAnuncio }) => ({ ...state, loading: false, loaded: true, pageAnuncio: { ...pageAnuncio } })),
    on(obtenerAnunciosFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerAnunciosEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerAnuncios$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerAnunciosLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/anuncio?pagina=' + action.pagina + '&tamanio=' + action.tamanio + (action.busqueda.trim().length > 0? '&busqueda=' + action.busqueda: '') + '&negocioId=' + action.negocioId)
            .pipe(
                map((pageAnuncio: any) => obtenerAnunciosSuccess({ pageAnuncio: pageAnuncio })),
                catchError(err => of(obtenerAnunciosFail({ payload: err })))
            )
        )
    ));
}
