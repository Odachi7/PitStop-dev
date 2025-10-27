# 🚀 Guia de Implementação - FASE 4: Otimizações e Deploy

## 📋 Visão Geral

A Fase 4 foca em otimizações de performance, SEO, marketing e preparação para produção:
1. **Performance** - Otimização de imagens, cache, lazy loading
2. **SEO & Marketing** - Meta tags, sitemap, analytics
3. **Deploy & Infraestrutura** - Docker, CI/CD, monitoramento
4. **Mobile App** - PWA e React Native

---

## ⚡ **ETAPA 1: Otimizações de Performance**

### **1.1 Otimização de Imagens**

```typescript
// src/utils/imageOptimization.ts
export class ImageOptimizer {
  private static readonly MAX_WIDTH = 1200;
  private static readonly MAX_HEIGHT = 800;
  private static readonly QUALITY = 0.8;

  static async optimizeImage(file: File): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calcular dimensões mantendo proporção
        const { width, height } = this.calculateDimensions(
          img.width,
          img.height,
          this.MAX_WIDTH,
          this.MAX_HEIGHT
        );

        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(optimizedFile);
            }
          },
          'image/jpeg',
          this.QUALITY
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ) {
    let { width, height } = { width: originalWidth, height: originalHeight };

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  static generateImageUrl(imagePath: string, width?: number, height?: number): string {
    const baseUrl = process.env.REACT_APP_IMAGE_CDN || '';
    
    if (!baseUrl) return imagePath;

    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', '80');
    params.append('f', 'auto');

    return `${baseUrl}/${imagePath}?${params.toString()}`;
  }
}
```

### **1.2 Lazy Loading de Componentes**

```typescript
// src/components/LazyWrapper.tsx
import { Suspense, lazy, ComponentType } from "react";

interface LazyWrapperProps {
  fallback?: React.ReactNode;
}

const defaultFallback = (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
  </div>
);

export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = defaultFallback
) {
  const LazyComponent = lazy(importFunc);

  return function LazyWrapper(props: React.ComponentProps<T> & LazyWrapperProps) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Uso nos componentes
export const LazyVehicleDetail = createLazyComponent(
  () => import("../pages/car"),
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
      <p className="text-gray-600">Carregando detalhes do veículo...</p>
    </div>
  </div>
);

export const LazyDashboard = createLazyComponent(
  () => import("../pages/dashboard")
);

export const LazyMessages = createLazyComponent(
  () => import("../pages/messages")
);
```

### **1.3 Cache e Estado Global**

```typescript
// src/hooks/useCache.ts
import { useState, useEffect, useCallback } from "react";

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

const cacheManager = new CacheManager();

export function useCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Verificar cache primeiro
    const cachedData = cacheManager.get<T>(key);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      cacheManager.set(key, result, ttl);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [key, fetchFn, ttl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invalidate = useCallback(() => {
    cacheManager.delete(key);
    fetchData();
  }, [key, fetchData]);

  return { data, loading, error, refetch: fetchData, invalidate };
}
```

### **1.4 Virtual Scrolling para Listas Grandes**

