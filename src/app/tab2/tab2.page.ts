// src/app/tab2/tab2.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';
import { ListUserPage } from '../list-user/list-user.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  discussions: any[] = [];
  totalUnreadCount: number = 0;

  constructor(
    private messagesService: MessagesService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDiscussions();
  }

  loadDiscussions() {
    this.messagesService.getDiscussions().subscribe(
      response => {
        this.discussions = response.data;
        this.calculateUnreadMessages();
      },
      error => {
        console.error('Erreur lors du chargement des discussions', error);
      }
    );
  }

  calculateUnreadMessages() {
    this.totalUnreadCount = this.discussions.reduce((acc, discussion) => acc + discussion.unread_count, 0);
  }

    getUserIds(discussions: { [key: number]: any[] }): number[] {
    return Object.keys(discussions).map(key => parseInt(key, 10));
  }

  // openMessages(userId: number) {
  //   this.router.navigate(['/messages', userId]);
  // }

  openMessages(userId: number) {
    // Marquer les messages comme lus
    this.messagesService.markMessagesAsRead(userId).subscribe(
      () => {
        // Mise à jour des discussions localement après la réponse
        this.discussions = this.discussions.map(discussion => {
          if (discussion.user_id === userId) {
            discussion.unread_count = 0;
          }
          return discussion;
        });

        // Naviguer vers la page de messages
        this.router.navigate(['/messages', userId]);
      },
      error => {
        console.error('Erreur lors de la mise à jour des messages', error);
      }
    );
  }

  async startNewDiscussion() {
    const modal = await this.modalController.create({
      component: ListUserPage,
    });

    modal.onDidDismiss().then((detail) => {
      if (detail.data) {
        this.openMessages(detail.data.id);  // Redirige vers la page de messages pour l'utilisateur sélectionné
      }
    });

    await modal.present();
  }
}
