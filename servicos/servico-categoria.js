const express = require("express");

const app = express();

const PORTA = 3003;

app.use(express.json());

app.post("/analisar", async (req, res) => {

    const titulo = (req.body.titulo || "").toLowerCase();

    await esperar(2000);

    let categoria = "Geral";

    if (titulo.includes("api") || titulo.includes("sistema")) {
        categoria = "Desenvolvimento";
    }

    if (titulo.includes("estudar") || titulo.includes("aula")) {
        categoria = "Estudo";
    }

    res.json({
        servico: "categoria",
        categoria: categoria
    });
});

function esperar(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

app.listen(PORTA, () => {
    console.log(
        `Serviço de categoria rodando em http://localhost:${PORTA}`
    );
});