```typescript
// src/components/VirtualList.tsx
import { useState, useEffect, useRef, useMemo } from "react";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) =>
            renderItem(item, visibleRange.startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🔍 **ETAPA 2: SEO & Marketing**

### **2.1 Meta Tags Dinâmicas**

```typescript
// src/utils/seo.ts
interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export class SEO {
  static updateMetaTags(data: SEOData) {
    // Title
    document.title = `${data.title} | PitStop - Marketplace de Veículos`;

    // Meta tags básicas
    this.updateMetaTag('description', data.description);
    this.updateMetaTag('keywords', data.keywords || '');
    
    // Open Graph
    this.updateMetaTag('og:title', data.title, 'property');
    this.updateMetaTag('og:description', data.description, 'property');
    this.updateMetaTag('og:image', data.image || '', 'property');
    this.updateMetaTag('og:url', data.url || window.location.href, 'property');
    this.updateMetaTag('og:type', data.type || 'website', 'property');

    // Twitter Card
    this.updateMetaTag('twitter:card', 'summary_large_image', 'name');
    this.updateMetaTag('twitter:title', data.title, 'name');
    this.updateMetaTag('twitter:description', data.description, 'name');
    this.updateMetaTag('twitter:image', data.image || '', 'name');
  }

  private static updateMetaTag(name: string, content: string, attribute: string = 'name') {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  }

  static generateVehicleSEO(vehicle: any): SEOData {
    return {
      title: `${vehicle.title} - ${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
      description: `${vehicle.title} por ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(vehicle.price)}. ${vehicle.mileage} km, ${vehicle.transmission}, ${vehicle.fuel}. ${vehicle.location}`,
      keywords: `${vehicle.brand}, ${vehicle.model}, ${vehicle.year}, carro usado, venda, ${vehicle.location}`,
      image: vehicle.image,
      url: `${window.location.origin}/vehicle/${vehicle.id}`,
      type: 'product'
    };
  }

  static generateHomeSEO(): SEOData {
    return {
      title: 'PitStop - Marketplace de Veículos',
      description: 'Encontre o carro ou moto ideal no PitStop. Milhares de veículos usados e seminovos com as melhores ofertas do mercado.',
      keywords: 'carros usados, motos usadas, venda de veículos, marketplace, seminovos',
      type: 'website'
    };
  }
}
```

### **2.2 Sitemap Dinâmico**

```typescript
// src/utils/sitemap.ts
export class SitemapGenerator {
  private static readonly BASE_URL = process.env.REACT_APP_BASE_URL || 'https://pitstop.com.br';

  static async generateSitemap(): Promise<string> {
    const urls = await this.getAllUrls();
    
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(url => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${url.loc}</loc>\n`;
      sitemap += `    <lastmod>${url.lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${url.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';
    return sitemap;
  }

  private static async getAllUrls() {
    const urls = [
      // Páginas estáticas
      { loc: `${this.BASE_URL}/`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '1.0' },
      { loc: `${this.BASE_URL}/catalogo`, lastmod: new Date().toISOString(), changefreq: 'daily', priority: '0.9' },
      { loc: `${this.BASE_URL}/vender-carro`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.8' },
      { loc: `${this.BASE_URL}/vender-moto`, lastmod: new Date().toISOString(), changefreq: 'weekly', priority: '0.8' },
    ];

    // Buscar veículos ativos
    try {
      const response = await fetch('/api/vehicles/sitemap');
      const data = await response.json();
      
      if (data.success) {
        data.data.forEach((vehicle: any) => {
          urls.push({
            loc: `${this.BASE_URL}/vehicle/${vehicle.id}`,
            lastmod: new Date(vehicle.updated_at).toISOString(),
            changefreq: 'weekly',
            priority: '0.7'
          });
        });
      }
    } catch (error) {
      console.error('Erro ao buscar veículos para sitemap:', error);
    }

    return urls;
  }
}
```

### **2.3 Analytics e Tracking**

```typescript
// src/utils/analytics.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export class Analytics {
  private static readonly GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

  static init() {
    if (!this.GA_MEASUREMENT_ID) return;

    // Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.GA_MEASUREMENT_ID);
  }

  static trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  }

  static trackPageView(pagePath: string, pageTitle: string) {
    if (window.gtag) {
      window.gtag('config', this.GA_MEASUREMENT_ID, {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  }

  static trackVehicleView(vehicleId: string, vehicleTitle: string, price: number) {
    this.trackEvent('view_item', {
      item_id: vehicleId,
      item_name: vehicleTitle,
      value: price,
      currency: 'BRL'
    });
  }

  static trackVehicleSearch(searchTerm: string, resultsCount: number) {
    this.trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount
    });
  }

  static trackSubscription(planId: string, value: number) {
    this.trackEvent('purchase', {
      transaction_id: Date.now().toString(),
      value: value,
      currency: 'BRL',
      items: [{
        item_id: planId,
        item_name: `Plano ${planId}`,
        category: 'subscription',
        quantity: 1,
        price: value
      }]
    });
  }
}
```

---

## 🐳 **ETAPA 3: Deploy & Infraestrutura**

### **3.1 Docker Configuration**

```dockerfile
# Dockerfile (Frontend)
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```dockerfile
# Dockerfile (Backend)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3333

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./Front
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://backend:3333

  backend:
    build: ./back
    ports:
      - "3333:3333"
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=postgres
      - DB_PASSWORD=password
      - DB_NAME=pitstop_main
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-jwt-secret

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=pitstop_main
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  redis_data:
```

### **3.2 CI/CD Pipeline (GitHub Actions)**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: |
            Front/package-lock.json
            back/package-lock.json

      - name: Install Frontend Dependencies
        run: cd Front && npm ci

      - name: Install Backend Dependencies
        run: cd back && npm ci

      - name: Run Frontend Tests
        run: cd Front && npm test -- --coverage --watchAll=false

      - name: Run Backend Tests
        run: cd back && npm test

      - name: Build Frontend
        run: cd Front && npm run build

      - name: Build Backend
        run: cd back && npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/pitstop
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            docker system prune -f
```

### **3.3 Monitoramento e Logs**

```typescript
// src/utils/monitoring.ts
export class Monitoring {
  private static readonly SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;

  static init() {
    if (this.SENTRY_DSN) {
      // Inicializar Sentry
      import('@sentry/react').then(({ init, captureException }) => {
        init({
          dsn: this.SENTRY_DSN,
          environment: process.env.NODE_ENV,
          tracesSampleRate: 1.0,
        });

        // Capturar erros não tratados
        window.addEventListener('error', (event) => {
          captureException(event.error);
        });

        // Capturar promises rejeitadas
        window.addEventListener('unhandledrejection', (event) => {
          captureException(event.reason);
        });
      });
    }
  }

  static trackPerformance(name: string, startTime: number) {
    const duration = performance.now() - startTime;
    
    // Enviar métrica para analytics
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(duration)
      });
    }

    // Log para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} took ${duration.toFixed(2)}ms`);
    }
  }

  static trackError(error: Error, context?: Record<string, any>) {
    if (this.SENTRY_DSN) {
      import('@sentry/react').then(({ captureException }) => {
        captureException(error, { extra: context });
      });
    }

    console.error('Error tracked:', error, context);
  }
}
```

---

## 📱 **ETAPA 4: Progressive Web App (PWA)**

### **4.1 Service Worker**

```typescript
// public/sw.js
const CACHE_NAME = 'pitstop-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retornar do cache se disponível
        if (response) {
          return response;
        }

        // Buscar da rede
        return fetch(event.request).then((response) => {
          // Verificar se é uma resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clonar a resposta
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
```

### **4.2 Web App Manifest**

```json
// public/manifest.json
{
  "name": "PitStop - Marketplace de Veículos",
  "short_name": "PitStop",
  "description": "Encontre o carro ou moto ideal no PitStop",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### **4.3 PWA Install Prompt**

```typescript
// src/components/PWAInstallPrompt.tsx
import { useState, useEffect } from "react";
import { Button } from "./button";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA instalado com sucesso');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Não mostrar novamente por 30 dias
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Instalar PitStop</h3>
            <p className="text-sm text-gray-600">
              Instale nosso app para uma experiência mais rápida
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" onClick={handleInstall}>
            Instalar
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDismiss}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 **Resumo da Implementação**

### **Comandos para Executar**

```bash
# Instalar dependências adicionais
cd Front
npm install @sentry/react @sentry/tracing
npm install workbox-webpack-plugin

cd ../back
npm install @sentry/node
npm install compression helmet morgan

# Build para produção
cd Front
npm run build

cd ../back
npm run build

# Deploy com Docker
docker-compose up -d --build
```

### **Variáveis de Ambiente Finais**

```env
# Frontend (.env.production)
REACT_APP_API_URL=https://api.pitstop.com.br
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
REACT_APP_SENTRY_DSN=https://your-sentry-dsn
REACT_APP_IMAGE_CDN=https://cdn.pitstop.com.br

# Backend (.env.production)
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_NAME=pitstop_main
REDIS_URL=redis://redis:6379
SENTRY_DSN=https://your-sentry-dsn
```

Esta implementação da Fase 4 transforma o projeto em uma aplicação de produção robusta, otimizada e escalável, pronta para competir no mercado de SaaS de marketplace de veículos.
