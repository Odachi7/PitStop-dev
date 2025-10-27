export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: {
    maxVehicles: number;
    maxImages: number;
    featuredListings: boolean;
    analytics: boolean;
    prioritySupport: boolean;
    customDomain: boolean;
  };
  limits: {
    monthlyViews: number;
    storage: string; // "1GB", "10GB", "unlimited"
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 0,
    currency: 'BRL',
    interval: 'month',
    features: {
      maxVehicles: 3,
      maxImages: 8,
      featuredListings: false,
      analytics: false,
      prioritySupport: false,
      customDomain: false
    },
    limits: {
      monthlyViews: 1000,
      storage: '100MB'
    }
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 29.90,
    currency: 'BRL',
    interval: 'month',
    features: {
      maxVehicles: 20,
      maxImages: 10,
      featuredListings: true,
      analytics: true,
      prioritySupport: false,
      customDomain: false
    },
    limits: {
      monthlyViews: 10000,
      storage: '1GB'
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 59.90,
    currency: 'BRL',
    interval: 'month',
    features: {
      maxVehicles: 100,
      maxImages: 20,
      featuredListings: true,
      analytics: true,
      prioritySupport: true,
      customDomain: true
    },
    limits: {
      monthlyViews: 50000,
      storage: '10GB'
    }
  },
  {
    id: 'enterprise',
    name: 'Empresarial',
    price: 199.90,
    currency: 'BRL',
    interval: 'month',
    features: {
      maxVehicles: -1, // unlimited
      maxImages: -1,
      featuredListings: true,
      analytics: true,
      prioritySupport: true,
      customDomain: true
    },
    limits: {
      monthlyViews: -1,
      storage: 'unlimited'
    }
  }
];

export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

export function getPlanFeatures(planId: string) {
  const plan = getPlanById(planId);
  return plan ? plan.features : null;
}

export function getPlanLimits(planId: string) {
  const plan = getPlanById(planId);
  return plan ? plan.limits : null;
}
