import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export interface EliminarNotificacionState {
	lang: string,
	id: number,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const EliminarNotificacionInitialState: EliminarNotificacionState = {
	lang: 'es',
	id: 0,
	loaded: false,
	loading: false,
    error: null
}

export const eliminarNotificacionLoading = createAction('[eliminarNotificacion] eliminar notificacion loading', props<{ lang: string, id: number }>());
export const eliminarNotificacionSuccess = createAction('[eliminarNotificacion] eliminar notificacion success', props<any>());
export const eliminarNotificacionFail = createAction('[eliminarNotificacion] eliminar notificacion fail', props<{ payload: any }>());

export const EliminarNotificacionReducer = createReducer(
    EliminarNotificacionInitialState,
    on(eliminarNotificacionLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(eliminarNotificacionSuccess, (state, { }) => ({ ...state, loading: false, loaded: true })),
    on(eliminarNotificacionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class EliminarNotificacionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadEliminarNotificacion$ = createEffect(() => this.actions$.pipe(
        ofType(eliminarNotificacionLoading),
        mergeMap((action) => this.http.delete(environment.apiUrl + action.lang + '/notificacion/' + action.id)
            .pipe(
                map((response: any) => eliminarNotificacionSuccess({ response: response })),
                catchError(err => of(eliminarNotificacionFail({ payload: err })))
            )
        )
    ));
}
