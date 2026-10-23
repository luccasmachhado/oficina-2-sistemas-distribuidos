const {
    Worker
} = require("worker_threads");


function executarWorker(inicio, fim) {

    return new Promise((resolve, reject) => {

        const worker = new Worker(
            "./workers/calculo-worker.js",
            {
                workerData: {
                    inicio: inicio,
                    fim: fim
                }
            }
        );

        worker.on("message", resolve);

        worker.on("error", reject);
    });
}


async function executar() {

    const LIMITE = 20_000_000;

    console.time("tempo-paralelo");

    const metade = Math.floor(LIMITE / 2);

    const resultados = await Promise.all([

        executarWorker(
            1,
            metade
        ),

        executarWorker(
            metade + 1, 
            LIMITE
        )

    ]);

    const total =
        resultados[0] +
        resultados[1];

    console.timeEnd("tempo-paralelo");

    console.log(
        "Resultado:",
        total
    );
}


executar();