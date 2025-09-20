# 🎨 Guia de Melhorias Frontend - PitStop SaaS

## 📋 Visão Geral

Este documento detalha as melhorias essenciais para o frontend do PitStop, focando em performance, UX/UI, acessibilidade e escalabilidade. Como senior frontend developer, estas implementações são críticas para um SaaS competitivo.

---

## 🏗️ **ARQUITETURA FRONTEND MODERNA**

### **1.1 Estrutura de Pastas Recomendada**

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base (Button, Input, etc.)
│   ├── forms/           # Formulários específicos
│   ├── layout/          # Layout components
│   ├── charts/          # Gráficos e visualizações
│   └── common/          # Componentes comuns
├── pages/               # Páginas da aplicação
│   ├── auth/           # Autenticação
│   ├── dashboard/      # Dashboard do usuário
│   ├── vehicles/       # Gestão de veículos
│   ├── admin/          # Painel administrativo
│   └── public/         # Páginas públicas
├── hooks/              # Custom hooks
├── services/           # Serviços e APIs
├── store/              # Estado global (Zustand/Redux)
├── utils/              # Utilitários
├── types/              # Tipos TypeScript
├── constants/          # Constantes
├── assets/             # Imagens, ícones, etc.
└── styles/             # Estilos globais
```

### **1.2 Configuração de Build Otimizada**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          charts: ['recharts', 'chart.js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 🎯 **MELHORIAS CRÍTICAS DE UX/UI**

### **2.1 Sistema de Design System**

```typescript
// src/styles/design-system.ts
export const designSystem = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      900: '#0f172a',
    },
    success: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a',
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
};
```

### **2.2 Componentes Base Melhorados**

```typescript
// src/components/ui/Button/Button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

### **2.3 Sistema de Formulários Avançado**

```typescript
// src/components/forms/FormBuilder.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Checkbox } from '@/components/ui/Checkbox';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: z.ZodTypeAny;
}

interface FormBuilderProps {
  fields: FormField[];
  onSubmit: (data: any) => void | Promise<void>;
  submitText?: string;
  loading?: boolean;
  className?: string;
}

export function FormBuilder({ fields, onSubmit, submitText = 'Enviar', loading, className }: FormBuilderProps) {
  const schema = z.object(
    fields.reduce((acc, field) => {
      if (field.validation) {
        acc[field.name] = field.validation;
      } else if (field.required) {
        acc[field.name] = z.string().min(1, `${field.label} é obrigatório`);
      } else {
        acc[field.name] = z.string().optional();
      }
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const renderField = (field: FormField) => {
    const error = errors[field.name];

    switch (field.type) {
      case 'select':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Select
                {...controllerField}
                label={field.label}
                placeholder={field.placeholder}
                error={error?.message}
                options={field.options || []}
              />
            )}
          />
        );

      case 'textarea':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Textarea
                {...controllerField}
                label={field.label}
                placeholder={field.placeholder}
                error={error?.message}
              />
            )}
          />
        );

      case 'checkbox':
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Checkbox
                {...controllerField}
                label={field.label}
                error={error?.message}
              />
            )}
          />
        );

      default:
        return (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <Input
                {...controllerField}
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
                error={error?.message}
                required={field.required}
              />
            )}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="space-y-6">
        {fields.map(renderField)}
      </div>
      
      <div className="mt-8">
        <Button type="submit" loading={loading} className="w-full">
          {submitText}
        </Button>
      </div>
    </form>
  );
}
```

---

## ⚡ **OTIMIZAÇÕES DE PERFORMANCE**

### **3.1 Lazy Loading e Code Splitting**

```typescript
// src/utils/lazyLoading.ts
import { lazy, ComponentType } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface LazyComponentOptions {
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error }>;
}

export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
) {
  const LazyComponent = lazy(importFunc);

  const DefaultFallback = () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  const DefaultErrorFallback = ({ error }: { error: Error }) => (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Erro ao carregar componente
        </h3>
        <p className="text-sm text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Recarregar página
        </button>
      </div>
    </div>
  );

  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <ErrorBoundary
        FallbackComponent={options.errorFallback || DefaultErrorFallback}
      >
        <React.Suspense fallback={<DefaultFallback />}>
          <LazyComponent {...props} />
        </React.Suspense>
      </ErrorBoundary>
    );
  };
}

// Uso nos componentes
export const LazyVehicleDetail = createLazyComponent(
  () => import('@/pages/vehicles/VehicleDetail')
);

export const LazyDashboard = createLazyComponent(
  () => import('@/pages/dashboard/Dashboard')
);

export const LazyAdminPanel = createLazyComponent(
  () => import('@/pages/admin/AdminPanel')
);
```

### **3.2 Virtual Scrolling para Listas Grandes**

