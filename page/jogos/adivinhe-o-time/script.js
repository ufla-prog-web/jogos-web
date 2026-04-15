/*
 * Adivinhe o Time!
 * Autor: Lucas de Oliveira Pereira
 * Licença: MIT
 *
 * Copyright (c) 2025
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.
 */

const times = [
    { name: "Flamengo", aliases: ["flamengo", "fla", "mengão", "mengao"], img: "./images/flamengo.png" },
    { name: "Corinthians", aliases: ["corinthians", "timão", "timao"], img: "./images/corinthians.png" },
    { name: "Palmeiras", aliases: ["palmeiras", "verdão", "verdao", "porco"], img: "./images/palmeiras.png" },
    { name: "São Paulo", aliases: ["são paulo", "sao paulo", "spfc"], img: "./images/saopaulo.png" },
    { name: "Santos", aliases: ["santos", "peixe"], img: "./images/santos.png" },
    { name: "Grêmio", aliases: ["grêmio", "gremio"], img: "./images/gremio.png" },
    { name: "Internacional", aliases: ["internacional", "inter", "colorado"], img: "./images/internacional.png" },
    { name: "Atlético-MG", aliases: ["atletico-mg", "atletico mg", "atlético mg", "galo", "atletico mineiro", "atlético mineiro"], img: "./images/atletico.png" },
    { name: "Cruzeiro", aliases: ["cruzeiro", "raposa"], img: "./images/cruzeiro.png" },
    { name: "Botafogo", aliases: ["botafogo", "fogão", "fogao"], img: "./images/botafogo.png" },
    { name: "Fluminense", aliases: ["fluminense", "flu"], img: "./images/fluminense.png" },
    { name: "Vasco", aliases: ["vasco", "vasco da gama"], img: "./images/vasco.png" },
];

const totalTimes = times.length;
const minimoParaVencer = 9;

let timesEmbaralhados = [];
let indiceAtual = 0;
let acertos = 0;

function removerAcentos(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function iniciarJogo() {
    timesEmbaralhados = [...times].sort(() => Math.random() - 0.5);
    indiceAtual = 0;
    acertos = 0;
    document.getElementById("pontuacao").textContent = "Acertos: 0";
    document.getElementById("tela-inicio").style.display = "none";
    document.getElementById("tela-fim").style.display = "none";
    document.getElementById("tela-jogo").style.display = "block";
    carregarTime();
}

function carregarTime() {
    document.getElementById("escudo").src = timesEmbaralhados[indiceAtual].img;
    document.getElementById("resposta").value = "";
    document.getElementById("progresso").textContent = "Time " + (indiceAtual + 1) + " de " + totalTimes;
    document.getElementById("resposta").focus();
}

function verificar() {
    const respostaDigitada = removerAcentos(document.getElementById("resposta").value);
    if (!respostaDigitada) return;

    const timeAtual = timesEmbaralhados[indiceAtual];
    const acertou = timeAtual.aliases.some(a => removerAcentos(a) === respostaDigitada);

    if (acertou) {
        acertos++;
        document.getElementById("pontuacao").textContent = "Acertos: " + acertos;
    }

    indiceAtual++;

    if (indiceAtual >= totalTimes) {
        encerrarJogo();
    } else {
        carregarTime();
    }
}

function encerrarJogo() {
    document.getElementById("tela-jogo").style.display = "none";
    document.getElementById("tela-fim").style.display = "block";
    document.getElementById("resultado-texto").textContent = "Você acertou " + acertos + " de " + totalTimes + " times!";

    if (acertos >= minimoParaVencer) {
        document.getElementById("resultado-status").textContent = "Vitória!";
    } else {
        document.getElementById("resultado-status").textContent = "Derrota! Tente novamente.";
    }
}

function reiniciar() {
    iniciarJogo();
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") verificar();
});