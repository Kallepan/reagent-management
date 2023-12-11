import {
  type AbstractControl,
  type AsyncValidatorFn,
  type ValidationErrors,
} from '@angular/forms';
import { type BatchAPIService } from '../services/batch-api.service';
import { type Observable, map, tap } from 'rxjs';

export const createValidator = (
  batchAPIService: BatchAPIService
): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return batchAPIService.checkIfReagentExists(control.value).pipe(
      map((res) => {
        return res ? { reagentAlreadyExists: true } : null;
      }),
      tap((res) => {
        // if valid i.e. null disable the formcontrol
        if (res === null) {
          control.disable({ emitEvent: false, onlySelf: true });
        } else {
          control.enable({ emitEvent: false, onlySelf: true });
        }
      })
    );
  };
};
