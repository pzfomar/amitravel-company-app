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

export interface ListaUsuariosState {
	lang: string,
    usuarios: Response[] | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ListaUsuariosInitialState: ListaUsuariosState = {
	lang: 'es',
    usuarios: null,
	loaded: false,
	loading: false,
    error: null
}

export const listaUsuariosLoading = createAction('[listaUsuarios] lista usuarios loading', props<{ lang: string }>());
export const listaUsuariosSuccess = createAction('[listaUsuarios] lista usuarios success', props<{ usuarios: Response[] }>());
export const listaUsuariosFail = createAction('[listaUsuarios] lista usuarios fail', props<{ payload: any }>());

export const ListaUsuariosReducer = createReducer(
    ListaUsuariosInitialState,
    on(listaUsuariosLoading, (state, { lang }) => ({ ...state, loading: true, loaded: false, lang: lang }) ),
    on(listaUsuariosSuccess, (state, { usuarios }) => ({ ...state, loading: false, loaded: true, usuarios: usuarios })),
    on(listaUsuariosFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ListaUsuariosEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadListaUsuarios$ = createEffect(() => this.actions$.pipe(
        ofType(listaUsuariosLoading),
        mergeMap((action) => this.http.get(environment.apiUrl + action.lang + '/usuario/lista')
            .pipe(
                map((usuarios: any) => listaUsuariosSuccess({ usuarios: usuarios })),
                catchError(err => of(listaUsuariosFail({ payload: err })))
            )
        )
    ));
}
