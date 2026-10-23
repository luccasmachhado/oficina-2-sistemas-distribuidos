const express = require("express");

const app = express();
const PORTA = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const tarefas = [
    { id: 1, titulo: "Aprender Backend" },
    { id: 2, titulo: "Aprender Frontend" }
];

app.get("/api/tarefas", (req, res) => {
    res.json(tarefas);
});

app.post("/api/tarefas", (req, res) => {
    const titulo = req.body && req.body.titulo;

    if (!titulo || titulo.trim() === "") {
        return res.status(400).json({
            erro: "O titulo da tarefa e obrigatorio."
        });
    }

    const novaTarefa = {
        id: tarefas.length + 1,
        titulo: titulo.trim()
    };

    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

app.post("/api/analisar-sequencial", async (req, res) => {

    const titulo = req.body.titulo;

    const inicio = Date.now();

    const respostaPrioridade = await fetch(
        "http://localhost:3001/analisar",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo
            })
        }
    );

    const prioridade = await respostaPrioridade.json();


    const respostaTempo = await fetch(
        "http://localhost:3002/analisar",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo
            })
        }
    );

    const tempo = await respostaTempo.json();


    const respostaCategoria = await fetch(
        "http://localhost:3003/analisar",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo
            })
        }
    );

    const categoria = await respostaCategoria.json();

    const respostaComplexidade = await fetch(
        "http://localhost:3004/analisar",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo
            })
        }
    );

    const complexidade = await respostaComplexidade.json();

    const fim = Date.now();

    res.json({
        titulo: titulo,
        prioridade: prioridade.prioridade,
        estimativaHoras: tempo.estimativaHoras,
        categoria: categoria.categoria,
        complexidade: complexidade.complexidade,
        tempoTotalMs: fim - inicio,
        modo: "sequencial"
    });
});

app.post("/api/analisar-concorrente", async (req, res) => {

    const titulo = req.body.titulo;

    const inicio = Date.now();

    const requisicaoPrioridade = fetch(
        "http://localhost:3001/analisar",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo
            })
        }
    );

    const requisicaoTempo = fetch(
        "http://localhost:3002/analisar",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo
            })
        }
    );

    const requisicaoCategoria = fetch(
        "http://localhost:3003/analisar",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo
            })
        }
    );

    const requisicaoComplexidade = fetch(
        "http://localhost:3004/analisar",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo
            })
        }
    );

    const respostas = await Promise.all([
        requisicaoPrioridade,
        requisicaoTempo,
        requisicaoCategoria,
        requisicaoComplexidade
    ]);

    const dados = await Promise.all([
        respostas[0].json(),
        respostas[1].json(),
        respostas[2].json(),
        respostas[3].json()
    ]);

    const fim = Date.now();

    res.json({
        titulo: titulo,
        prioridade: dados[0].prioridade,
        estimativaHoras: dados[1].estimativaHoras,
        categoria: dados[2].categoria,
        complexidade: dados[3].complexidade,
        tempoTotalMs: fim - inicio,
        modo: "concorrente"
    });
});

async function chamarServico(url, titulo) {

    try {

        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo: titulo
            })
        });

        if (!resposta.ok) {
            throw new Error("Resposta inválida");
        }

        return await resposta.json();

    } catch (erro) {

        return {
            erro: true,
            mensagem: "Serviço indisponível"
        };
    }
}

app.post("/api/analisar-tolerante", async (req, res) => {

    const titulo = req.body.titulo;

    const inicio = Date.now();

    const resultados = await Promise.all([
        chamarServico(
            "http://localhost:3001/analisar",
            titulo
        ),
        chamarServico(
            "http://localhost:3002/analisar",
            titulo
        ),
        chamarServico(
            "http://localhost:3003/analisar",
            titulo
        ),
        chamarServico(
            "http://localhost:3004/analisar",
            titulo
        ),
    ]);

    const fim = Date.now();

    res.json({
        titulo: titulo,
        prioridade: resultados[0],
        tempo: resultados[1],
        categoria: resultados[2],
        complexidade: resultados[3],
        tempoTotalMs: fim - inicio
    });
});

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});