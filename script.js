// Recuperando o placar de sessão ou inicializando
let placar = JSON.parse(sessionStorage.getItem('placar')) || { jogador1: 0, jogador2: 0 };

// Armazenando a posição atual do tabuleiro e a vez do jogador
let tabuleiro = ['', '', '', '', '', '', '', '', '']; // O tabuleiro começa vazio
let vezJogador = 'X'; // Jogador 'X' começa
let jogoAtivo = true; // Variável para verificar se o jogo está em andamento

// Atualiza o placar na tela
function atualizarPlacar() {
    document.querySelector('.jogador1 span').textContent = placar.jogador1;
    document.querySelector('.jogador2 span').textContent = placar.jogador2;
}

// Verifica se alguém venceu
function verificarVitoria() {
    const combinacoes = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6]             // Diagonais
    ];

    // Verifica todas as combinações de vitória
    for (let combinacao of combinacoes) {
        const [a, b, c] = combinacao;
        if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
            return tabuleiro[a]; // Retorna o vencedor ('X' ou 'O')
        }
    }
    // Verifica se houve empate (se todas as células estiverem preenchidas)
    if (!tabuleiro.includes('')) {
        return 'empate';
    }
    return null; // Jogo continua
}

// Atualiza o estado da célula (botão)
function jogar(posicao) {
    if (tabuleiro[posicao] || !jogoAtivo) return; // Se já houver algo ou se o jogo terminou, nada acontece

    tabuleiro[posicao] = vezJogador;
    document.querySelector(`button[data-pos='${posicao}']`).textContent = vezJogador;

    const resultado = verificarVitoria();

    if (resultado) {
        jogoAtivo = false; // Finaliza o jogo
        if (resultado === 'X') {
            placar.jogador1++;
        } else if (resultado === 'O') {
            placar.jogador2++;
        }
        if (resultado === 'empate') {
            alert("Empate!");
        } else {
            alert(`${resultado} venceu!`);
        }
        sessionStorage.setItem('placar', JSON.stringify(placar)); // Atualiza o placar no sessionStorage
        atualizarPlacar();
        return;
    }

    // Alterna o jogador
    vezJogador = vezJogador === 'X' ? 'O' : 'X';
}

// Adiciona os eventos de clique nos botões
document.querySelectorAll('button[data-pos]').forEach(button => {
    button.addEventListener('click', () => {
        const posicao = button.getAttribute('data-pos');
        jogar(posicao);
    });
});

// Inicializa o placar
atualizarPlacar();
