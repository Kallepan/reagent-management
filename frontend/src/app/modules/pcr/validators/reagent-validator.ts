import {
  type AbstractControl,
  type AsyncValidatorFn,
  type ValidationErrors,
} from '@angular/forms';
import { map, tap, type Observable } from 'rxjs';
import { type BatchAPIService } from '../services/batch-api.service';

export const createValidator = (
  batchAPIService: BatchAPIService,
): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return batchAPIService.checkIfReagentExists(control.value).pipe(
      map((res) => {
        return res ? { reagentAlreadyExists: true } : null;
      }),
      tap((res) => {
        // if valid i.e. null disable the formcontrol
        if (res === null) control.disable({ emitEvent: false, onlySelf: true });
      }),
    );
  };
};

export const createValidatorNoDisable = (
  batchAPIService: BatchAPIService,
): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return batchAPIService.checkIfReagentExists(control.value).pipe(
      map((res) => {
        return res ? { reagentAlreadyExists: true } : null;
      }),
    );
  };
};
