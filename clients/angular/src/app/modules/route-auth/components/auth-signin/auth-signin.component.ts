import { Component, ViewChild } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth';

@Component({
  selector: 'app-auth-signin',
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss'],
})
export class AuthSigninComponent {
  @ViewChild('signInNgForm') signInNgForm!: NgForm;

  alert: { message: string } = {
    message: '',
  };

  alreadyUsedEmails: string[] = [];

  signInForm = this.formBuilder.group({
    email: ['', [
      Validators.required,
    ]],
    password: ['', [
      Validators.required,
    ]],
  });

  showAlert = false;

  showForm = true;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  signIn(): void {
    // Do nothing if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    const formValue = this.getFormValue();

    // Sign up
    this.authService
      .signIn(formValue.email, formValue.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: () => {
          // Re-enable the form
          this.signInForm.enable();

          // Reset the form
          this.signInNgForm.resetForm();

          // Set the alert
          this.alert = {
            message: 'Wrong email or password. Please try again.',
          };

          // Show the alert
          this.showAlert = true;
        },
      });
  }

  private getFormValue() {
    const formValue = this.signInForm.value;

    if (!formValue.email) {
      throw new Error('Email is required');
    }

    if (!formValue.password) {
      throw new Error('Password is required');
    }

    return {
      email: formValue.email,
      password: formValue.password,
    };
  }
}
