import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizeService, AuthenticationResultStatus } from '../authorize.service';
import { FailureAuthenticationResult } from '../authorize.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public message = new BehaviorSubject<string | null | undefined>(null);
  loginForm: FormGroup;

  constructor(
    private authorizeService: AuthorizeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')!.value;
      const password = this.loginForm.get('password')!.value;

      this.authorizeService.login(email, password).subscribe(
        result => {
          if (result?.status === AuthenticationResultStatus.Success) {
            // Успішний логін - перенаправлення на головну сторінку або іншу потрібну сторінку
            this.router.navigate(['/']);
          } else if (result?.status === AuthenticationResultStatus.Fail) {
            // Невдалий логін - встановлення повідомлення про помилку
            this.message.next((result as FailureAuthenticationResult).message);
          } else {
            // Інші випадки, якщо не Fail
            this.message.next('An unexpected error occurred during login.');
          }
        },
        error => {
          console.error('Error during login:', error);
          // Встановлення загального повідомлення про помилку
          this.message.next('An error occurred during login. Please try again.');
        }
      );
    }
  }
}
