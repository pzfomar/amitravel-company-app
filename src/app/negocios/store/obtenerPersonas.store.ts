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
	public correo: string;
	public nombre: string;
	public apellidoPaterno: string;
	public apellidoMaterno: string;
	public edad: number;
	public telefono: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
}

export class Page {
	public paginas: number;
	public paginaSeleccionada: number;
	public contenido: Response[];
}

export interface ObtenerPersonasState {
	lang: string,
	pagina: number,
	tamanio: number,
	busqueda: string,
	usuarioId: number,
    pagePersona: Page | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerPersonasInitialState: ObtenerPersonasState = {
	lang: 'es',
	pagina: 0,
	tamanio: 0,
	busqueda: '',
	usuarioId: 0,
    pagePersona: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerPersonasLoading = createAction('[obtenerPersonas] obtener personas loading', props<{ lang: string, pagina: number, tamanio: number, busqueda: string, usuarioId: number }>());
export const obtenerPersonasSuccess = createAction('[obtenerPersonas] obtener personas success', props<{ pagePersona: Page }>());
export const obtenerPersonasFail = createAction('[obtenerPersonas] obtener personas fail', props<{ payload: any }>());

export const ObtenerPersonasReducer = createReducer(
    ObtenerPersonasInitialState,
    on(obtenerPersonasLoading, (state, { lang, pagina, tamanio, busqueda, usuarioId }) => ({ ...state, loading: true, loaded: false, lang: lang, pagina: pagina, tamanio: tamanio, busqueda: busqueda, usuarioId: usuarioId }) ),
    on(obtenerPersonasSuccess, (state, { pagePersona }) => ({ ...state, loading: false, loaded: true, pagePersona: { ...pagePersona } })),
    on(obtenerPersonasFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerPersonasEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerPersonas$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerPersonasLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/persona?pagina=' + action.pagina + '&tamanio=' + action.tamanio + (action.busqueda.trim().length > 0? '&busqueda=' + action.busqueda: '') + (action.usuarioId? '&usuarioId=' + action.usuarioId: ''))
            .pipe(
                map((pagePersona: any) => obtenerPersonasSuccess({ pagePersona: pagePersona })),
                catchError(err => of(obtenerPersonasFail({ payload: err })))
            )
        )
    ));
}
