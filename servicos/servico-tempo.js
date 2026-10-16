const express = require("express");

const app = express();

const PORTA = 3002;

app.use(express.json());

app.post("/analisar", async (req, res) => {

    const titulo = req.body.titulo || "";

    await esperar(2000);

    let horas = 2;

    if (titulo.length > 20) {
        horas = 8;
    } else if (titulo.length > 10) {
        horas = 4;
    }

    res.json({
        servico: "tempo",
        estimativaHoras: horas
    });
});

function esperar(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

app.listen(PORTA, () => {
    console.log(
        `Serviço de tempo rodando em http://localhost:${PORTA}`
    );
});