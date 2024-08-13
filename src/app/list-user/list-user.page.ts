// src/app/list-user/list-user.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.page.html',
  styleUrls: ['./list-user.page.scss'],
})
export class ListUserPage implements OnInit {
  users: any[] = [];

  constructor(private authService: AuthService, private modalController: ModalController) { }

  ngOnInit() {
    this.authService.getUsers().subscribe(response => {
      this.users = response.data;
    });
  }

  selectUser(user: any) {
    this.modalController.dismiss(user);
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
