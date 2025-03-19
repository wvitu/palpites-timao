// Aguarde o carregamento do DOM
document.addEventListener("DOMContentLoaded", function () {

    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCb1jGOtAyVOMq8sqZqNBZozgcxbXRgMUc",
        authDomain: "palpites-timao.firebaseapp.com",
        projectId: "palpites-timao",
        storageBucket: "palpites-timao.appspot.com",
        messagingSenderId: "607746397210",
        appId: "1:607746397210:web:4551600d9f75c63f506da3",
        measurementId: "G-PS4NJDMBTQ"
    };

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    console.log("🔥 Firebase conectado com sucesso!");

    // Estruturas de dados para pontuação e palpites
    let pontuacao = JSON.parse(localStorage.getItem('pontuacao')) || { Vitor: 0, Matheus: 0 };
    let palpites = { Vitor: { torcedor: "", realista: "" }, Matheus: { torcedor: "", realista: "" } };
    let times = [];

    atualizarRanking();

    // ✅ EXPOR AS FUNÇÕES NO ESCOPO GLOBAL
    window.configurarPartida = configurarPartida;
    window.registrarPalpites = registrarPalpites;
    window.registrarResultado = registrarResultado;

    // 🔴 CORREÇÃO: Adiciona um ouvinte de evento no botão "Confirmar Partida"
    document.querySelector("button[onclick='configurarPartida()']").addEventListener("click", configurarPartida);

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
        document.getElementById('palpite-vitor').innerHTML = gerarInputs('vitor');
        document.getElementById('palpite-matheus').innerHTML = gerarInputs('matheus');
    }

    function gerarCamposResultado() {
        document.getElementById('resultado-partida').innerHTML = gerarInputs('resultado');
    }

    function gerarInputs(prefixo) {
        if (prefixo === 'resultado') {
            return `${times[0]}: <input type="number" id="resultado-real-time1" min="0" max="10"> 
                    x <input type="number" id="resultado-real-time2" min="0" max="10"> ${times[1]}<br>`;
        } else {
            return `${times[0]} (Realista): <input type="number" id="${prefixo}-real-time1" min="0" max="10"> 
                    x <input type="number" id="${prefixo}-real-time2" min="0" max="10"> ${times[1]}<br>
                    ${times[0]} (Torcedor): <input type="number" id="${prefixo}-torcedor-time1" min="0" max="10"> 
                    x <input type="number" id="${prefixo}-torcedor-time2" min="0" max="10"> ${times[1]}<br>`;
        }
    }

    async function registrarPalpites() {
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

        try {
            await db.collection("palpites").add(novoJogo);
            alert('✅ Palpites registrados com sucesso!');
        } catch (error) {
            console.error("❌ Erro ao salvar palpites:", error);
        }
    }

    async function registrarResultado() {
        let resultado = pegarPlacar('resultado-real-time1', 'resultado-real-time2');
        if (!validarPlacar(resultado)) {
            alert('Placar inválido!');
            return;
        }

        let partida = document.getElementById('partida').value.trim();
        
        let snapshot = await db.collection("palpites").where("partida", "==", partida).get();
        
        if (snapshot.empty) {
            alert("❌ Erro: Partida não encontrada.");
            return;
        }

        snapshot.forEach(async (doc) => {
            let jogo = doc.data();
            let docRef = db.collection("palpites").doc(doc.id);
            
            await docRef.update({ resultado });

            for (let user of ['Vitor', 'Matheus']) {
                if (comparaPlacar(resultado, jogo[user].torcedor) || comparaPlacar(resultado, jogo[user].realista)) {
                    pontuacao[user]++;
                    alert(`${user} pontuou!`);
                }
            }

            localStorage.setItem('pontuacao', JSON.stringify(pontuacao));
            atualizarRanking();
            carregarHistorico();
        });
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
});
