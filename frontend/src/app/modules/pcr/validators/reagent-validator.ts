import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { BatchAPIService } from '../services/batch-api.service';
import { Observable, map, tap } from 'rxjs';

export class ReagentValidator {
  static createValidator(batchAPIService: BatchAPIService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return batchAPIService.checkIfReagentExists(control.value).pipe(
        map((res) => {
          return res ? { reagentAlreadyExists: true } : null;
        }),
        tap((res) => {
          if (!res) control.disable({ emitEvent: false });
        })
      );
    };
  }
}
