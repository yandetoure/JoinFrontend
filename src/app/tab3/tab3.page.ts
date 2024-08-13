import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  userInfo: any = {};

  constructor(private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.authService.getUserInfo().subscribe(
      data => {
        console.log('User Info:', data); // Ajoutez ce log pour vérifier les données reçues
        this.userInfo = data.data; // Assurez-vous que `data.data` contient les informations utilisateur
      },
      error => {
        console.error('Erreur lors de la récupération des informations utilisateur', error);
      }
    );
  }
  

  logout() {
    this.authService.logout().subscribe(
      () => {
        this.router.navigate(['/login']); // Redirige vers la page de connexion après la déconnexion
      },
      error => {
        console.error('Erreur lors de la déconnexion', error);
      }
    );
  }
}
