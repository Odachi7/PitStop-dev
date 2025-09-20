import { createContext } from "react";

export interface OpcoesReal {
  incluirSimbolo?: boolean;
  casasDecimais?: number;
}

// Interface para dados de paginação
interface PaginationData {
  items: any[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

type Vehicle = {
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
};

type UserContextData = {
  menu: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
  veiculos: Vehicle[];
  loading: boolean;
  error: string | null;
  suggestedVehicles: (
    currentVehicleId: number, 
    options?: {
      category?: string;
      priceRange?: number;
      limit?: number;
    }
  ) => Vehicle[];
  formatarReal: (valor: number | string, opcoes?: OpcoesReal) => string; // opcoes opcional
  formatKilometers: (km: number) => string; // retorna string, não void
  currentPage: number;
  setCurrentPage: (page: number) => void; // tipagem mais específica
  itemsPerPage: number;
  getPaginatedData: <T>(data: T[], page: number, itemsPerPage: number) => PaginationData; // retorno mais específico
};

export const Usercontext = createContext({} as UserContextData);
