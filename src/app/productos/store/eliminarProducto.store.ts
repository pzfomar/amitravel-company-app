import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export interface EliminarProductoState {
	lang: string,
	id: number,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const EliminarProductoInitialState: EliminarProductoState = {
	lang: 'es',
	id: 0,
	loaded: false,
	loading: false,
    error: null
}

export const eliminarProductoLoading = createAction('[eliminarProducto] eliminar producto loading', props<{ lang: string, id: number }>());
export const eliminarProductoSuccess = createAction('[eliminarProducto] eliminar producto success', props<any>());
export const eliminarProductoFail = createAction('[eliminarProducto] eliminar producto fail', props<{ payload: any }>());

export const EliminarProductoReducer = createReducer(
    EliminarProductoInitialState,
    on(eliminarProductoLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(eliminarProductoSuccess, (state, { }) => ({ ...state, loading: false, loaded: true })),
    on(eliminarProductoFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class EliminarProductoEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadEliminarProducto$ = createEffect(() => this.actions$.pipe(
        ofType(eliminarProductoLoading),
        mergeMap((action) => this.http.delete(environment.apiUrl + action.lang + '/producto/' + action.id)
            .pipe(
                map((response: any) => eliminarProductoSuccess({ response: response })),
                catchError(err => of(eliminarProductoFail({ payload: err })))
            )
        )
    ));
}
