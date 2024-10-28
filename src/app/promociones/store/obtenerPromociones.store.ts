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
	public descripcion: string;
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

export interface ObtenerPromocionesState {
	lang: string,
	pagina: number,
	tamanio: number,
	busqueda: string,
	negocioId: number,
    pagePromocion: Page | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerPromocionesInitialState: ObtenerPromocionesState = {
	lang: 'es',
	pagina: 0,
	tamanio: 0,
	busqueda: '',
	negocioId: 0,
    pagePromocion: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerPromocionesLoading = createAction('[obtenerPromociones] obtener promociones loading', props<{ lang: string, pagina: number, tamanio: number, busqueda: string, negocioId: number }>());
export const obtenerPromocionesSuccess = createAction('[obtenerPromociones] obtener promociones success', props<{ pagePromocion: Page }>());
export const obtenerPromocionesFail = createAction('[obtenerPromociones] obtener promociones fail', props<{ payload: any }>());

export const ObtenerPromocionesReducer = createReducer(
    ObtenerPromocionesInitialState,
    on(obtenerPromocionesLoading, (state, { lang, pagina, tamanio, busqueda, negocioId }) => ({ ...state, loading: true, loaded: false, lang: lang, pagina: pagina, tamanio: tamanio, busqueda: busqueda, negocioId: negocioId }) ),
    on(obtenerPromocionesSuccess, (state, { pagePromocion }) => ({ ...state, loading: false, loaded: true, pagePromocion: { ...pagePromocion } })),
    on(obtenerPromocionesFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerPromocionesEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerPromociones$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerPromocionesLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/promocion?pagina=' + action.pagina + '&tamanio=' + action.tamanio + (action.busqueda.trim().length > 0? '&busqueda=' + action.busqueda: '') + '&negocioId=' + action.negocioId)
            .pipe(
                map((pagePromocion: any) => obtenerPromocionesSuccess({ pagePromocion: pagePromocion })),
                catchError(err => of(obtenerPromocionesFail({ payload: err })))
            )
        )
    ));
}
