import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  currency: string;
  features: {
    maxCharacters: number; // 0 = ilimitado
    maxSettings: number; // 0 = ilimitado
    storyLength: 'short' | 'medium' | 'long';
    hasAudio: boolean;
    hasImage: boolean;
    canSaveStories: boolean;
  };
  description: string;
  icon: string;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  startDate: number;
  endDate: number | null; // null = sin expiración
  isActive: boolean;
  paymentMethod?: 'pse' | 'playstore';
  transactionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  
  // Planes disponibles
  readonly plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 0,
      currency: 'COP',
      features: {
        maxCharacters: 5,
        maxSettings: 5,
        storyLength: 'short',
        hasAudio: false,
        hasImage: false,
        canSaveStories: false
      },
      description: 'Crea historias cortas sin guardar',
      icon: '📖'
    },
    {
      id: 'basic',
      name: 'Básico',
      price: 9900,
      currency: 'COP',
      features: {
        maxCharacters: 0, // ilimitado
        maxSettings: 0, // ilimitado
        storyLength: 'long',
        hasAudio: true,
        hasImage: false,
        canSaveStories: true
      },
      description: 'Historias completas con audio y almacenamiento',
      icon: '🎧'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19900,
      currency: 'COP',
      features: {
        maxCharacters: 0, // ilimitado
        maxSettings: 0, // ilimitado
        storyLength: 'long',
        hasAudio: true,
        hasImage: true,
        canSaveStories: true
      },
      description: 'Experiencia completa con imágenes generadas por IA',
      icon: '✨'
    }
  ];

  private subscription$ = new BehaviorSubject<UserSubscription>({
    tier: 'free',
    startDate: Date.now(),
    endDate: null,
    isActive: true
  });

  get currentSubscription() {
    return this.subscription$.asObservable();
  }

  get currentSubscriptionValue(): UserSubscription {
    return this.subscription$.value;
  }

  get currentPlan(): SubscriptionPlan {
    return this.plans.find(p => p.id === this.subscription$.value.tier) || this.plans[0];
  }

  constructor() {
    this.loadSubscription();
  }

  async loadSubscription(uid?: string): Promise<void> {
    const key = uid ? `subscription_${uid}` : 'subscription';
    const { value } = await Preferences.get({ key });
    
    if (value) {
      const subscription = JSON.parse(value);
      this.subscription$.next(subscription);
    }
  }

  async saveSubscription(subscription: UserSubscription, uid?: string): Promise<void> {
    const key = uid ? `subscription_${uid}` : 'subscription';
    await Preferences.set({
      key,
      value: JSON.stringify(subscription)
    });
    this.subscription$.next(subscription);
  }

  async upgradeToPlan(tier: SubscriptionTier, paymentMethod: 'pse' | 'playstore', uid?: string): Promise<boolean> {
    const plan = this.plans.find(p => p.id === tier);
    if (!plan) return false;

    const subscription: UserSubscription = {
      tier,
      startDate: Date.now(),
      endDate: null, // Suscripción sin expiración (o puedes agregar lógica de renovación)
      isActive: true,
      paymentMethod,
      transactionId: this.generateTransactionId()
    };

    await this.saveSubscription(subscription, uid);
    return true;
  }

  async cancelSubscription(uid?: string): Promise<void> {
    const subscription: UserSubscription = {
      tier: 'free',
      startDate: Date.now(),
      endDate: null,
      isActive: true
    };

    await this.saveSubscription(subscription, uid);
  }

  canAccessFeature(feature: keyof SubscriptionPlan['features']): boolean {
    return this.currentPlan.features[feature] as boolean;
  }

  getMaxCharacters(): number {
    return this.currentPlan.features.maxCharacters;
  }

  getMaxSettings(): number {
    return this.currentPlan.features.maxSettings;
  }

  private generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  formatPrice(price: number, currency: string = 'COP'): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency
    }).format(price);
  }
}
