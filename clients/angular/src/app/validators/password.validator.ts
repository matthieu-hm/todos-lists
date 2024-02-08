import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidators {
  static match(matchControlName: string): ValidatorFn {
    const getMatchControl = (controls: AbstractControl): AbstractControl | null => {
      const controlFound = controls.get(matchControlName);

      if (controlFound) {
        return controlFound;
      }

      if (controls.parent) {
        return getMatchControl(controls.parent);
      }

      return null;
    };

    return (control: AbstractControl): ValidationErrors | null => {
      const matchControl = getMatchControl(control);

      if (control?.value !== matchControl?.value) {
        return { match: true };
      }

      return null;
    };
  }

  static containsLowercase(control: AbstractControl): ValidationErrors | null {
    const regexp = /([a-zà-öø-ýšœž])/;
    const containsLowercase = regexp.test(control.value);

    if (!containsLowercase) {
      return { containsLowercase: true };
    }

    return null;
  }

  static containsUppercase(control: AbstractControl): ValidationErrors | null {
    const regexp = /([A-ZÀ-ÖØ-ÝŠŒŽŸ])/;
    const containsUppercase = regexp.test(control.value);

    if (!containsUppercase) {
      return { containsUppercase: true };
    }

    return null;
  }

  static containsNumber(control: AbstractControl): ValidationErrors | null {
    const regexp = /([0-9])/;
    const containsNumber = regexp.test(control.value);

    if (!containsNumber) {
      return { containsNumber: true };
    }

    return null;
  }

  static containsSpecialChar(control: AbstractControl): ValidationErrors | null {
    const regexp = /([!"#$£€%&'()*+\-,./\\:;<=>?@[\]^_`{|}~µ])/;
    const containsSpecialChar = regexp.test(control.value);

    if (!containsSpecialChar) {
      return { containsSpecialChar: true };
    }

    return null;
  }

  static containsOnlyAllowedChar(control: AbstractControl): ValidationErrors | null {
    const regexp = /^([a-zà-öø-ýšœžA-ZÀ-ÖØ-ÝŠŒŽŸ0-9!"#$£€%&'()*+\-,./\\:;<=>?@[\]^_`{|}~µ]+)$/;
    const containsSpecialChar = regexp.test(control.value);

    if (!containsSpecialChar) {
      return { containsSpecialChar: true };
    }

    return null;
  }
}
