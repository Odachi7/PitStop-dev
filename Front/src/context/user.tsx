import { useState, useEffect } from "react";
import type { ReactNode } from "react"
import { Usercontext } from "./userContext";

interface UserProviderProps {
  children: ReactNode;
}

// Tipo para veículos que pode vir da API
type ApiVehicle = {
  id: number;
  title: string;
  category: string;
  brand: string;
  price: number;
  mileage?: string;
  transmission?: string;
  fuel?: string;
  location?: string;
  image?: string;
  [key: string]: unknown; // Para propriedades adicionais que podem vir da API
};

function UserProvider({ children }: UserProviderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [veiculos, setVeiculos] = useState<ApiVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  function menu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <Usercontext.Provider
      value={{ menu, isMenuOpen, setIsMenuOpen, veiculos, loading, error }}
    >
      {children}
    </Usercontext.Provider>
  );
}

export default UserProvider;
