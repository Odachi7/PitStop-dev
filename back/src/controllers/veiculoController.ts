import { Request, Response } from "express";
import { VeiculoSchema } from "../schemas/veiculoSchema";
import { VeiculoService } from "../service/veiculoService";

export class VeiculoController {
  static async add(req: Request, res: Response) {

    const parsed = VeiculoSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({ 
            data: null, error: parsed.error.format() 
        });
    }

    try {
        const newVeiculo = await VeiculoService.add(parsed.data);

        res.status(201).json({ 
            data: newVeiculo, 
            error: null 
        });
    } catch (err: any) {
        res.status(500).json({ 
            data: null, 
            error: err.message 
        });
    }
  }

  static async getAll (req: Request, res: Response) {
    try {
        const veiculos = await VeiculoService.getAll();

        res.status(201).json({
            data: veiculos,
            error: null
        })
    }catch (error: any) {
        res.status(500).json({
            data: null, 
            error: error.message
        })
    }
  }

  static async getWhitId(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const veiculo = await VeiculoService.getWhitId(Number(id))

        res.status(201).json({
            data: veiculo, 
            error: null
        })
    } catch (error: any) {
        res.status(500).json({
            data: null,
            error: error.message
        })
    }
  }

  static async alterVeiculo(req: Request, res: Response) {
    try {
        const { newValue } = req.body;
        const { altercategory , id } = req.params;
        const veiculo = await VeiculoService.alterVeiculo(altercategory, Number(id), newValue)

        res.status(201).json({
            data: veiculo,
            error: null
        })
    } catch (error: any) {
        res.status(400).json({
            data: null,
            error: error.message
        })
    }
  }

  static async removeVeiculo(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await VeiculoService.removeVeiculo(Number(id))

        res.status(200).json({
            data: "Deletado com sucesso!",
            error: null
        })        
    } catch (error: any) {
        res.status(400).json({
            data: null,
            error: error.message
        })
    }
  }
}