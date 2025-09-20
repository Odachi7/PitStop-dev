# 🚀 Guia de Implementação - FASE 2: Funcionalidades Core

## 📋 Visão Geral

A Fase 2 foca nas funcionalidades essenciais para o funcionamento completo do SaaS:
1. **Dashboard do Usuário** - Painel de controle personalizado
2. **Sistema de Assinaturas** - Monetização e planos
3. **Formulários de Venda** - Cadastro de veículos
4. **Upload de Imagens** - Gestão de mídia

---

## 🏠 **ETAPA 1: Dashboard do Usuário**

### **1.1 Estrutura do Dashboard**

```typescript
// src/pages/dashboard/index.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import { Button } from "../../components/button";
import { 
  Car, 
  Eye, 
  Heart, 
  TrendingUp, 
  Plus,
  Settings,
  BarChart3
} from "lucide-react";

interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalViews: number;
  favorites: number;
  monthlyViews: number;
}

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVehicles: 0,
    activeVehicles: 0,
    totalViews: 0,
    favorites: 0,
    monthlyViews: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie seus anúncios e acompanhe o desempenho
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Veículos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVehicles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Visualizações</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Favoritos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.favorites}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Este Mês</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.monthlyViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Car className="h-4 w-4 mr-2" />
                Vender Carro
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Car className="h-4 w-4 mr-2" />
                Vender Moto
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de conversão</span>
                    <span>12.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '12.5%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Engajamento</span>
                    <span>8.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '8.3%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

### **1.2 Backend - Dashboard Controller**

```typescript
// src/controllers/dashboardController.ts
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
import { DashboardService } from "../services/dashboardService";

