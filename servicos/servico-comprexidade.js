const express = require("express");

const app = express();

const PORTA = 3004;

app.use(express.json());

app.post("/analisar", async (req, res) => {

    const titulo = req.body.titulo || "";

    await esperar(2000);

    let complexidade = "Baixa";

    if (titulo.length <= 10) {
        complexidade = "Baixa";
    } else if (titulo.length <= 20 ) {
        complexidade = "Média";
    } else{
        complexidade = "Alta";
    }

    res.json({
        servico: "complexidade",
        complexidade: complexidade
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