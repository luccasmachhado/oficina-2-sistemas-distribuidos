const express = require("express");

const app = express();

const PORTA = 3001;

app.use(express.json());

app.post("/analisar", async (req, res) => {

    const titulo = req.body.titulo || "";

    await esperar(2000);

    let prioridade = "Baixa";

    if (titulo.length > 20) {
        prioridade = "Alta";
    } else if (titulo.length > 10) {
        prioridade = "Média";
    }

    res.json({
        servico: "prioridade",
        prioridade: prioridade
    });
});

function esperar(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

app.listen(PORTA, () => {
    console.log(
        `Serviço de prioridade rodando em http://localhost:${PORTA}`
    );
});