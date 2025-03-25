# Jogo da Velha (Tic Tac Toe)

Este é um simples **Jogo da Velha (Tic Tac Toe)** feito com HTML, CSS e JavaScript. O jogo permite dois jogadores jogarem alternadamente. O placar é mantido no **sessionStorage**, e você pode reiniciar a partida sem perder o progresso do placar.

## Funcionalidades

- Dois jogadores alternam entre as jogadas com as marcas **X** e **O**.
- O jogo verifica automaticamente se algum jogador venceu ou se houve empate.
- O placar é mantido entre as partidas utilizando o **sessionStorage** do navegador.
- Após o fim de uma partida, o jogo pergunta ao usuário se deseja jogar novamente sem zerar o placar.

## Como Usar

1. Clone ou baixe o repositório para seu computador.
2. Abra o arquivo `index.html` em um navegador de sua escolha.
3. Jogue clicando nos botões do tabuleiro, alternando entre os jogadores **X** e **O**.
4. O jogo automaticamente exibirá uma caixa de diálogo perguntando se deseja jogar novamente após o fim de cada partida.
5. O placar será salvo no **sessionStorage**, então mesmo que o navegador seja fechado e reaberto, o placar continuará de onde parou.

## Estrutura do Projeto

- `index.html`: O arquivo HTML com a estrutura do jogo.
- `style.css`: Arquivo de estilo que define a aparência do tabuleiro e dos botões.
- `script.js`: O arquivo JavaScript que contém a lógica do jogo, o controle do placar e a interação dos botões.

## Funcionalidades do JavaScript

### 1. **Variáveis Iniciais**
O JavaScript começa com algumas variáveis importantes para o funcionamento do jogo:

```javascript
let tabuleiro = ['', '', '', '', '', '', '', '', '']; // Tabuleiro vazio
let vezJogador = 'X'; // Começa com o jogador X
let jogoAtivo = true; // O jogo começa ativo
let placar = JSON.parse(sessionStorage.getItem('placar')) || { jogador1: 0, jogador2: 0 }; // Carrega o placar ou inicia com 0
```

- `tabuleiro`: Um array com 9 elementos representando as 9 células do tabuleiro.
- `vezJogador`: Marca o jogador atual (`'X'` ou `'O'`).
- `jogoAtivo`: Define se o jogo está em andamento ou se terminou.
- `placar`: Objeto que mantém o placar dos jogadores. Carrega o valor do **sessionStorage**, ou inicializa com `0`.

### 2. **Configuração dos Botões e Eventos de Clique**
Os botões do tabuleiro são configurados com o seguinte código:

```javascript
const botoes = document.querySelectorAll('button[data-pos]');
botoes.forEach(botao => {
    botao.addEventListener('click', (e) => {
        const posicao = e.target.dataset.pos;
        jogar(posicao);
    });
});
```

- `botoes`: Seleciona todos os botões do tabuleiro.
- Adiciona um evento de clique a cada botão, que chama a função `jogar` passando a posição do botão clicado.

### 3. **Função `jogar`**
A função principal do jogo que lida com as jogadas dos jogadores:

```javascript
function jogar(posicao) {
    if (tabuleiro[posicao] || !jogoAtivo) return; // Se a célula já estiver preenchida ou o jogo estiver terminado, nada acontece

    tabuleiro[posicao] = vezJogador;
    document.querySelector(`button[data-pos='${posicao}']`).textContent = vezJogador;

    const resultado = verificarVitoria();

    if (resultado) {
        jogoAtivo = false; // Finaliza o jogo
        if (resultado === 'X') {
            placar.jogador1++;
        } else if (resultado === 'O') {
            placar.jogador2++;
        } else {
            placar.jogador1++;
            placar.jogador2++;
        }
        sessionStorage.setItem('placar', JSON.stringify(placar)); // Atualiza o placar no sessionStorage
        atualizarPlacar(); // Atualiza o placar na interface
        
        // Aguarda 2 segundos antes de desabilitar os botões e perguntar se deseja jogar novamente
        setTimeout(() => {
            desabilitarBotoes(); // Desabilita os botões
            
            // Identificar o vencedor e mostrar na mensagem de confirmação
            let vencedor = resultado === 'empate' ? 'Empate' : (resultado === 'X' ? 'Jogador 1 (X)' : 'Jogador 2 (O)');
            
            // Exibe a caixa de diálogo perguntando se o jogador quer jogar novamente, mostrando o vencedor
            if (window.confirm(`O jogo terminou! ${vencedor} ganhou. Quer jogar novamente?`)) {
                reiniciarJogo(); // Reinicia a partida sem alterar o placar
            }
        }, 2000); // Espera 2 segundos antes de mostrar a mensagem de reinício

        return;
    }

    // Alterna entre os jogadores
    vezJogador = vezJogador === 'X' ? 'O' : 'X';
}
```

- **`jogar`**: Atualiza o tabuleiro com a jogada do jogador e verifica se houve vitória ou empate. Se o jogo terminou, ele desabilita os botões e exibe uma caixa de diálogo perguntando se o jogador quer jogar novamente.

### 4. **Função `verificarVitoria`**
Verifica se há uma combinação vencedora:

```javascript
function verificarVitoria() {
    const combinacoes = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < combinacoes.length; i++) {
        const [a, b, c] = combinacoes[i];
        if (tabuleiro[a] && tabuleiro[a] === tabuleiro[b] && tabuleiro[a] === tabuleiro[c]) {
            return tabuleiro[a]; // Retorna 'X' ou 'O'
        }
    }

    return tabuleiro.includes('') ? null : 'empate'; // Se não houver vitória e não houver mais espaços, é empate
}
```

- **`verificarVitoria`**: Verifica todas as combinações possíveis no tabuleiro para determinar se um jogador venceu ou se houve empate.

### 5. **Funções para Atualizar o Placar e Reiniciar o Jogo**
O placar é atualizado e o jogo pode ser reiniciado sem resetar o placar:

```javascript
function atualizarPlacar() {
    placarElementos[0].textContent = placar.jogador1;
    placarElementos[1].textContent = placar.jogador2;
    sessionStorage.setItem('placar', JSON.stringify(placar)); // Salva o placar no sessionStorage
}

function reiniciarJogo() {
    tabuleiro = ['', '', '', '', '', '', '', '', '']; // Limpa o tabuleiro
    vezJogador = 'X'; // Reseta a vez do jogador para 'X'
    jogoAtivo = true; // O jogo volta a estar ativo

    botoes.forEach(botao => {
        botao.textContent = ''; // Limpa o texto dos botões
    });

    habilitarBotoes(); // Habilita os botões novamente
}
```

- **`atualizarPlacar`**: Atualiza a interface com o placar atual.
- **`reiniciarJogo`**: Reseta o tabuleiro e permite que um novo jogo comece sem zerar o placar.

## Como o Placar é Armazenado

O placar é armazenado no **sessionStorage**, o que permite que ele seja mantido enquanto a página estiver aberta ou até que o navegador seja fechado. O `sessionStorage` é uma API que armazena dados na sessão atual do navegador, garantindo que o placar não se perca entre as jogadas.

## Conclusão

Esse projeto é uma implementação simples de um jogo da velha com uma interface de usuário simples e lógica de jogo no navegador. O uso de **sessionStorage** para armazenar o placar permite uma experiência contínua sem perder o progresso do jogo entre as partidas.

Se você tiver dúvidas ou sugestões de melhorias, sinta-se à vontade para abrir uma **issue** ou **pull request**.

---

Com esse **README**, seu aluno ou qualquer usuário do projeto pode entender como o jogo funciona e como as principais funções JavaScript são usadas.
