import { Entity } from './base/Entity';

export interface VeiculoProps {
  id: string;
  vendedorId: string;
  marca: string;
  modelo: string;
  categoria: string;
  ano: number;
  cor?: string;
  portas: number;
  quilometragem: number;
  tipoCombustivel?: string;
  transmissao?: string;
  motor?: string;
  valor: number;
  moeda: string;
  status?: 'disponivel' | 'vendido' | 'reservado' | 'inativo';
  titulo: string;
  descricao?: string;
  imagemPrincipal: string;
  imagem2?: string;
  imagem3?: string;
  imagem4?: string;
  imagem5?: string;
  imagem6?: string;
  imagem7?: string;
  imagem8?: string;
  localizacaoCidade?: string;
  localizacaoEstado?: string;
  numeroIdentificacao?: string;
  dt_inc?: Date;
  dt_alt?: Date;
  dt_public?: Date;
}

export class Vehicle extends Entity<VeiculoProps> {
  private constructor(props: VeiculoProps, id?: string) {
    super(props, id);
  }

  static create(props: VeiculoProps, id?: string): Vehicle {
    const vehicle = new Vehicle(props, id);
    
    // Validações de negócio
    if (props.ano < 1900 || props.ano > new Date().getFullYear() + 1) {
      throw new Error('Ano do veículo inválido');
    }
    if (props.valor <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }
    if(props.portas < 2 || props.portas > 6) {
        throw new Error('Quantidade de portas inválidas!');
    }
    if(props.quilometragem < 0 ) {
        throw new Error('Quilometragem inválida! Precisa ser um valor superior ou igual a 0.')
    }

    return vehicle;
  }

  // Getters
    get vendedorId(): string { 
        return this.props.vendedorId; 
    }
    get marca(): string { 
        return this.props.marca; 
    }
    get modelo(): string { 
        return this.props.modelo; 
    }
    get ano(): number { 
        return this.props.ano; 
    }
    get valor(): number { 
        return this.props.valor; 
    }
    get status() { 
        return this.props.status; 
    }
    get titulo(): string { 
        return this.props.titulo; 
    }

  // Métodos de negócio
  marcarVendido(): void {
    this.props.status = 'vendido';
    this.props.dt_alt = new Date();
  }

  marcarReservado(): void {
    this.props.status = 'reservado';
    this.props.dt_alt = new Date();
  }

  publicar(): void {
    this.props.status = 'disponivel';
    this.props.dt_public = new Date();
    this.props.dt_alt = new Date();
  }
}