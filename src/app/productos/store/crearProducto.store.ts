import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export class Request {
	public negocioId: number;
	public nombre: string;
	public tipo: string;
	public descripcion: string;
	public imagen: string;
	public caducidad: Date;
	public cantidad: number;
	public estatus: boolean;
}

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

export interface CrearProductoState {
	lang: string,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const CrearProductoInitialState: CrearProductoState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const crearProductoLoading = createAction('[crearProducto] crear producto loading', props<{ lang: string, request: Request }>());
export const crearProductoSuccess = createAction('[crearProducto] crear producto success', props<{ response: Response }>());
export const crearProductoFail = createAction('[crearProducto] crear producto fail', props<{ payload: any }>());

export const CrearProductoReducer = createReducer(
    CrearProductoInitialState,
    on(crearProductoLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(crearProductoSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(crearProductoFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class CrearProductoEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadCrearProducto$ = createEffect(() => this.actions$.pipe(
        ofType(crearProductoLoading),
        mergeMap((action) => this.http.post(environment.apiUrl + action.lang + '/producto', action.request)
            .pipe(
                map((response: any) => crearProductoSuccess({ response: response })),
                catchError(err => of(crearProductoFail({ payload: err })))
            )
        )
    ));
}
