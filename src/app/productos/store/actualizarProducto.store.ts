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

export interface ActualizarProductoState {
	lang: string,
	id: number,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ActualizarProductoInitialState: ActualizarProductoState = {
	lang: 'es',
	id: 0,
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const actualizarProductoLoading = createAction('[actualizarProducto] actualizar producto loading', props<{ lang: string, id: number, request: Request }>());
export const actualizarProductoSuccess = createAction('[actualizarProducto] actualizar producto success', props<{ response: Response }>());
export const actualizarProductoFail = createAction('[actualizarProducto] actualizar producto fail', props<{ payload: any }>());

export const ActualizarProductoReducer = createReducer(
    ActualizarProductoInitialState,
    on(actualizarProductoLoading, (state, { lang, id, request }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id, request: request }) ),
    on(actualizarProductoSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(actualizarProductoFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ActualizarProductoEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadActualizarProducto$ = createEffect(() => this.actions$.pipe(
        ofType(actualizarProductoLoading),
        mergeMap((action) => this.http.put(environment.apiUrl + action.lang + '/producto/' + action.id, action.request)
            .pipe(
                map((response: any) => actualizarProductoSuccess({ response: response })),
                catchError(err => of(actualizarProductoFail({ payload: err })))
            )
        )
    ));
}
