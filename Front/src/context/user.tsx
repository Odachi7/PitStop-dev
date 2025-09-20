import { useState, useEffect } from "react";
import type { ReactNode } from "react"
import { Usercontext } from "./userContext";
import type { OpcoesReal } from "./userContext";
interface UserProviderProps {
  children: ReactNode;
}

// Tipo para veículos que pode vir da API
type ApiVehicle = {
    id: number
    title: string
    price: number
    image: string
    image1?: string  
    image2?: string  
    image3?: string  
    image4?: string  
    image5?: string  
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
    [key: string]: unknown; // Para propriedades adicionais que podem vir da API
};

function UserProvider({ children }: UserProviderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [veiculos, setVeiculos] = useState<ApiVehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);

    const url = "http://localhost:3333/veiculos";

  // UseEffect direto no componente
  useEffect(() => {
    let isCancelled = false; // Previne race conditions

        async function getVeiculos() {
            try {
                // Verificar se a URL está definida
                if (!url) {
                    throw new Error('URL não definida');
                }

                setLoading(true);
                setError(null); // Limpar erros anteriores

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Adicione outros headers se necessário (autorização, etc.)
                    },
                    // Timeout de 10 segundos
                    signal: AbortSignal.timeout(10000)
                });

                // Verificar se a resposta foi bem-sucedida
                if (!response.ok) {
                    // Log detalhado do erro
                    console.error('❌ Erro na resposta:', {
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url
                    });
                    
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }

                // Verificar content-type
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    throw new Error('Resposta não é JSON válido');
                }

                const data = await response.json();

                // Verificar se o componente ainda está montado
                if (!isCancelled) {
                    // Garantir que data seja sempre um array
                    const vehiclesArray = Array.isArray(data) ? data : 
                        data.vehicles ? data.vehicles : 
                        data.data ? data.data : [];
                    setVeiculos(vehiclesArray);
                }
                } catch (err: unknown) {
                    if (!isCancelled) {
                        let errorMessage = 'Erro desconhecido ao carregar veículos';
                        
                        if (err instanceof Error) {
                            if (err.name === 'AbortError') {
                                errorMessage = 'Requisição cancelada (timeout)';
                            } else if (err.message.includes('Failed to fetch')) {
                                errorMessage = 'Erro de conexão - verifique sua internet';
                            } else if (err.message.includes('CORS')) {
                                errorMessage = 'Erro de CORS - problema de configuração do servidor';
                            } else {
                                errorMessage = err.message;
                            }
                        }

                        // Log detalhado do erro
                        console.error('❌ Erro completo:', {
                            message: errorMessage,
                            error: err,
                            url: url,
                            timestamp: new Date().toISOString()
                        });

                        setError(errorMessage);
                        setVeiculos([]); // Array vazio em caso de erro
                    }
                } finally {
                    if (!isCancelled) {
                        setLoading(false);
                    }
                }
            }

            getVeiculos();

            // Cleanup function para evitar memory leaks
            return () => {
                isCancelled = true;
            };
    }, [url]); // Dependência da URL

    function suggestedVehicles(
            currentVehicleId: number, 
            options: {
                category?: string;
                priceRange?: number; // Porcentagem de variação do preço
                limit?: number;
            } = {}
        ): ApiVehicle[] {
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
            getPaginatedData
        }}
        >
        {children}
        </Usercontext.Provider>
    );
}

export default UserProvider;
