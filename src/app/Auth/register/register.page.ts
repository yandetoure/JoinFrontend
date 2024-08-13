// src/app/pages/register/register.page.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      pseudo: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onRegister() {
    const { firstName, lastName, pseudo, email, password } = this.registerForm.value;
    this.authService.register(firstName, lastName, pseudo, email, password).pipe(
      catchError(error => {
        this.errorMessage = error.message;
        return of(null); // Retourne un Observable vide pour continuer l'exécution
      })
    ).subscribe(
      response => {
        if (response) {
          this.authService.setToken(response.token);
          this.router.navigate(['/login']);
        }
      }
    );
  }
}
