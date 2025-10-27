# 🚀 Guia de Implementação - FASE 3: Funcionalidades Avançadas

## 📋 Visão Geral

A Fase 3 implementa funcionalidades que diferenciam o SaaS da concorrência:
1. **Sistema de Comunicação** - Chat e mensagens
2. **Analytics & Relatórios** - Dashboard administrativo
3. **Funcionalidades Premium** - Favoritos, comparação, avaliações

---

## 💬 **ETAPA 1: Sistema de Comunicação**

### **1.1 Estrutura do Banco para Chat**

```sql
-- Tabela de conversas
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL, -- Usuário interessado
    seller_id UUID NOT NULL, -- Dono do veículo
    status VARCHAR(20) DEFAULT 'active', -- active, closed, blocked
    last_message_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de mensagens
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, file
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL, -- message, favorite, view, etc.
    title VARCHAR(255) NOT NULL,
    content TEXT,
    data JSONB, -- Dados adicionais
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_conversations_vehicle_id ON conversations(vehicle_id);
CREATE INDEX idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX idx_conversations_seller_id ON conversations(seller_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

### **1.2 Componente de Chat**

```typescript
// src/components/chat/ChatWidget.tsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/authContext";
import { Button } from "../button";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Badge } from "../badge";
import { 
  MessageCircle, 
  Send, 
  X, 
  Phone, 
  Mail,
  MoreVertical,
  Image as ImageIcon
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  vehicleId: string;
  buyerId: string;
  sellerId: string;
  status: string;
  lastMessageAt: string;
  vehicle: {
    title: string;
    price: number;
    image: string;
  };
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface ChatWidgetProps {
  vehicleId: string;
  sellerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatWidget({ vehicleId, sellerId, isOpen, onClose }: ChatWidgetProps) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadConversation();
    }
  }, [isOpen, vehicleId, sellerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversation = async () => {
    try {
      const response = await fetch(`/api/chat/conversation/${vehicleId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setConversation(data.data.conversation);
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    setLoading(true);
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          conversationId: conversation.id,
          content: newMessage.trim(),
          messageType: 'text'
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-blue-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {conversation?.otherUser.firstName[0]}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {conversation?.otherUser.firstName} {conversation?.otherUser.lastName}
            </h3>
            <p className="text-sm text-gray-600">
              {conversation?.vehicle.title}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost">
            <Phone className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Mail className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.senderId === user?.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
```

### **1.3 Página de Mensagens**

```typescript
// src/pages/messages/index.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/card";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { 
  MessageCircle, 
  Search, 
  Filter,
  MoreVertical,
  Phone,
  Mail
} from "lucide-react";

interface Conversation {
  id: string;
  vehicleId: string;
  buyerId: string;
  sellerId: string;
  status: string;
  lastMessageAt: string;
  unreadCount: number;
  lastMessage: {
    content: string;
    senderId: string;
    createdAt: string;
  };
  vehicle: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "closed">("all");

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${conv.otherUser.firstName} ${conv.otherUser.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || conv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('pt-BR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mensagens
          </h1>
          <p className="text-gray-600">
            Gerencie suas conversas com compradores e vendedores
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar conversas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >
                  Todas
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  onClick={() => setFilterStatus("active")}
                >
                  Ativas
                </Button>
                <Button
                  variant={filterStatus === "closed" ? "default" : "outline"}
                  onClick={() => setFilterStatus("closed")}
                >
                  Fechadas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversations List */}
        <div className="space-y-4">
          {filteredConversations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhuma conversa encontrada
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? "Tente ajustar os filtros de busca" : "Você ainda não tem conversas"}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredConversations.map((conversation) => (
              <Card key={conversation.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">
                        {conversation.otherUser.firstName[0]}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {conversation.otherUser.firstName} {conversation.otherUser.lastName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {formatTime(conversation.lastMessageAt)}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-blue-500 text-white">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        {conversation.vehicle.title}
                      </p>
                      
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 **ETAPA 2: Analytics & Relatórios**

### **2.1 Dashboard Administrativo**

```typescript
// src/pages/admin/dashboard/index.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/card";
import { Button } from "../../../components/button";
import { Badge } from "../../../components/badge";
import { 
  Users, 
  Car, 
  TrendingUp, 
  DollarSign,
  Eye,
  MessageCircle,
  Calendar,
  Download
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalVehicles: number;
  totalRevenue: number;
  totalViews: number;
  totalMessages: number;
  newUsersThisMonth: number;
  newVehiclesThisMonth: number;
  revenueThisMonth: number;
}

interface TopVehicle {
  id: string;
  title: string;
  views: number;
  price: number;
  owner: string;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'vehicle_created' | 'subscription_created' | 'payment_received';
  description: string;
  timestamp: string;
  data: any;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalVehicles: 0,
    totalRevenue: 0,
    totalViews: 0,
    totalMessages: 0,
    newUsersThisMonth: 0,
    newVehiclesThisMonth: 0,
    revenueThisMonth: 0
  });
  const [topVehicles, setTopVehicles] = useState<TopVehicle[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      const response = await fetch(`/api/admin/dashboard?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setStats(data.data.stats);
        setTopVehicles(data.data.topVehicles);
        setRecentActivity(data.data.recentActivity);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600 mt-2">
              Visão geral da plataforma e métricas de performance
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
            </select>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
                  <p className="text-sm text-green-600">
                    +{formatNumber(stats.newUsersThisMonth)} este mês
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Veículos</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalVehicles)}</p>
                  <p className="text-sm text-green-600">
                    +{formatNumber(stats.newVehiclesThisMonth)} este mês
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-sm text-green-600">
                    +{formatCurrency(stats.revenueThisMonth)} este mês
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Visualizações</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalViews)}</p>
                  <p className="text-sm text-gray-500">
                    {formatNumber(stats.totalMessages)} mensagens
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Vehicles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Veículos Mais Visualizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topVehicles.map((vehicle, index) => (
                  <div key={vehicle.id} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {vehicle.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {vehicle.owner} • {formatCurrency(vehicle.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatNumber(vehicle.views)}
                      </p>
                      <p className="text-xs text-gray-500">visualizações</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Crescimento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                {/* Aqui você pode integrar uma biblioteca de gráficos como Chart.js ou Recharts */}
                <p>Gráficos de crescimento serão implementados aqui</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

---

## ⭐ **ETAPA 3: Funcionalidades Premium**

### **3.1 Sistema de Favoritos**

```typescript
// src/components/favorites/FavoriteButton.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { Button } from "../button";
import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  vehicleId: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function FavoriteButton({ vehicleId, size = "md", showText = false }: FavoriteButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      checkFavoriteStatus();
    }
  }, [vehicleId, isAuthenticated]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites/check/${vehicleId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setIsFavorite(data.data.isFavorite);
      }
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      // Redirecionar para login
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ vehicleId })
      });

      const data = await response.json();
      if (data.success) {
        setIsFavorite(data.data.isFavorite);
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleFavorite}
      disabled={loading}
      className={`${sizeClasses[size]} ${
        isFavorite ? "bg-red-50 border-red-200 text-red-600" : "bg-white"
      }`}
    >
      <Heart 
        className={`${iconSizes[size]} ${isFavorite ? "fill-current" : ""}`} 
      />
      {showText && (
        <span className="ml-2">
          {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        </span>
      )}
    </Button>
  );
}
```

### **3.2 Comparador de Veículos**

```typescript
// src/components/vehicle/VehicleComparator.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Button } from "../button";
import { Badge } from "../badge";
import { X, Plus, Trash2 } from "lucide-react";

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
  color: string;
  doors: number;
  engine: string;
  location: string;
}

