import { Entity } from './base/Entity';

export interface ClientProps {
  id?: string;
  email: string;
  senhaHash: string;
  primeiroNome: string;
  ultimoNome: string;
  celular?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  codigoPostal?: string;
  vendedor: boolean;
  ativo: boolean;
  nomeEmpresarial?: string;
  cnpj?: string;
  cpf?: string;
  celularEmpresarial?: string;
  enderecoEmpresarial?: string;
  dt_inc?: Date;
  dt_alt?: Date;
  ultimoLogin?: Date;
}

export class Client extends Entity<ClientProps> {
  private constructor(props: ClientProps, id?: string) {
    super(props, id);
  }

  static create(props: ClientProps, id?: string): Client {
    const client = new Client(props, id);
    
    // Validações de negócio
    if (props.vendedor) {
      if (!props.nomeEmpresarial) {
        throw new Error('Nome da empresa é obrigatório para vendedores');
      }

      if (!props.cnpj && !props.cpf) {
        throw new Error('CNPJ ou CPF é obrigatório para vendedores');
      }

      if(!props.enderecoEmpresarial) {
        throw new Error('Para ser um vendedor precisa de um endereço fixo!')
      }
    }

    return client;
  }

  // Getters
    get email(): string { 
      return this.props.email; 
    }
    get senhaHash(): string { 
      return this.props.senhaHash; 
    }
    get primeiroNome(): string { 
      return this.props.primeiroNome; 
    }
    get ultimoNome(): string { 
      return this.props.ultimoNome; 
    }
    get nomeCompleto(): string { 
      return `${this.props.primeiroNome} ${this.props.ultimoNome}`; 
    }
    get vendedor(): boolean { 
      return this.props.vendedor; 
    }
    get ativo(): boolean { 
      return this.props.ativo; 
    }
    get nomeEmpresarial(): string | undefined { 
      return this.props.nomeEmpresarial; 
    }

    // Métodos de negócio
    serVendedor(nomeEmpresarial: string, cnpj?: string, cpf?: string, enderecoEmpresarial?: string): void {
        if (!nomeEmpresarial) {
            throw new Error('Nome da empresa é obrigatório para se tornar vendedor');
        }
        if (!cnpj && !cpf) {
            throw new Error('CNPJ ou CPF é obrigatório para se tornar vendedor');
        }
        if(!enderecoEmpresarial) {
            throw new Error('Um endereço fixo é necessario para se tornar um vendedor!')
        }

        this.props.vendedor = true;
        this.props.nomeEmpresarial = nomeEmpresarial;
        this.props.cnpj = cnpj;
        this.props.cpf = cpf;
        this.props.dt_alt = new Date();
    }

    atualizarUltimoLogin(): void {
        this.props.ultimoLogin = new Date();
        this.props.dt_alt = new Date();
    }
}