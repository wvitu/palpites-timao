let pontuacao = {
    Vitor: 0,
    Matheus: 0
};

let palpites = {
    Vitor: { torcedor: {}, realista: {} },
    Matheus: { torcedor: {}, realista: {} }
};

let times = [];

window.onload = function () {
    if (localStorage.getItem('pontuacao')) {
        pontuacao = JSON.parse(localStorage.getItem('pontuacao'));
        atualizarRanking();
    }
};

function configurarPartida() {
    let partidaInput = document.getElementById('partida').value.trim();

    if (!partidaInput.includes('x')) {
        alert('Formato inválido. Use "TimeA x TimeB"');
        return;
    }

    times = partidaInput.split('x').map(t => t.trim());

    gerarCamposPalpites();
    gerarCamposResultado();

    document.getElementById('painel-palpites').style.display = 'block';
    document.getElementById('painel-resultado').style.display = 'block';
}

function gerarCamposPalpites() {
    let palpiteVitor = document.getElementById('palpite-vitor');
    let palpiteMatheus = document.getElementById('palpite-matheus');

    palpiteVitor.innerHTML = gerarInputs('vitor');
    palpiteMatheus.innerHTML = gerarInputs('matheus');
}

function gerarCamposResultado() {
    let resultado = document.getElementById('resultado-partida');
    resultado.innerHTML = gerarInputs('resultado');
}

function gerarInputs(prefixo) {
    return `
        ${times[0]}: <input type="number" id="${prefixo}-time1" min="0" max="10"> 
        x 
        <input type="number" id="${prefixo}-time2" min="0" max="10"> ${times[1]}
        <br>
        ${prefixo !== 'resultado' ? `
        ${times[0]} (realista): <input type="number" id="${prefixo}-real-time1" min="0" max="10"> 
        x 
        <input type="number" id="${prefixo}-real-time2" min="0" max="10"> ${times[1]}
        <br>` : ''}
    `;
}

function registrarPalpites() {
    palpites.Vitor.torcedor = pegarPlacar('vitor-time1', 'vitor-time2');
    palpites.Vitor.realista = pegarPlacar('vitor-real-time1', 'vitor-real-time2');
    palpites.Matheus.torcedor = pegarPlacar('matheus-time1', 'matheus-time2');
    palpites.Matheus.realista = pegarPlacar('matheus-real-time1', 'matheus-real-time2');

    alert('Palpites registrados!');
}

function registrarResultado() {
    const resultado = pegarPlacar('resultado-time1', 'resultado-time2');

    if (!validarPlacar(resultado)) {
        alert('Placar inválido! Apenas números entre 0 e 10.');
        return;
    }

    for (let user in palpites) {
        if (
            comparaPlacar(resultado, palpites[user].torcedor) ||
            comparaPlacar(resultado, palpites[user].realista)
        ) {
            pontuacao[user]++;
            alert(`${user} pontuou!`);
        }
    }

    localStorage.setItem('pontuacao', JSON.stringify(pontuacao));
    atualizarRanking();
}

function pegarPlacar(id1, id2) {
    return {
        time1: parseInt(document.getElementById(id1).value),
        time2: parseInt(document.getElementById(id2).value)
    };
}

function validarPlacar(placar) {
    return (
        !isNaN(placar.time1) && !isNaN(placar.time2) &&
        placar.time1 >= 0 && placar.time1 <= 10 &&
        placar.time2 >= 0 && placar.time2 <= 10
    );
}

function comparaPlacar(p1, p2) {
    return p1.time1 === p2.time1 && p1.time2 === p2.time2;
}

function atualizarRanking() {
    document.getElementById('ranking').innerText =
        `Vitor: ${pontuacao.Vitor} pts | Matheus: ${pontuacao.Matheus} pts`;
}