interface VehicleComparatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VehicleComparator({ isOpen, onClose }: VehicleComparatorProps) {
  const [comparisonVehicles, setComparisonVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComparisonVehicles();
  }, []);

  const loadComparisonVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles/comparison', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setComparisonVehicles(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar veículos para comparação:', error);
    }
  };

  const removeVehicle = async (vehicleId: string) => {
    try {
      const response = await fetch('/api/vehicles/comparison/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ vehicleId })
      });

      const data = await response.json();
      if (data.success) {
        setComparisonVehicles(prev => prev.filter(v => v.id !== vehicleId));
      }
    } catch (error) {
      console.error('Erro ao remover veículo:', error);
    }
  };

  const clearAll = async () => {
    try {
      const response = await fetch('/api/vehicles/comparison/clear', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setComparisonVehicles([]);
      }
    } catch (error) {
      console.error('Erro ao limpar comparação:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Comparar Veículos ({comparisonVehicles.length}/3)
          </h2>
          <div className="flex items-center space-x-4">
            {comparisonVehicles.length > 0 && (
              <Button variant="outline" onClick={clearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Tudo
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {comparisonVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum veículo para comparar
              </h3>
              <p className="text-gray-600 mb-4">
                Adicione veículos à comparação para ver as diferenças lado a lado
              </p>
              <Button onClick={onClose}>
                Fechar
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Vehicle Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparisonVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => removeVehicle(vehicle.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="relative">
                      <img
                        src={vehicle.image}
                        alt={vehicle.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                        {vehicle.title}
                      </h3>
                      <p className="text-2xl font-bold text-blue-900 mb-4">
                        {formatCurrency(vehicle.price)}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Marca:</span>
                          <span className="font-medium">{vehicle.brand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ano:</span>
                          <span className="font-medium">{vehicle.year}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quilometragem:</span>
                          <span className="font-medium">{formatNumber(vehicle.mileage)} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transmissão:</span>
                          <span className="font-medium">{vehicle.transmission}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Combustível:</span>
                          <span className="font-medium">{vehicle.fuel}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cor:</span>
                          <span className="font-medium">{vehicle.color}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Portas:</span>
                          <span className="font-medium">{vehicle.doors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Localização:</span>
                          <span className="font-medium">{vehicle.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Comparison Table */}
              {comparisonVehicles.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Comparação Detalhada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 font-semibold">Especificação</th>
                            {comparisonVehicles.map((vehicle) => (
                              <th key={vehicle.id} className="text-left py-3 px-4 font-semibold">
                                {vehicle.title}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Preço</td>
                            {comparisonVehicles.map((vehicle) => (
                              <td key={vehicle.id} className="py-3 px-4">
                                {formatCurrency(vehicle.price)}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Marca</td>
                            {comparisonVehicles.map((vehicle) => (
                              <td key={vehicle.id} className="py-3 px-4">
                                {vehicle.brand}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Ano</td>
                            {comparisonVehicles.map((vehicle) => (
                              <td key={vehicle.id} className="py-3 px-4">
                                {vehicle.year}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Quilometragem</td>
                            {comparisonVehicles.map((vehicle) => (
                              <td key={vehicle.id} className="py-3 px-4">
                                {formatNumber(vehicle.mileage)} km
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Transmissão</td>
                            {comparisonVehicles.map((vehicle) => (
                              <td key={vehicle.id} className="py-3 px-4">
                                {vehicle.transmission}
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b">
                            <td className="py-3 px-4 font-medium">Combustível</td>
                            {comparisonVehicles.map((vehicle) => (
                              <td key={vehicle.id} className="py-3 px-4">
                                {vehicle.fuel}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

Esta implementação da Fase 3 adiciona funcionalidades avançadas que diferenciam o SaaS da concorrência, incluindo sistema de comunicação em tempo real, analytics administrativos e funcionalidades premium como favoritos e comparação de veículos.
