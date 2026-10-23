const {
    parentPort,
    workerData
} = require("worker_threads");

function calcular(inicio, fim) {

    let resultado = 0;

    for (let i = inicio; i <= fim; i++) {

        resultado += Math.sqrt(i);

    }

    return resultado;
}

const resultado = calcular(
    workerData.inicio,
    workerData.fim
);

parentPort.postMessage(resultado);