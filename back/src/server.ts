import type { Request, Response } from "express";
import express from "express";
import cors from "cors";
import "express-async-errors";
import { router } from "./routes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use(router)

app.use((err: Error, req: Request, res: Response) => {
    if( err instanceof Error ) {
        return res.status(400).json({
            error: err.message
        })
    }

    res.status(500).json({
        status: "Error",
        massage: "Internal Server Error"
    })
})

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
}).on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Porta ${PORT} está em uso. Tentando porta ${Number(PORT) + 1}...`);
        app.listen(Number(PORT) + 1, () => {
            console.log(`🚀 Servidor rodando na porta ${Number(PORT) + 1}`);
        });
    } else {
        console.error('❌ Erro ao iniciar servidor:', err);
    }
});