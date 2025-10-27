// Configuração da API
const API_BASE_URL = 'http://localhost:3333/api';

// Interface para resposta padrão da API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Interface para veículo da API
export interface ApiVehicle {
  id: string;
  title: string;
  price: number;
  image1?: string;
  image2?: string;
  image3?: string;
  image4?: string;
  image5?: string;
  mileage: string;
  transmission: string;
  fuel: string;
  category: "car" | "motorcycle";
  brand: string;
  model?: string;
  year: number;
  location: string;
  color?: string;
  doors?: number;
  engine?: string;
  vin?: string;
  description?: string;
  seller?: {
    name: string;
    phone: string;
    email: string;
    avatar: string;
    memberSince: string;
    otherListings: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Interface para parâmetros de busca
export interface VehicleSearchParams {
  page?: number;
  limit?: number;
  category?: 'car' | 'motorcycle';
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  location?: string;
  search?: string;
}

// Classe para gerenciar chamadas da API
class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Tentar recuperar token do localStorage
    this.token = localStorage.getItem('auth_token');
  }

  // Definir token de autenticação
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Fazer requisição HTTP
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Adicionar token de autenticação se disponível
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Verificar se a resposta foi bem-sucedida
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // Buscar veículos
  async getVehicles(params: VehicleSearchParams = {}): Promise<ApiVehicle[]> {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const endpoint = `/vehicles-multi${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.request<{ vehicles: ApiVehicle[] }>(endpoint);
      
      if (response.success && response.data) {
        return response.data.vehicles || [];
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error;
    }
  }

  // Buscar veículo por ID
  async getVehicleById(id: string): Promise<ApiVehicle | null> {
    try {
      const response = await this.request<ApiVehicle>(`/vehicles-multi/${id}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      throw error;
    }
  }

  // Login
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    try {
      const response = await this.request<{ token: string; user: any }>('/auth-multi/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success && response.data) {
        this.setToken(response.data.token);
        return response.data;
      }

      throw new Error('Falha no login');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // Registro
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName: string;
    role?: string;
  }): Promise<{ token: string; user: any }> {
    try {
      const response = await this.request<{ token: string; user: any }>('/auth-multi/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success && response.data) {
        this.setToken(response.data.token);
        return response.data;
      }

      throw new Error('Falha no registro');
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  // Logout
  logout() {
    this.setToken(null);
  }
}

// Instância singleton do serviço
export const apiService = new ApiService(API_BASE_URL);

// Função utilitária para converter veículo da API para o formato do frontend
export function convertApiVehicleToFrontend(apiVehicle: any) {
  // A API retorna os dados dentro de 'props'
  const props = apiVehicle.props || apiVehicle;
  
  return {
    id: parseInt(apiVehicle._id || apiVehicle.id) || 0,
    title: props.title || 'Título não disponível',
    price: props.price || 0,
    image1: props.image1,
    image2: props.image2,
    image3: props.image3,
    image4: props.image4,
    image5: props.image5,
    image6: props.image6,
    image7: props.image7,
    image8: props.image8,
    mileage: String(props.mileage || 0),
    transmission: props.transmission || 'N/A',
    fuel: props.fuel || 'N/A',
    category: props.category === 'car' ? 'Carro' : 'Moto' as 'Carro' | 'Moto',
    brand: props.brand || 'N/A',
    model: props.model || 'N/A',
    year: props.year || new Date().getFullYear(),
    location: props.location || 'Localização não informada',
    color: props.color || 'N/A',
    doors: props.doors || 0,
    engine: props.engine || 'N/A',
    vin: props.vin || 'N/A',
    description: props.description || 'Descrição não disponível',
    seller: props.seller,
  };
}
