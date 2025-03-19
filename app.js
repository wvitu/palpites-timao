let pontuacao = {
    Vitor: 0,
    Matheus: 0
};

let palpites = {
    Vitor: { torcedor: '', realista: '' },
    Matheus: { torcedor: '', realista: '' }
};

// Carregar do localStorage ao abrir
window.onload = function () {
    if (localStorage.getItem('pontuacao')) {
        pontuacao = JSON.parse(localStorage.getItem('pontuacao'));
        atualizarRanking();
    }
    if (localStorage.getItem('palpites')) {
        palpites = JSON.parse(localStorage.getItem('palpites'));
        preencherInputs();
    }
};

function registrarPalpites() {
    palpites.Vitor.torcedor = document.getElementById('vitor-torcedor').value;
    palpites.Vitor.realista = document.getElementById('vitor-realista').value;
    palpites.Matheus.torcedor = document.getElementById('matheus-torcedor').value;
    palpites.Matheus.realista = document.getElementById('matheus-realista').value;

    localStorage.setItem('palpites', JSON.stringify(palpites));

    alert('Palpites registrados!');
}

function registrarResultado() {
    let resultado = document.getElementById('resultado-real').value.trim();

    for (let user in palpites) {
        if (palpites[user].torcedor === resultado || palpites[user].realista === resultado) {
            pontuacao[user] += 1;
            alert(`${user} pontuou!`);
        }
    }

    localStorage.setItem('pontuacao', JSON.stringify(pontuacao));
    atualizarRanking();
}

function atualizarRanking() {
    document.getElementById('ranking').innerText =
        `Vitor: ${pontuacao.Vitor} pts | Matheus: ${pontuacao.Matheus} pts`;
}

function preencherInputs() {
    document.getElementById('vitor-torcedor').value = palpites.Vitor.torcedor;
    document.getElementById('vitor-realista').value = palpites.Vitor.realista;
    document.getElementById('matheus-torcedor').value = palpites.Matheus.torcedor;
    document.getElementById('matheus-realista').value = palpites.Matheus.realista;
}