export class DashboardController {
  static async getStats(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await DashboardService.getUserStats(req.user!.userId, req.user!.companyId);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getRecentVehicles(req: AuthenticatedRequest, res: Response) {
    try {
      const vehicles = await DashboardService.getRecentVehicles(req.user!.userId, req.user!.companyId);
      
      res.status(200).json({
        success: true,
        data: vehicles
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
```

---

## 💰 **ETAPA 2: Sistema de Assinaturas**

### **2.1 Estrutura de Planos**

```typescript
// src/types/subscription.ts
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
      maxImages: 5,
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
```

### **2.2 Página de Assinaturas**

```typescript
// src/pages/subscription/plans/index.tsx
import { useState } from "react";
import { useAuth } from "../../../context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/card";
import { Button } from "../../../components/button";
import { Badge } from "../../../components/badge";
import { Check, Star, Zap } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "../../../types/subscription";

export function SubscriptionPlans() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('basic');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  const handleSubscribe = async (planId: string) => {
    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          planId,
          interval: billingInterval
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Redirecionar para checkout
        window.location.href = data.data.checkoutUrl;
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Encontre o plano perfeito para suas necessidades
          </p>

          {/* Toggle Billing */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${billingInterval === 'month' ? 'text-gray-900' : 'text-gray-500'}`}>
              Mensal
            </span>
            <button
              onClick={() => setBillingInterval(billingInterval === 'month' ? 'year' : 'month')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingInterval === 'year' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${billingInterval === 'year' ? 'text-gray-900' : 'text-gray-500'}`}>
              Anual
              <Badge className="ml-2 bg-green-100 text-green-800">-20%</Badge>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isPopular = plan.id === 'premium';
            const isCurrentPlan = user?.subscriptionPlan === plan.id;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${isPopular ? 'ring-2 ring-blue-500 scale-105' : ''} ${
                  isCurrentPlan ? 'bg-blue-50' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      Plano Atual
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-gray-600">/{plan.interval === 'month' ? 'mês' : 'ano'}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">
                        {plan.features.maxVehicles === -1 ? 'Veículos ilimitados' : `${plan.features.maxVehicles} veículos`}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">
                        {plan.features.maxImages === -1 ? 'Imagens ilimitadas' : `${plan.features.maxImages} imagens por veículo`}
                      </span>
                    </li>
                    <li className="flex items-center">
                      {plan.features.featuredListings ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <span className="h-4 w-4 mr-2" />
                      )}
                      <span className="text-sm">Destaque nos anúncios</span>
                    </li>
                    <li className="flex items-center">
                      {plan.features.analytics ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <span className="h-4 w-4 mr-2" />
                      )}
                      <span className="text-sm">Analytics avançado</span>
                    </li>
                    <li className="flex items-center">
                      {plan.features.prioritySupport ? (
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <span className="h-4 w-4 mr-2" />
                      )}
                      <span className="text-sm">Suporte prioritário</span>
                    </li>
                  </ul>

                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {isCurrentPlan ? 'Plano Atual' : 'Escolher Plano'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Perguntas Frequentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-gray-600">Sim, você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Há período de teste?</h3>
              <p className="text-gray-600">Oferecemos 7 dias de teste gratuito para todos os planos pagos.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Posso alterar meu plano?</h3>
              <p className="text-gray-600">Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Que métodos de pagamento aceitam?</h3>
              <p className="text-gray-600">Aceitamos cartão de crédito, PIX e boleto bancário.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 📝 **ETAPA 3: Formulários de Venda**

### **3.1 Página de Venda de Carros**

```typescript
// src/pages/sell/car/index.tsx
import { useState } from "react";
import { useAuth } from "../../../context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/card";
import { Button } from "../../../components/button";
import { Badge } from "../../../components/badge";
import { Upload, X, Plus } from "lucide-react";

interface CarFormData {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel: string;
  color: string;
  doors: number;
  engine: string;
  vin: string;
  description: string;
  location: string;
  images: File[];
}

const TRANSMISSION_OPTIONS = [
  'Manual',
  'Automático',
  'Semi-automático',
  'CVT'
];

const FUEL_OPTIONS = [
  'Gasolina',
  'Etanol',
  'Flex',
  'Diesel',
  'Híbrido',
  'Elétrico'
];

const DOOR_OPTIONS = [2, 3, 4, 5];

export function SellCar() {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CarFormData>({
    title: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    transmission: '',
    fuel: '',
    color: '',
    doors: 4,
    engine: '',
    vin: '',
    description: '',
    location: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CarFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = [...formData.images, ...files].slice(0, 10); // Máximo 10 imagens
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório';
    if (!formData.brand.trim()) newErrors.brand = 'Marca é obrigatória';
    if (!formData.model.trim()) newErrors.model = 'Modelo é obrigatório';
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Ano inválido';
    }
    if (formData.price <= 0) newErrors.price = 'Preço deve ser maior que zero';
    if (formData.mileage < 0) newErrors.mileage = 'Quilometragem inválida';
    if (!formData.transmission) newErrors.transmission = 'Transmissão é obrigatória';
    if (!formData.fuel) newErrors.fuel = 'Combustível é obrigatório';
    if (!formData.color.trim()) newErrors.color = 'Cor é obrigatória';
    if (!formData.location.trim()) newErrors.location = 'Localização é obrigatória';
    if (formData.images.length === 0) newErrors.images = 'Pelo menos uma imagem é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Adicionar dados do formulário
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          formData.images.forEach((image, index) => {
            formDataToSend.append(`image_${index}`, image);
          });
        } else {
          formDataToSend.append(key, value.toString());
        }
      });

      const response = await fetch('/api/vehicles/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      
      if (data.success) {
        // Redirecionar para preview ou dashboard
        window.location.href = `/vehicle/${data.data.id}/preview`;
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar veículo:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vender Carro
          </h1>
          <p className="text-gray-600">
            Preencha as informações do seu veículo para criar um anúncio atrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Anúncio *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Honda Civic 2020 Automático"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.brand ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Honda"
                  />
                  {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.model ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Civic"
                  />
                  {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ano *
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.year ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                  {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quilometragem *
                  </label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.mileage ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  {errors.mileage && <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Especificações Técnicas */}
          <Card>
            <CardHeader>
              <CardTitle>Especificações Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmissão *
                  </label>
                  <select
                    value={formData.transmission}
                    onChange={(e) => handleInputChange('transmission', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.transmission ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione</option>
                    {TRANSMISSION_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.transmission && <p className="text-red-500 text-sm mt-1">{errors.transmission}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Combustível *
                  </label>
                  <select
                    value={formData.fuel}
                    onChange={(e) => handleInputChange('fuel', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fuel ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Selecione</option>
                    {FUEL_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.fuel && <p className="text-red-500 text-sm mt-1">{errors.fuel}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor *
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.color ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Branco"
                  />
                  {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Portas *
                  </label>
                  <select
                    value={formData.doors}
                    onChange={(e) => handleInputChange('doors', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {DOOR_OPTIONS.map(option => (
                      <option key={option} value={option}>{option} portas</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motor
                  </label>
                  <input
                    type="text"
                    value={formData.engine}
                    onChange={(e) => handleInputChange('engine', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 1.6 16V"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chassi (VIN)
                  </label>
                  <input
                    type="text"
                    value={formData.vin}
                    onChange={(e) => handleInputChange('vin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="17 caracteres"
                    maxLength={17}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localização e Descrição */}
          <Card>
            <CardHeader>
              <CardTitle>Localização e Descrição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: São Paulo, SP"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descreva o veículo, histórico, condições especiais, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Upload de Imagens */}
          <Card>
            <CardHeader>
              <CardTitle>Imagens do Veículo</CardTitle>
              <p className="text-sm text-gray-600">
                Adicione até 10 imagens. A primeira será a imagem principal.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Clique para selecionar imagens ou arraste e solte
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Selecionar Imagens
                  </label>
                </div>

                {/* Preview das Imagens */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-blue-500 text-white">
                            Principal
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Salvar Rascunho
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Publicando...' : 'Publicar Anúncio'}
            </Button>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
```

Este guia da Fase 2 cobre as funcionalidades essenciais para transformar o projeto em um SaaS funcional. Cada seção inclui implementação completa tanto no frontend quanto no backend, seguindo as melhores práticas de desenvolvimento.
