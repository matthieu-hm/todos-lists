import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';
import { CommonValidators, PasswordValidators } from 'src/app/validators';

@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.scss'],
})
export class AuthSignupComponent {
  @ViewChild('signUpNgForm') signUpNgForm!: NgForm;

  alert: { message: string } = {
    message: '',
  };

  alreadyUsedEmails: string[] = [];

  signUpForm = this.formBuilder.group({
    firstName: ['', Validators.maxLength(100)],
    lastName: ['', Validators.maxLength(100)],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(100),
      CommonValidators.notIn(this.alreadyUsedEmails),
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(32),

      /**
       * Projet demo: osef la complexité du mot de passe
       */

      // PasswordValidators.containsLowercase,
      // PasswordValidators.containsUppercase,
      // PasswordValidators.containsNumber,
      // PasswordValidators.containsSpecialChar,
      // PasswordValidators.containsOnlyAllowedChar,
    ]],
    passwordConfirm: ['', [Validators.required, PasswordValidators.match('password')]],
    tosAccepted: ['', Validators.requiredTrue],
  });

  showAlert = false;

  showForm = true;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  signUp(): void {
    // Do nothing if the form is invalid
    if (this.signUpForm.invalid) {
      return;
    }

    // Disable the form
    this.signUpForm.disable();

    // Hide the alert
    this.showAlert = false;

    const formValue = this.getFormValue();

    // Sign up
    this.authService
      .signUp(formValue.email, formValue.password, formValue.firstName, formValue.lastName)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          if (err instanceof HttpErrorResponse) {
            // if (err.error?.errors?.user?.email) {
            this.alreadyUsedEmails.push(formValue.email);
            // }
          }

          // Re-enable the form
          this.signUpForm.enable();

          // Reset the form
          this.signUpNgForm.resetForm();

          // Set the alert
          this.alert = {
            message: 'Something went wrong. Please try again.',
          };

          // Show the alert
          this.showAlert = true;
        },
      });
  }

  private getFormValue() {
    const formValue = this.signUpForm.value;

    if (!formValue.email) {
      throw new Error('Email is required');
    }

    if (!formValue.password) {
      throw new Error('Password is required');
    }

    return {
      firstName: formValue.firstName || undefined,
      lastName: formValue.lastName || undefined,
      email: formValue.email,
      password: formValue.password,
      tosAccepted: !!formValue.tosAccepted,
    };
  }
}
