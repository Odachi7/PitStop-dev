import { useState, useEffect } from "react";
import type { ReactNode } from "react"
import { Usercontext } from "./userContext";
import type { OpcoesReal } from "./userContext";
import { apiService, convertApiVehicleToFrontend } from "../lib/api";
interface UserProviderProps {
  children: ReactNode;
}

// Tipo para veículos do frontend (convertido da API)
type FrontendVehicle = {
    id: number
    title: string
    price: number
    image1?: string,
    image2?: string,
    image3?: string,
    image4?: string,
    image5?: string,
    image6?: string,
    image7?: string,
    image8?: string,
    mileage: string
    transmission: string
    fuel: string
    category: "Carro" | "Moto"
    brand: string
    model?: string
    year: number
    location: string
    color?: string
    doors?: number
    engine?: string
    vin?: string
    description?: string
    seller?: {
        name: string
        phone: string
        email: string
        avatar: string
        memberSince: string
        otherListings: number
    }
};

function UserProvider({ children }: UserProviderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [veiculos, setVeiculos] = useState<FrontendVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);

  // UseEffect para buscar veículos
  useEffect(() => {
    let isCancelled = false;

    async function getVeiculos() {
      try {
        setLoading(true);
        setError(null);

        //const token = localStorage.getItem('auth_token');

        // Buscar veículos usando o serviço de API
        const apiVehicles = await apiService.getVehicles({
          page: 1,
          limit: 100, // Buscar mais veículos para ter dados suficientes
        });

        if (!isCancelled) {
          // Converter veículos da API para o formato do frontend
          const frontendVehicles = apiVehicles.map(convertApiVehicleToFrontend);
          setVeiculos(frontendVehicles);
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          let errorMessage = 'Erro desconhecido ao carregar veículos';
          
          if (err instanceof Error) {
            if (err.message.includes('Token de acesso necessário')) {
              errorMessage = 'Acesso negado - faça login para ver os veículos';
            } else if (err.message.includes('Failed to fetch')) {
              errorMessage = 'Erro de conexão - verifique se o servidor está rodando';
            } else {
              errorMessage = err.message;
            }
          }

          console.error('❌ Erro ao carregar veículos:', {
            message: errorMessage,
            error: err,
            timestamp: new Date().toISOString()
          });

          setError(errorMessage);
          setVeiculos([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    getVeiculos();

    return () => {
      isCancelled = true;
    };
  }, []); // Executar apenas uma vez ao montar o componente

  function suggestedVehicles(
      currentVehicleId: number, 
      options: {
        category?: string;
        priceRange?: number; // Porcentagem de variação do preço
        limit?: number;
      } = {}
    ): FrontendVehicle[] {
    const { category, priceRange = 0.3, limit = 3 } = options;
    
    const currentVehicle = veiculos.find(v => v.id === currentVehicleId);
    if (!currentVehicle) return [];

    return veiculos
    .filter(vehicle => {
      // Excluir o veículo atual
      if (vehicle.id === currentVehicleId) return false;
      
      // Filtrar por categoria (prioridade)
      if (category && vehicle.category !== category) return false;
      
      // Filtrar por faixa de preço similar (opcional)
      if (priceRange > 0) {
          const priceDiff = Math.abs(vehicle.price - currentVehicle.price) / currentVehicle.price;
          if (priceDiff > priceRange) return false;
      }
      
      return true;
      })
      .sort((a, b) => {
      // Ordenar por similaridade (mesmo brand = prioridade)
      if (a.brand === currentVehicle.brand && b.brand !== currentVehicle.brand) return -1;
      if (b.brand === currentVehicle.brand && a.brand !== currentVehicle.brand) return 1;
      
      // Depois por diferença de preço
      const diffA = Math.abs(a.price - currentVehicle.price);
      const diffB = Math.abs(b.price - currentVehicle.price);
      return diffA - diffB;
    })
    .slice(0, limit);
  }

  function getPaginatedData<T>(data: T[], page: number, itemsPerPage: number) {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedItems = data.slice(startIndex, endIndex);
      
      return {
          items: paginatedItems,
          currentPage: page,
          totalPages: Math.ceil(data.length / itemsPerPage),
          totalItems: data.length,
          itemsPerPage
      };
  }

    function formatarReal(valor: number | string, opcoes: OpcoesReal = {}): string {
        const { incluirSimbolo = true, casasDecimais = 2 } = opcoes;

        let numero: number;

        if(typeof valor === 'string') {
            numero = parseFloat(valor)
        } else { 
            numero = valor
        }

        if(valor === null) {
            numero = 0
        }
        
        if (incluirSimbolo) {
            return numero.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: casasDecimais,
                maximumFractionDigits: casasDecimais
            });
        }
        
        return numero.toLocaleString('pt-BR', {
            minimumFractionDigits: casasDecimais,
            maximumFractionDigits: casasDecimais
        });
    }

    function formatKilometers(km: number) {
        return km.toLocaleString('pt-BR').replace(/,/g, '.');
    }

    function menu() {
        setIsMenuOpen(!isMenuOpen);
    }

    // Função para recarregar veículos (útil após login)
    const reloadVehicles = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Verificar se há token de autenticação
            const token = localStorage.getItem('auth_token');
            if (!token) {
                setError('Faça login para ver os veículos');
                setVeiculos([]);
                setLoading(false);
                return;
            }
            
            const apiVehicles = await apiService.getVehicles({
                page: 1,
                limit: 100,
            });
            const frontendVehicles = apiVehicles.map(convertApiVehicleToFrontend);
            setVeiculos(frontendVehicles);
        } catch (err) {
            console.error('Erro ao recarregar veículos:', err);
            setError(err instanceof Error ? err.message : 'Erro ao carregar veículos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Usercontext.Provider
        value={{ 
            menu, 
            isMenuOpen, 
            setIsMenuOpen, 
            veiculos, 
            loading, 
            error, 
            suggestedVehicles, 
            formatarReal, 
            formatKilometers,
            currentPage,
            setCurrentPage,
            itemsPerPage,
            getPaginatedData,
            reloadVehicles
        }}
        >
        {children}
        </Usercontext.Provider>
    );
}

export default UserProvider;
