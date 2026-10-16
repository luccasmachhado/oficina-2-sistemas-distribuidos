const campoTitulo = document.getElementById("titulo");
const botaoAdicionar = document.getElementById("botaoAdicionar");
const listaTarefas = document.getElementById("listaTarefas");
const mensagem = document.getElementById("mensagem");

async function carregarTarefas() {
    const resposta = await fetch("/api/tarefas");
    const tarefas = await resposta.json();

    listaTarefas.innerHTML = "";

    tarefas.forEach((tarefa) => {
        const item = document.createElement("li");
        item.textContent = tarefa.titulo;
        listaTarefas.appendChild(item);
    });
}

async function adicionarTarefa() {
    const titulo = campoTitulo.value;
    mensagem.textContent = "";

    if (titulo.trim() === "") {
        mensagem.textContent = "Digite uma tarefa.";
        campoTitulo.focus();
        return;
    }

    const resposta = await fetch("/api/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titulo: titulo
        })
    });

    if (!resposta.ok) {
        mensagem.textContent = "Nao foi possivel adicionar a tarefa.";
        return;
    }

    campoTitulo.value = "";
    campoTitulo.focus();
    await carregarTarefas();
}

botaoAdicionar.addEventListener("click", adicionarTarefa);

campoTitulo.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        adicionarTarefa();
    }
})

carregarTarefas();