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
	public descripcion: string;
	public imagen: string;
	public estatus: boolean;
}

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

export interface CrearPromocionState {
	lang: string,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const CrearPromocionInitialState: CrearPromocionState = {
	lang: 'es',
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const crearPromocionLoading = createAction('[crearPromocion] crear promocion loading', props<{ lang: string, request: Request }>());
export const crearPromocionSuccess = createAction('[crearPromocion] crear promocion success', props<{ response: Response }>());
export const crearPromocionFail = createAction('[crearPromocion] crear promocion fail', props<{ payload: any }>());

export const CrearPromocionReducer = createReducer(
    CrearPromocionInitialState,
    on(crearPromocionLoading, (state, { lang, request }) => ({ ...state, loading: true, loaded: false, lang: lang, request: request }) ),
    on(crearPromocionSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(crearPromocionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class CrearPromocionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadCrearPromocion$ = createEffect(() => this.actions$.pipe(
        ofType(crearPromocionLoading),
        mergeMap((action) => this.http.post(environment.apiUrl + action.lang + '/promocion', action.request)
            .pipe(
                map((response: any) => crearPromocionSuccess({ response: response })),
                catchError(err => of(crearPromocionFail({ payload: err })))
            )
        )
    ));
}
