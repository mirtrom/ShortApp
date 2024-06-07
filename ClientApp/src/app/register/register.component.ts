import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthorizeService, AuthenticationResultStatus} from '../authorize.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public message = new BehaviorSubject<string | null | undefined>(null);
  successMessage: string | null = null;
  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authorizeService: AuthorizeService) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      drivingLicense: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      const drivingLicense = this.registerForm.get('drivingLicense')?.value;
      const phoneNumber = this.registerForm.get('phoneNumber')?.value;

      // Виклик сервісу для реєстрації
      this.authorizeService.register(email, password, drivingLicense, phoneNumber).subscribe(result => {
        // Обробка результату реєстрації
        if (result.status === AuthenticationResultStatus.Success) {
          this.successMessage = 'Registration successful. You can now login.';
        } else if (result.status === AuthenticationResultStatus.Fail) {
          // Реєстрація не вдалася - встановлення повідомлення про помилку
          console.error(result.message);
          this.message.next(result.message);
        } else {
          // Інші випадки, якщо не Fail
          console.error('An unexpected error occurred during registration.');
          this.message.next('An unexpected error occurred during registration.');
        }
      });
    }
  }
}
