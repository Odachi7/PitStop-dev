import { Veiculo } from "../schemas/veiculoSchema";
import { VeiculoRepository } from "../repository/veiculo.repository";

function fixEncoding(str?: string | null) {
  if (!str) return str;
  try {
    return Buffer.from(str, "latin1").toString("utf8");
  } catch {
    return str; 
  }
}

export class VeiculoService {
  // Adicionar veículo
  static async add(veiculo: Veiculo) {
    veiculo.title       = fixEncoding(veiculo.title) ?? "";
    veiculo.image       = fixEncoding(veiculo.image) ?? "";
    veiculo.brand       = fixEncoding(veiculo.brand) ?? "";
    veiculo.model       = fixEncoding(veiculo.model) ?? "";
    veiculo.location    = fixEncoding(veiculo.location) ?? "";
    veiculo.color       = fixEncoding(veiculo.color) ?? "";
    veiculo.engine      = fixEncoding(veiculo.engine) ?? "";
    veiculo.vin         = fixEncoding(veiculo.vin) ?? "";
    veiculo.description = fixEncoding(veiculo.description) ?? "";

    if (veiculo.images && veiculo.images.length > 0) {
      veiculo.images = veiculo.images.map(img => fixEncoding(img) ?? "");
    }

    if (veiculo.year < 1900) {
      throw new Error("Apenas veículos com ano de 1900 ou superior!");
    }

    if(veiculo.doors < 2 || veiculo.doors > 6) {
      throw new Error("Número de portas inválido!");
    }

    if(veiculo.price <= 0) {
      throw new Error("Preço deve ser maior que zero!");
    }

    const newVeiculo = await VeiculoRepository.add(veiculo);
    return newVeiculo;
  }

  // Busca todos Veículos
  static async getAll() {
    const veiculos = await VeiculoRepository.getAll();
    return veiculos.map(v => ({
      ...v,
      title: fixEncoding(v.title),
      description: fixEncoding(v.description),
    }));
  }

  // Buscar veiculo pelo Id
  static async getWhitId(id: number) {
    if(!id || isNaN(id) || id <= 0) {
      throw new Error("Id inválido!")
    }

    const veiculo = await VeiculoRepository.getWhitId(id)

    if(!veiculo) {
      throw new Error("Veiculo não encontrado!")
    }

    return veiculo
  }

  // Alterar veiculo
  static async alterVeiculo(altercategory: string, id: number, newValue: string | number) {
    if (!altercategory || typeof altercategory !== "string") {
    throw new Error("altercategory deve ser uma string");
   }

    altercategory = altercategory.trim();
    if (!altercategory) throw new Error("altercategory não pode ser vazio!");
    if (altercategory.length > 50) throw new Error("altercategory é muito grande!");

    if (!id || !Number.isInteger(id) || id <= 0) {
      throw new Error("Id inválido!");
    }

    if (newValue === null || newValue === undefined) {
      throw new Error("O valor não pode ser vazio!");
    }

    const veiculo = await VeiculoRepository.alterVeiculo(altercategory, id, newValue);

    if (!veiculo) throw new Error("Veículo não encontrado!");

    return veiculo;
  }

  static async removeVeiculo(id: number) {
    if (!id || !Number.isInteger(id) || id <= 0) {
      throw new Error("Id inválido!");
    }

    const veiculo = await VeiculoRepository.removeVeiculo(id);
    
    return  veiculo
  }
}