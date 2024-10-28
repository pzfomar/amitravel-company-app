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

export interface ListaNegociosState {
	lang: string,
    negocios: Response[] | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ListaNegociosInitialState: ListaNegociosState = {
	lang: 'es',
    negocios: null,
	loaded: false,
	loading: false,
    error: null
}

export const listaNegociosLoading = createAction('[listaNegocios] lista negocios loading', props<{ lang: string }>());
export const listaNegociosSuccess = createAction('[listaNegocios] lista negocios success', props<{ negocios: Response[] }>());
export const listaNegociosFail = createAction('[listaNegocios] lista negocios fail', props<{ payload: any }>());

export const ListaNegociosReducer = createReducer(
    ListaNegociosInitialState,
    on(listaNegociosLoading, (state, { lang }) => ({ ...state, loading: true, loaded: false, lang: lang }) ),
    on(listaNegociosSuccess, (state, { negocios }) => ({ ...state, loading: false, loaded: true, negocios: negocios })),
    on(listaNegociosFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ListaNegociosEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadListaNegocios$ = createEffect(() => this.actions$.pipe(
        ofType(listaNegociosLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/negocio/lista')
            .pipe(
                map((negocios: any) => listaNegociosSuccess({ negocios: negocios })),
                catchError(err => of(listaNegociosFail({ payload: err })))
            )
        )
    ));
}