```typescript
// src/components/VirtualList/VirtualList.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscanCount?: number;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  className,
  overscanCount = 5,
}: VirtualListProps<T>) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      {renderItem(items[index], index)}
    </div>
  );

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={items.length}
        itemSize={itemHeight}
        overscanCount={overscanCount}
      >
        {Row}
      </List>
    </div>
  );
}

// Componente específico para veículos
export function VirtualVehicleList({ vehicles, height = 600 }: { vehicles: any[]; height?: number }) {
  return (
    <VirtualList
      items={vehicles}
      height={height}
      itemHeight={200}
      renderItem={(vehicle, index) => (
        <div key={vehicle.id} className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={vehicle.image}
              alt={vehicle.title}
              className="w-24 h-16 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{vehicle.title}</h3>
              <p className="text-blue-600 font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(vehicle.price)}
              </p>
              <p className="text-sm text-gray-600">
                {vehicle.mileage} km • {vehicle.transmission} • {vehicle.fuel}
              </p>
            </div>
          </div>
        </div>
      )}
    />
  );
}
```

### **3.3 Cache e Estado Global Otimizado**

```typescript
// src/store/useVehicleStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Vehicle {
  id: string;
  title: string;
  price: number;
  image: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  transmission: string;
  fuel: string;
  location: string;
}

interface VehicleFilters {
  search: string;
  category: string;
  brand: string;
  priceRange: [number, number];
  location: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  favorites: string[];
  comparison: string[];
  filters: VehicleFilters;
  loading: boolean;
  error: string | null;
  lastFetch: number;
}

interface VehicleActions {
  setVehicles: (vehicles: Vehicle[]) => void;
  addToFavorites: (vehicleId: string) => void;
  removeFromFavorites: (vehicleId: string) => void;
  addToComparison: (vehicleId: string) => void;
  removeFromComparison: (vehicleId: string) => void;
  setFilters: (filters: Partial<VehicleFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchVehicles: () => Promise<void>;
}

const initialState: VehicleState = {
  vehicles: [],
  favorites: [],
  comparison: [],
  filters: {
    search: '',
    category: '',
    brand: '',
    priceRange: [0, 1000000],
    location: '',
  },
  loading: false,
  error: null,
  lastFetch: 0,
};

export const useVehicleStore = create<VehicleState & VehicleActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        setVehicles: (vehicles) =>
          set((state) => {
            state.vehicles = vehicles;
            state.lastFetch = Date.now();
          }),

        addToFavorites: (vehicleId) =>
          set((state) => {
            if (!state.favorites.includes(vehicleId)) {
              state.favorites.push(vehicleId);
            }
          }),

        removeFromFavorites: (vehicleId) =>
          set((state) => {
            state.favorites = state.favorites.filter(id => id !== vehicleId);
          }),

        addToComparison: (vehicleId) =>
          set((state) => {
            if (!state.comparison.includes(vehicleId) && state.comparison.length < 3) {
              state.comparison.push(vehicleId);
            }
          }),

        removeFromComparison: (vehicleId) =>
          set((state) => {
            state.comparison = state.comparison.filter(id => id !== vehicleId);
          }),

        setFilters: (newFilters) =>
          set((state) => {
            state.filters = { ...state.filters, ...newFilters };
          }),

        clearFilters: () =>
          set((state) => {
            state.filters = initialState.filters;
          }),

        setLoading: (loading) =>
          set((state) => {
            state.loading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        fetchVehicles: async () => {
          const { lastFetch } = get();
          const now = Date.now();
          
          // Cache por 5 minutos
          if (now - lastFetch < 5 * 60 * 1000) {
            return;
          }

          set((state) => {
            state.loading = true;
            state.error = null;
          });

          try {
            const response = await fetch('/api/vehicles');
            const data = await response.json();
            
            if (data.success) {
              set((state) => {
                state.vehicles = data.data;
                state.lastFetch = now;
              });
            } else {
              throw new Error(data.error);
            }
          } catch (error: any) {
            set((state) => {
              state.error = error.message;
            });
          } finally {
            set((state) => {
              state.loading = false;
            });
          }
        },
      })),
      {
        name: 'vehicle-store',
        partialize: (state) => ({
          favorites: state.favorites,
          comparison: state.comparison,
          filters: state.filters,
        }),
      }
    ),
    { name: 'vehicle-store' }
  )
);
```

---

## 🎨 **MELHORIAS DE UX/UI AVANÇADAS**

### **4.1 Sistema de Notificações**

```typescript
// src/components/notifications/NotificationProvider.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    const duration = notification.duration || 5000;
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
              className={`max-w-sm w-full ${getBgColor(notification.type)} border rounded-lg shadow-lg p-4`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getIcon(notification.type)}
                </div>
                <div className="ml-3 w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  {notification.message && (
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                  )}
                  {notification.action && (
                    <div className="mt-2">
                      <button
                        onClick={notification.action.onClick}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        {notification.action.label}
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => removeNotification(notification.id)}
                    className="inline-flex text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
```

