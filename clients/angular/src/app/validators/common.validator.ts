import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CommonValidators {
  static notIn(forbiddenValues: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (forbiddenValues.includes(control.value)) {
        return { notIn: true };
      }

      return null;
    };
  }
}
