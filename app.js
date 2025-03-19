let pontuacao = JSON.parse(localStorage.getItem('pontuacao')) || { Vitor: 0, Matheus: 0 };
let palpites = JSON.parse(localStorage.getItem('palpites')) || {};
let historico = JSON.parse(localStorage.getItem('historico')) || [];
let times = [];

window.onload = function () {
    atualizarRanking();
    carregarHistorico();
};

function configurarPartida() {
    let partidaInput = document.getElementById('partida').value.trim();
    if (!partidaInput.includes('x')) {
        alert('Formato inválido. Use "TimeA x TimeB"');
        return;
    }

    times = partidaInput.split('x').map(t => t.trim());
    document.getElementById('painel-palpites').style.display = 'block';
    document.getElementById('painel-resultado').style.display = 'block';
    gerarCamposPalpites();
    gerarCamposResultado();
}

function gerarCamposPalpites() {
    document.getElementById('palpite-vitor').innerHTML = gerarInputs('vitor');
    document.getElementById('palpite-matheus').innerHTML = gerarInputs('matheus');
}

function gerarCamposResultado() {
    document.getElementById('resultado-partida').innerHTML = gerarInputs('resultado');
}

function gerarInputs(prefixo) {
    if (prefixo === 'resultado') {
        return `${times[0]}: <input type="number" id="resultado-real-time1" min="0" max="10"> x 
                <input type="number" id="resultado-real-time2" min="0" max="10"> ${times[1]}`;
    } else {
        return `${times[0]} (realista): <input type="number" id="${prefixo}-real-time1" min="0" max="10"> x 
                <input type="number" id="${prefixo}-real-time2" min="0" max="10"> ${times[1]}<br>
                ${times[0]} (torcedor): <input type="number" id="${prefixo}-torcedor-time1" min="0" max="10"> x 
                <input type="number" id="${prefixo}-torcedor-time2" min="0" max="10"> ${times[1]}`;
    }
}

function registrarPalpites() {
    palpites[times.join(' x ')] = {
        Vitor: {
            torcedor: pegarPlacar('vitor-torcedor-time1', 'vitor-torcedor-time2'),
            realista: pegarPlacar('vitor-real-time1', 'vitor-real-time2')
        },
        Matheus: {
            torcedor: pegarPlacar('matheus-torcedor-time1', 'matheus-torcedor-time2'),
            realista: pegarPlacar('matheus-real-time1', 'matheus-real-time2')
        }
    };
    localStorage.setItem('palpites', JSON.stringify(palpites));
    alert('Palpites registrados!');
}

function registrarResultado() {
    let resultado = pegarPlacar('resultado-real-time1', 'resultado-real-time2');
    if (!validarPlacar(resultado)) {
        alert('Placar inválido! Apenas números entre 0 e 10.');
        return;
    }
    
    let partida = times.join(' x ');
    for (let user in palpites[partida]) {
        if (comparaPlacar(resultado, palpites[partida][user].realista) || 
            comparaPlacar(resultado, palpites[partida][user].torcedor)) {
            pontuacao[user]++;
            alert(`${user} pontuou!`);
        }
    }
    historico.push({ partida, palpites: palpites[partida], resultado });
    localStorage.setItem('pontuacao', JSON.stringify(pontuacao));
    localStorage.setItem('historico', JSON.stringify(historico));
    atualizarRanking();
    carregarHistorico();
}

function pegarPlacar(id1, id2) {
    return {
        time1: parseInt(document.getElementById(id1).value),
        time2: parseInt(document.getElementById(id2).value)
    };
}

function validarPlacar(placar) {
    return !isNaN(placar.time1) && !isNaN(placar.time2) && placar.time1 >= 0 && placar.time1 <= 10 && placar.time2 >= 0 && placar.time2 <= 10;
}

function comparaPlacar(p1, p2) {
    return p1.time1 === p2.time1 && p1.time2 === p2.time2;
}

function atualizarRanking() {
    document.getElementById('ranking').innerText = `Vitor: ${pontuacao.Vitor} pts | Matheus: ${pontuacao.Matheus} pts`;
}

function carregarHistorico() {
    let tabela = document.getElementById('historico');
    tabela.innerHTML = `<tr><th>Partida</th><th>Vitor (Torcedor / Realista)</th><th>Matheus (Torcedor / Realista)</th><th>Resultado</th></tr>`;
    historico.forEach(({ partida, palpites, resultado }) => {
        tabela.innerHTML += `<tr><td>${partida}</td><td>${palpites.Vitor.torcedor.time1}-${palpites.Vitor.torcedor.time2} / ${palpites.Vitor.realista.time1}-${palpites.Vitor.realista.time2}</td>
                            <td>${palpites.Matheus.torcedor.time1}-${palpites.Matheus.torcedor.time2} / ${palpites.Matheus.realista.time1}-${palpites.Matheus.realista.time2}</td>
                            <td>${resultado.time1}-${resultado.time2}</td></tr>`;
    });
}