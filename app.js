let pontuacao = JSON.parse(localStorage.getItem('pontuacao')) || { Vitor: 0, Matheus: 0 };
let historico = JSON.parse(localStorage.getItem('historico')) || [];

window.onload = function () {
    atualizarRanking();
    carregarHistorico();
};

function configurarPartida() {
    let partida = document.getElementById('partida').value.trim();

    if (!partida.includes('x')) {
        alert('Formato inválido. Use "TimeA x TimeB"');
        return;
    }

    let times = partida.split('x').map(t => t.trim());

    document.getElementById('palpite-vitor').innerHTML = gerarInputs('vitor', times);
    document.getElementById('palpite-matheus').innerHTML = gerarInputs('matheus', times);
    document.getElementById('resultado-partida').innerHTML = gerarInputs('resultado', times);

    document.getElementById('painel-palpites').style.display = 'block';
    document.getElementById('painel-resultado').style.display = 'block';
}

function gerarInputs(prefixo, times) {
    if (prefixo === 'resultado') {
        return `${times[0]}: <input type="number" id="resultado-time1" min="0" max="10"> 
                x <input type="number" id="resultado-time2" min="0" max="10"> ${times[1]}`;
    } else {
        return `${times[0]} (Realista): <input type="number" id="${prefixo}-real-time1" min="0" max="10"> 
                x <input type="number" id="${prefixo}-real-time2" min="0" max="10"> ${times[1]}<br>
                ${times[0]} (Torcedor): <input type="number" id="${prefixo}-torcedor-time1" min="0" max="10"> 
                x <input type="number" id="${prefixo}-torcedor-time2" min="0" max="10"> ${times[1]}`;
    }
}

function registrarPalpites() {
    let partida = document.getElementById('partida').value.trim();

    let novoJogo = {
        partida,
        Vitor: {
            torcedor: pegarPlacar('vitor-torcedor-time1', 'vitor-torcedor-time2'),
            realista: pegarPlacar('vitor-real-time1', 'vitor-real-time2')
        },
        Matheus: {
            torcedor: pegarPlacar('matheus-torcedor-time1', 'matheus-torcedor-time2'),
            realista: pegarPlacar('matheus-real-time1', 'matheus-real-time2')
        },
        resultado: null
    };

    historico.push(novoJogo);
    localStorage.setItem('historico', JSON.stringify(historico));

    alert('Palpites registrados!');
    carregarHistorico(); // Atualiza a tabela imediatamente
}

function registrarResultado() {
    let resultado = pegarPlacar('resultado-time1', 'resultado-time2');
    if (!validarPlacar(resultado)) {
        alert('Placar inválido!');
        return;
    }

    let partida = document.getElementById('partida').value.trim();
    let jogo = historico.find(j => j.partida === partida);

    if (jogo) {
        jogo.resultado = resultado;
        let pontuou = [];

        for (let user of ['Vitor', 'Matheus']) {
            if (comparaPlacar(resultado, jogo[user].torcedor)) {
                pontuacao[user]++;
                pontuou.push(`${user} acertou o palpite TORCEDOR!`);
            }
            if (comparaPlacar(resultado, jogo[user].realista)) {
                pontuacao[user]++;
                pontuou.push(`${user} acertou o palpite REALISTA!`);
            }
        }

        if (pontuou.length > 0) {
            alert(pontuou.join("\n"));
        } else {
            alert("Ninguém acertou o palpite.");
        }

        localStorage.setItem('pontuacao', JSON.stringify(pontuacao));
        localStorage.setItem('historico', JSON.stringify(historico));

        atualizarRanking();
        carregarHistorico();
    } else {
        alert('Erro: Partida não encontrada no histórico.');
    }
}

function pegarPlacar(id1, id2) {
    return {
        time1: parseInt(document.getElementById(id1).value) || 0,
        time2: parseInt(document.getElementById(id2).value) || 0
    };
}

function validarPlacar(placar) {
    return placar.time1 >= 0 && placar.time1 <= 10 && placar.time2 >= 0 && placar.time2 <= 10;
}

function comparaPlacar(p1, p2) {
    return p1.time1 === p2.time1 && p1.time2 === p2.time2;
}

function atualizarRanking() {
    document.getElementById('ranking').innerText = `Vitor: ${pontuacao.Vitor} pts | Matheus: ${pontuacao.Matheus} pts`;
}

function carregarHistorico() {
    let tabela = document.getElementById('historico');
    tabela.innerHTML = `
        <tr>
            <th>Partida</th>
            <th>Vitor (Torcedor / Realista)</th>
            <th>Matheus (Torcedor / Realista)</th>
            <th>Resultado</th>
        </tr>
    `;

    historico.forEach(jogo => {
        let resultado = jogo.resultado ? `${jogo.resultado.time1} x ${jogo.resultado.time2}` : "Aguardando";
        tabela.innerHTML += `
            <tr>
                <td>${jogo.partida}</td>
                <td>
                    ${jogo.Vitor.torcedor.time1}x${jogo.Vitor.torcedor.time2} (Torcedor) <br> 
                    ${jogo.Vitor.realista.time1}x${jogo.Vitor.realista.time2} (Realista)
                </td>
                <td>
                    ${jogo.Matheus.torcedor.time1}x${jogo.Matheus.torcedor.time2} (Torcedor) <br> 
                    ${jogo.Matheus.realista.time1}x${jogo.Matheus.realista.time2} (Realista)
                </td>
                <td>${resultado}</td>
            </tr>
        `;
    });
}
