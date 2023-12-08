import {
  type AbstractControl,
  type AsyncValidatorFn,
  type ValidationErrors
} from '@angular/forms';
import { type BatchAPIService } from '../services/batch-api.service';
import { type Observable, map } from 'rxjs';

export const createValidator = (batchAPIService: BatchAPIService): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return batchAPIService.checkIfReagentExists(control.value).pipe(
      map((res) => {
        return res ? { reagentAlreadyExists: true } : null;
      })
    );
  };
};