### **4.2 Sistema de Loading States**

```typescript
// src/components/loading/LoadingStates.tsx
import React from 'react';
import { motion } from 'framer-motion';

export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <SkeletonLoader className="h-48 w-full mb-4" />
      <SkeletonLoader className="h-4 w-3/4 mb-2" />
      <SkeletonLoader className="h-4 w-1/2 mb-4" />
      <SkeletonLoader className="h-8 w-full" />
    </div>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <SkeletonLoader className="h-48 w-full" />
      <div className="p-4">
        <SkeletonLoader className="h-5 w-3/4 mb-2" />
        <SkeletonLoader className="h-6 w-1/2 mb-2" />
        <SkeletonLoader className="h-4 w-full mb-2" />
        <SkeletonLoader className="h-4 w-2/3 mb-4" />
        <SkeletonLoader className="h-10 w-full" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <SkeletonLoader className="h-4 w-1/4" />
          <SkeletonLoader className="h-4 w-1/4" />
          <SkeletonLoader className="h-4 w-1/4" />
          <SkeletonLoader className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 border-gray-300 border-t-blue-600 rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    </div>
  );
}
```

### **4.3 Sistema de Modais Avançado**

```typescript
// src/components/modals/ModalProvider.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Modal {
  id: string;
  component: React.ComponentType<any>;
  props?: any;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
}

interface ModalContextType {
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<Modal[]>([]);

  const openModal = useCallback((modal: Omit<Modal, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newModal = { ...modal, id, closable: modal.closable !== false };
    
    setModals(prev => [...prev, newModal]);
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals(prev => prev.filter(m => m.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAllModals }}>
      {children}
      
      {modals.length > 0 && createPortal(
        <div className="fixed inset-0 z-50">
          <AnimatePresence>
            {modals.map((modal, index) => (
              <motion.div
                key={modal.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
                style={{ zIndex: 50 + index }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[modal.size || 'md']} max-h-[90vh] overflow-hidden`}
                >
                  {modal.closable && (
                    <div className="flex justify-end p-4 border-b">
                      <button
                        onClick={() => closeModal(modal.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  )}
                  
                  <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    <modal.component
                      {...modal.props}
                      onClose={() => closeModal(modal.id)}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}
```

---

## 📱 **RESPONSIVIDADE E MOBILE-FIRST**

### **5.1 Hook para Responsividade**

```typescript
// src/hooks/useResponsive.ts
import { useState, useEffect } from 'react';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export function useResponsive() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('md');
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });

      // Determine current breakpoint
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint('sm');
      } else {
        setCurrentBreakpoint('xs');
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const isMobile = currentBreakpoint === 'xs' || currentBreakpoint === 'sm';
  const isTablet = currentBreakpoint === 'md';
  const isDesktop = currentBreakpoint === 'lg' || currentBreakpoint === 'xl' || currentBreakpoint === '2xl';

  return {
    currentBreakpoint,
    windowSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints,
  };
}
```

### **5.2 Componente de Grid Responsivo**

```typescript
// src/components/layout/ResponsiveGrid.tsx
import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 },
  gap = 4,
  className = ''
}: ResponsiveGridProps) {
  const { currentBreakpoint } = useResponsive();
  
  const currentCols = cols[currentBreakpoint] || cols.md || 3;
  
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${currentCols}, 1fr)`,
    gap: `${gap * 0.25}rem`, // Convert to rem
  };

  return (
    <div style={gridStyle} className={className}>
      {children}
    </div>
  );
}
```

---

## 🔧 **FERRAMENTAS DE DESENVOLVIMENTO**

### **6.1 Storybook para Componentes**

```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

```typescript
// src/components/ui/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading...',
    loading: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex space-x-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
```

### **6.2 Testes Automatizados**

```typescript
// src/components/ui/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');
  });
});
```

---

## 🚀 **COMANDOS DE IMPLEMENTAÇÃO**

### **Instalação de Dependências**

```bash
# Dependências principais
npm install @hookform/resolvers react-hook-form zod
npm install zustand immer
npm install react-window react-window-infinite-loader
npm install framer-motion
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install class-variance-authority clsx tailwind-merge

# Desenvolvimento
npm install -D @storybook/react-vite @storybook/addon-essentials
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D vitest @vitejs/plugin-react

# Performance
npm install workbox-webpack-plugin
npm install react-error-boundary
```

### **Scripts de Build**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  }
}
```

Esta documentação fornece um roadmap completo para transformar o frontend do PitStop em uma aplicação moderna, performática e escalável, seguindo as melhores práticas de desenvolvimento frontend.
