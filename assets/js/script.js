// ─── SONS DAS ABAS ───
const sonsAbas = {
  'aba-roster': new Audio('https://www.myinstants.com/media/sounds/gah-dayum.mp3'),
  'aba-smokes': new Audio('https://www.myinstants.com/media/sounds/bomb-has-been-planted-csgo-cs2.mp3'),
  'aba-midia': new Audio('https://www.myinstants.com/media/sounds/damn-son-whered-you-find-this_2.mp3'),
  'aba-cineratos': new Audio('https://www.myinstants.com/media/sounds/and-the-oscar-goes-to-leonardo-dicaprio-mp3cut.mp3'),
  'aba-receitas': new Audio('https://www.myinstants.com/media/sounds/elefante-sonido.mp3')
};

// ─── LÓGICA DE CARREGAMENTO DINÂMICO DE ABAS ───
function carregarAbaDinamica(idAba, arquivo, evento) {
  // Limpa ativo de todas
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  // Adiciona ativo no botão clicado
  if (evento) {
    evento.target.classList.add('active');
  } else {
    // Caso seja chamado programaticamente no carregamento da página
    const btn = document.querySelector(`button[onclick*="'${arquivo}'"]`);
    if(btn) btn.classList.add('active');
  }

  // Toca o som da aba se existir
  if (sonsAbas[idAba]) {
    sonsAbas[idAba].volume = 0.25; // Volume reduzido para 25%
    sonsAbas[idAba].currentTime = 0;
    sonsAbas[idAba].play().catch(e => console.log("Som bloqueado pelo navegador", e));
  }

  // Busca o arquivo HTML dinamicamente
  fetch(`./assets/pages/${arquivo}.html`)
    .then(response => {
        if (!response.ok) throw new Error('Erro ao carregar a página');
        return response.text();
    })
    .then(html => {
        document.getElementById('conteudo-dinamico').innerHTML = html;
        
        // Se a aba for táticas, reatacha os eventos de clique do mural (Cavalo de Troia)
        if (arquivo === 'taticas') {
            document.querySelectorAll('.mural-card').forEach(card => {
              card.addEventListener('click', () => {
                if (Math.random() < 0.2) {
                  alert("Aviso do Sistema: Seu PC foi infectado pelo Cavalo de Troia do Giginiciu.\\n\\nSeu elo será resetado para o Ferro IV em 5 segundos.");
                }
              });
            });
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('conteudo-dinamico').innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h3 style="color: red; font-family: 'Orbitron';">>_ ERRO DE CORS DETECTADO</h3>
                <p style="color: #aaa; margin-top: 15px;">Para testar o site localmente no seu PC, você precisa abrir usando o <b>Live Server</b>.</p>
                <p style="color: #aaa;">Se abrir dando dois cliques no arquivo (file:///...), os navegadores bloqueiam o carregamento das abas por segurança.</p>
                <p style="color: var(--neon); margin-top: 15px;">No GitHub Pages funcionará perfeitamente!</p>
            </div>
        `;
    });
}

// Carregar a aba Roster automaticamente ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
  carregarAbaDinamica('aba-roster', 'roster', null);
});


// ─── LÓGICA DE FECHAR A DENÚNCIA ───
function fecharCaixa() {
  document.getElementById('caixa-denuncia').style.display = 'none';
}


// ─── LÓGICA DO SEXTÔMETRO CORRIGIDA ───
function atualizaSexta() {
  const agora = new Date();
  const dia = agora.getDay(); // 0 Dom, 1 Seg... 5 Sex, 6 Sab
  const hora = agora.getHours();
  const min = agora.getMinutes();
  const seg = agora.getSeconds();

  let progresso = 0;

  // Se for sexta-feira, se mantém em 100% o dia todo
  if (dia === 5) {
    progresso = 100;
  } else {
    // Começa Sábado (0 dias passados) até Quinta (5 dias passados)
    let diaOffset = dia === 6 ? 0 : dia + 1;

    // Total de horas de Sábado 00:00 até Sexta 00:00 = 144 horas
    let horasPassadas = (diaOffset * 24) + hora + (min / 60) + (seg / 3600);
    progresso = (horasPassadas / 144) * 100;
  }

  document.getElementById('sexta-fill').style.width = Math.min(progresso, 100) + '%';

  if (progresso >= 100) {
    document.getElementById('sexta-text').innerHTML = "<span style='color:var(--neon); font-weight:bold;'>SEXTA INSANA DA RATOS!</span> Manda invite.";
  } else {
    document.getElementById('sexta-text').innerText = `Carregando Sexta: ${progresso.toFixed(4)}%`;
  }
}
setInterval(atualizaSexta, 1000);
atualizaSexta();


// ─── LÓGICA DO RATO CORRENDO E SOM ───
const ratoMascote = document.getElementById('rato-mascote');
let ratoX = -100;
let ratoSpeed = 2.5; // Velocidade inicial
let ratoDirection = 1; // 1 para direita, -1 para esquerda
const clicaRato = new Audio('https://www.myinstants.com/media/sounds/faaah.mp3');

function animateRato() {
  ratoX += ratoSpeed * ratoDirection;

  // Se saiu da tela pela direita
  if (ratoDirection === 1 && ratoX > window.innerWidth + 100) {
    ratoX = -100;
  }
  // Se saiu da tela pela esquerda
  else if (ratoDirection === -1 && ratoX < -100) {
    ratoX = window.innerWidth + 100;
  }

  ratoMascote.style.left = ratoX + 'px';

  // Vira a imagem de acordo com a direção (gif original olha pra direita)
  ratoMascote.style.transform = ratoDirection === 1 ? 'scaleX(1)' : 'scaleX(-1)';

  requestAnimationFrame(animateRato);
}

// Inicia a animação assim que a página carrega
requestAnimationFrame(animateRato);

ratoMascote.addEventListener('click', () => {
  // Toca o som (reseta se já estiver tocando)
  clicaRato.currentTime = 0;
  clicaRato.play();

  // Inverte a direção
  ratoDirection *= -1;

  // Aumenta a velocidade a cada clique
  ratoSpeed += 1.5;
});
