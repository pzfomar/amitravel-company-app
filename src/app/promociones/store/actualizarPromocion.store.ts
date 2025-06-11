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

export interface ActualizarPromocionState {
	lang: string,
	id: number,
	request: Request,
    response: Response | null,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const ActualizarPromocionInitialState: ActualizarPromocionState = {
	lang: 'es',
	id: 0,
	request: null,
    response: null,
	loaded: false,
	loading: false,
    error: null
}

export const actualizarPromocionLoading = createAction('[actualizarPromocion] actualizar promocion loading', props<{ lang: string, id: number, request: Request }>());
export const actualizarPromocionSuccess = createAction('[actualizarPromocion] actualizar promocion success', props<{ response: Response }>());
export const actualizarPromocionFail = createAction('[actualizarPromocion] actualizar promocion fail', props<{ payload: any }>());

export const ActualizarPromocionReducer = createReducer(
    ActualizarPromocionInitialState,
    on(actualizarPromocionLoading, (state, { lang, id, request }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id, request: request }) ),
    on(actualizarPromocionSuccess, (state, { response }) => ({ ...state, loading: false, loaded: true, response: { ...response } })),
    on(actualizarPromocionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class ActualizarPromocionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadActualizarPromocion$ = createEffect(() => this.actions$.pipe(
        ofType(actualizarPromocionLoading),
        mergeMap((action) => this.http.put(environment.apiUrl + action.lang + '/promocion/' + action.id, action.request)
            .pipe(
                map((response: any) => actualizarPromocionSuccess({ response: response })),
                catchError(err => of(actualizarPromocionFail({ payload: err })))
            )
        )
    ));
}
