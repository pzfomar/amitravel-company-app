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
	public apodo: string;
	public contrasenia: string;
	public rol: string;
	public estatus: boolean;
	public creacion: Date;
	public actualizacion: Date;
	public persona: any;
	public agendas: any[];
	public calificaciones: any[];
	public busquedas: any[];
	public aficiones: any[];
	public notificaciones: any[];
	public anuncios: any[];
}

export class Page {
	public paginas: number;
	public paginaSeleccionada: number;
	public contenido: Response[];
}

export interface ObtenerUsuariosState {
	lang: string,
	pagina: number,
	tamanio: number,
	busqueda: string,
	id: number,
    pageUsuario: Page | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ObtenerUsuariosInitialState: ObtenerUsuariosState = {
	lang: 'es',
	pagina: 0,
	tamanio: 0,
	busqueda: '',
	id: 0,
    pageUsuario: null,
	loaded: false,
	loading: false,
    error: null
}

export const obtenerUsuariosLoading = createAction('[obtenerUsuarios] obtener usuarios loading', props<{ lang: string, pagina: number, tamanio: number, busqueda: string, id: number }>());
export const obtenerUsuariosSuccess = createAction('[obtenerUsuarios] obtener usuarios success', props<{ pageUsuario: Page }>());
export const obtenerUsuariosFail = createAction('[obtenerUsuarios] obtener usuarios fail', props<{ payload: any }>());

export const ObtenerUsuariosReducer = createReducer(
    ObtenerUsuariosInitialState,
    on(obtenerUsuariosLoading, (state, { lang, pagina, tamanio, busqueda, id }) => ({ ...state, loading: true, loaded: false, lang: lang, pagina: pagina, tamanio: tamanio, busqueda: busqueda, id: id }) ),
    on(obtenerUsuariosSuccess, (state, { pageUsuario }) => ({ ...state, loading: false, loaded: true, pageUsuario: { ...pageUsuario } })),
    on(obtenerUsuariosFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ObtenerUsuariosEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadObtenerUsuarios$ = createEffect(() => this.actions$.pipe(
        ofType(obtenerUsuariosLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/usuario?pagina=' + action.pagina + '&tamanio=' + action.tamanio + (action.busqueda.trim().length > 0? '&busqueda=' + action.busqueda: '') + (action.id? '&id=' + action.id: ''))
            .pipe(
                map((pageUsuario: any) => obtenerUsuariosSuccess({ pageUsuario: pageUsuario })),
                catchError(err => of(obtenerUsuariosFail({ payload: err })))
            )
        )
    ));
}
