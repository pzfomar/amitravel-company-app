import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export interface EliminarCalificacionState {
	lang: string,
	id: number,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const EliminarCalificacionInitialState: EliminarCalificacionState = {
	lang: 'es',
	id: 0,
	loaded: false,
	loading: false,
    error: null
}

export const eliminarCalificacionLoading = createAction('[eliminarCalificacion] eliminar calificacion loading', props<{ lang: string, id: number }>());
export const eliminarCalificacionSuccess = createAction('[eliminarCalificacion] eliminar calificacion success', props<any>());
export const eliminarCalificacionFail = createAction('[eliminarCalificacion] eliminar calificacion fail', props<{ payload: any }>());

export const EliminarCalificacionReducer = createReducer(
    EliminarCalificacionInitialState,
    on(eliminarCalificacionLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(eliminarCalificacionSuccess, (state, { }) => ({ ...state, loading: false, loaded: true })),
    on(eliminarCalificacionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class EliminarCalificacionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadEliminarCalificacion$ = createEffect(() => this.actions$.pipe(
        ofType(eliminarCalificacionLoading),
        mergeMap((action) => this.http.delete(environment.apiUrl + action.lang + '/calificacion/' + action.id)
            .pipe(
                map((response: any) => eliminarCalificacionSuccess({ response: response })),
                catchError(err => of(eliminarCalificacionFail({ payload: err })))
            )
        )
    ));
}
