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
}

export interface ListaEventosState {
	lang: string,
    eventos: Response[] | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ListaEventosInitialState: ListaEventosState = {
	lang: 'es',
    eventos: null,
	loaded: false,
	loading: false,
    error: null
}

export const listaEventosLoading = createAction('[listaEventos] lista eventos loading', props<{ lang: string }>());
export const listaEventosSuccess = createAction('[listaEventos] lista eventos success', props<{ eventos: Response[] }>());
export const listaEventosFail = createAction('[listaEventos] lista eventos fail', props<{ payload: any }>());

export const ListaEventosReducer = createReducer(
    ListaEventosInitialState,
    on(listaEventosLoading, (state, { lang }) => ({ ...state, loading: true, loaded: false, lang: lang }) ),
    on(listaEventosSuccess, (state, { eventos }) => ({ ...state, loading: false, loaded: true, eventos: eventos })),
    on(listaEventosFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ListaEventosEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadListaEventos$ = createEffect(() => this.actions$.pipe(
        ofType(listaEventosLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/evento/lista')
            .pipe(
                map((eventos: any) => listaEventosSuccess({ eventos: eventos })),
                catchError(err => of(listaEventosFail({ payload: err })))
            )
        )
    ));
}
