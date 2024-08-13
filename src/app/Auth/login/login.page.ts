import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      async (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.router.navigate(['tabs/tab2']);
        } else {
          const toast = await this.toastController.create({
            message: response.message,
            duration: 2000,
            color: 'danger',
          });
          toast.present();
        }
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: 'Erreur de connexion',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      }
    );
  }
}
