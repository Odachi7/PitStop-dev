import { Router } from "express";
import { VeiculoController } from "../src/controllers/veiculoController";

const router = Router();

router.post("/additem", VeiculoController.add);
router.get("/veiculos", VeiculoController.getAll);
router.get("/veiculo/:id", VeiculoController.getWhitId);
router.post("/:altercategory/:id", VeiculoController.alterVeiculo);

export { router };
