import { createAction, props } from "@ngrx/store";
import { createReducer, on } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

export interface EliminarPromocionState {
	lang: string,
	id: number,
	loaded: boolean,
	loading: boolean,
    error: any
}

export const EliminarPromocionInitialState: EliminarPromocionState = {
	lang: 'es',
	id: 0,
	loaded: false,
	loading: false,
    error: null
}

export const eliminarPromocionLoading = createAction('[eliminarPromocion] eliminar promocion loading', props<{ lang: string, id: number }>());
export const eliminarPromocionSuccess = createAction('[eliminarPromocion] eliminar promocion success', props<any>());
export const eliminarPromocionFail = createAction('[eliminarPromocion] eliminar promocion fail', props<{ payload: any }>());

export const EliminarPromocionReducer = createReducer(
    EliminarPromocionInitialState,
    on(eliminarPromocionLoading, (state, { lang, id }) => ({ ...state, loading: true, loaded: false, lang: lang, id: id }) ),
    on(eliminarPromocionSuccess, (state, { }) => ({ ...state, loading: false, loaded: true })),
    on(eliminarPromocionFail, (state, { payload }) => ({ ...state, loading: false, loaded: false, error: { url: payload.url, name: payload.name, message: payload.message } }))
);

@Injectable()
export class EliminarPromocionEffects {
    constructor(private actions$: Actions, private http: HttpClient) { }
    
    loadEliminarPromocion$ = createEffect(() => this.actions$.pipe(
        ofType(eliminarPromocionLoading),
        mergeMap((action) => this.http.delete(environment.apiUrl + action.lang + '/promocion/' + action.id)
            .pipe(
                map((response: any) => eliminarPromocionSuccess({ response: response })),
                catchError(err => of(eliminarPromocionFail({ payload: err })))
            )
        )
    ));
}
