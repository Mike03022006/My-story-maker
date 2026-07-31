import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { SubscriptionService, SubscriptionPlan, SubscriptionTier } from '../../services/subscription.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
  standalone: false
})
export class SubscriptionPage implements OnInit {
  plans: SubscriptionPlan[] = [];
  currentTier: SubscriptionTier = 'free';
  selectedPlan: SubscriptionPlan | null = null;
  showPaymentModal = false;
  selectedPaymentMethod: 'pse' | 'playstore' | null = null;

  constructor(
    private router: Router,
    public subscriptionService: SubscriptionService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.plans = this.subscriptionService.plans;
    this.currentTier = this.subscriptionService.currentSubscriptionValue.tier;
  }

  selectPlan(plan: SubscriptionPlan) {
    if (plan.id === 'free') {
      this.downgradeToPlan('free');
      return;
    }

    this.selectedPlan = plan;
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
    this.selectedPlan = null;
    this.selectedPaymentMethod = null;
  }

  selectPaymentMethod(method: 'pse' | 'playstore') {
    this.selectedPaymentMethod = method;
  }

  async processPayment() {
    if (!this.selectedPlan || !this.selectedPaymentMethod) {
      await this.showAlert('Error', 'Selecciona un método de pago');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Procesando pago...',
      spinner: 'crescent'
    });
    await loading.present();

    // Simular procesamiento de pago (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const uid = this.authService.currentUser?.uid;
    const success = await this.subscriptionService.upgradeToPlan(
      this.selectedPlan.id,
      this.selectedPaymentMethod,
      uid
    );

    await loading.dismiss();

    if (success) {
      this.currentTier = this.selectedPlan.id;
      this.closePaymentModal();
      await this.showSuccessAlert(this.selectedPlan);
    } else {
      await this.showAlert('Error', 'No se pudo procesar el pago. Intenta de nuevo.');
    }
  }

  async downgradeToPlan(tier: SubscriptionTier) {
    const alert = await this.alertCtrl.create({
      header: '¿Cancelar suscripción?',
      message: 'Volverás al plan gratuito y perderás acceso a las funciones premium.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const uid = this.authService.currentUser?.uid;
            await this.subscriptionService.cancelSubscription(uid);
            this.currentTier = 'free';
            await this.showAlert('Suscripción cancelada', 'Has vuelto al plan gratuito.');
          }
        }
      ]
    });

    await alert.present();
  }

  async showSuccessAlert(plan: SubscriptionPlan) {
    const alert = await this.alertCtrl.create({
      header: '¡Suscripción exitosa! 🎉',
      message: `Ahora tienes acceso al plan ${plan.name}. ¡Disfruta de todas las funciones!`,
      buttons: [
        {
          text: 'Crear historia',
          handler: () => {
            this.router.navigate(['/create-story']);
          }
        },
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  isCurrentPlan(planId: SubscriptionTier): boolean {
    return this.currentTier === planId;
  }

  goBack() {
    this.router.navigate(['/tabs']);
  }
}
