import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagesService } from '../services/messages.service';
import { ToastController, ModalController, NavController } from '@ionic/angular';
import { ListUserPage } from '../list-user/list-user.page';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {
  userId!: number;
  messages: any[] = [];
  newMessage: string = '';
  authUserId: number = 1; // Remplacez ceci par l'ID de l'utilisateur authentifié

  constructor(
    private route: ActivatedRoute,
    private messagesService: MessagesService,
    private toastController: ToastController,
    private modalController: ModalController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    if (userIdParam) {
      this.userId = +userIdParam;
      this.messagesService.getMessages(this.userId).subscribe(
        response => {
          this.messages = response.data;
          this.messages.forEach(message => {
            if (!message.is_read) {
              this.messagesService.markMessagesAsRead(message.id).subscribe(
                () => {
                  message.is_read = true; // Mettez à jour l'état localement aussi
                },
                error => {
                  console.error('Erreur lors de la mise à jour du statut du message', error);
                }
              );
            }
          }); // <-- Ajout de la fermeture ici
        },
        async error => {
          const toast = await this.toastController.create({
            message: 'Erreur lors de la récupération des messages',
            duration: 2000,
            color: 'danger',
          });
          toast.present();
        }
      );
    }
  }
  

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messagesService.sendMessage(this.userId, this.newMessage).subscribe(
        response => {
          this.messages.push(response.data);
          this.newMessage = '';
        },
        async error => {
          const toast = await this.toastController.create({
            message: 'Erreur lors de l\'envoi du message',
            duration: 2000,
            color: 'danger',
          });
          toast.present();
        }
      );
    }
  }

  async openUserList() {
    const modal = await this.modalController.create({
      component: ListUserPage
    });

    modal.onDidDismiss().then((detail: any) => {
      if (detail.data) {
        const selectedUser = detail.data;
        this.userId = selectedUser.id;
      }
    });

    return await modal.present();
  }

  onMessageViewed(messageId: number) {
    this.messagesService.markMessagesAsRead(messageId).subscribe(response => {
      console.log('Message marked as read:', response);
    }, error => {
      console.error('Error marking message as read:', error);
    });
  }

  goBack() {
    this.navCtrl.back();
  }
}
