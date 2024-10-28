import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export interface EliminarAnuncioState {
	lang: string,
	id: number,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const EliminarAnuncioInitialState: EliminarAnuncioState = {
	lang: 'es',
	id: 0,
	loaded: false,
	loading: false,
    error: null
}

export const eliminarAnuncioLoading = createAction('[eliminarAnuncio] eliminar anuncio loading', props<{ lang: string, id: number }>());
export const eliminarAnuncioSuccess = createAction('[eliminarAnuncio] eliminar anuncio success', props<any>());
export const eliminarAnuncioFail = createAction('[eliminarAnuncio] eliminar anuncio fail', props<{ payload: any }>());

export const EliminarAnuncioReducer = createReducer(
    EliminarAnuncioInitialState,
    on(eliminarAnuncioLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(eliminarAnuncioSuccess, (state, { }) => ({ ...state, loading: false, loaded: true })),
    on(eliminarAnuncioFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class EliminarAnuncioEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadEliminarAnuncio$ = createEffect(() => this.actions$.pipe(
        ofType(eliminarAnuncioLoading),
        mergeMap((action) => this.http.delete(environment.apiUrl + action.lang + '/anuncio/' + action.id)
            .pipe(
                map((response: any) => eliminarAnuncioSuccess({ response: response })),
                catchError(err => of(eliminarAnuncioFail({ payload: err })))
            )
        )
    ));
}
