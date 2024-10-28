import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export interface EliminarEventoState {
	lang: string,
	id: number,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const EliminarEventoInitialState: EliminarEventoState = {
	lang: 'es',
	id: 0,
	loaded: false,
	loading: false,
    error: null
}

export const eliminarEventoLoading = createAction('[eliminarEvento] eliminar evento loading', props<{ lang: string, id: number }>());
export const eliminarEventoSuccess = createAction('[eliminarEvento] eliminar evento success', props<any>());
export const eliminarEventoFail = createAction('[eliminarEvento] eliminar evento fail', props<{ payload: any }>());

export const EliminarEventoReducer = createReducer(
    EliminarEventoInitialState,
    on(eliminarEventoLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(eliminarEventoSuccess, (state, { }) => ({ ...state, loading: false, loaded: true })),
    on(eliminarEventoFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class EliminarEventoEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadEliminarEvento$ = createEffect(() => this.actions$.pipe(
        ofType(eliminarEventoLoading),
        mergeMap((action) => this.http.delete(environment.apiUrl + action.lang + '/evento/' + action.id)
            .pipe(
                map((response: any) => eliminarEventoSuccess({ response: response })),
                catchError(err => of(eliminarEventoFail({ payload: err })))
            )
        )
    ));
}
