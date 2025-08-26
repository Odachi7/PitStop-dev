import { z } from "zod";

export const VeiculoSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  price: z.number().positive("Preço deve ser positivo"),
  image: z.string().min(1, "O veículo deve conter uma imagem!"),
  images: z.array(z.string()).optional(),
  mileage: z.number().optional(),
  transmission: z.string().optional(),
  fuel: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int("Ano deve ser inteiro"),
  location: z.string().optional(),
  color: z.string().optional(),
  doors: z.number().int("Portas devem ser inteiras"),
  engine: z.string().optional(),
  vin: z.string().optional(),
  description: z.string().optional(),
});

export type Veiculo = z.infer<typeof VeiculoSchema>;
