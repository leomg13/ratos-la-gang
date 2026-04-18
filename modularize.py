import os

with open('ratosStaging.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

os.makedirs('assets/css', exist_ok=True)
os.makedirs('assets/js', exist_ok=True)
os.makedirs('assets/pages', exist_ok=True)

# CSS: Lines 15-757. (Python is 0-indexed, so 14 to 757)
css_lines = lines[15:756]
with open('assets/css/style.css', 'w', encoding='utf-8') as f:
    f.writelines(css_lines)

# JS: Lines 1181-1296. (1181 to 1295)
# We will rewrite the JS logic slightly for dynamic fetch
js_lines = lines[1181:1295]
js_content = "".join(js_lines)

# Remove the old `abrirAba` function
import re
js_content = re.sub(r'function abrirAba\(idAba\).*?\}\n', '', js_content, flags=re.DOTALL)
# Remove the virus logic from global scope
js_content = re.sub(r'// ─── LÓGICA VÍRUS FALSO NO MURAL ───\n.*?\}\);\n    \}\);\n', '', js_content, flags=re.DOTALL)

js_dynamic_loading = """
    // ─── LÓGICA DE CARREGAMENTO DINÂMICO ───
    function carregarAbaDinamica(idAba, arquivo) {
      // Limpa ativo de todas
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      
      // Adiciona ativo no botão clicado
      event.target.classList.add('active');

      // Toca o som da aba se existir
      if (sonsAbas[idAba]) {
        sonsAbas[idAba].volume = 0.25;
        sonsAbas[idAba].currentTime = 0;
        sonsAbas[idAba].play().catch(e => console.log("Som bloqueado pelo navegador", e));
      }

      // Busca o arquivo HTML
      fetch(`./assets/pages/${arquivo}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar a página');
            return response.text();
        })
        .then(html => {
            document.getElementById('conteudo-dinamico').innerHTML = html;
            
            // Re-atachar eventos específicos após o carregamento
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
            document.getElementById('conteudo-dinamico').innerHTML = '<p style="color:red; font-family:Orbitron; padding:20px;">>_ ERRO: Para rodar localmente no seu PC, é necessário usar o "Live Server" devido às regras de segurança (CORS) do navegador.</p>';
        });
    }

    // Carregar a primeira aba por padrão
    window.addEventListener('DOMContentLoaded', () => {
        // Simula o clique na primeira aba
        const primeiraAba = document.querySelector('.tab-btn');
        if(primeiraAba) {
            primeiraAba.click();
        }
    });
"""

js_content = js_content.replace("// ─── LÓGICA DAS ABAS ───", js_dynamic_loading)

with open('assets/js/script.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

# Abas
abas = {
    'roster': (808, 893),
    'taticas': (896, 955),
    'midia': (958, 997),
    'cineratos': (1000, 1059),
    'receitas': (1062, 1125)
}

for name, (start, end) in abas.items():
    # extract inner HTML by skipping the wrapper div lines
    aba_lines = lines[start:end]
    with open(f'assets/pages/{name}.html', 'w', encoding='utf-8') as f:
        f.writelines(aba_lines)

# Now create index.html
# Start from beginning up to before the first tab content (line 806)
index_top = lines[0:14] + ['  <link rel="stylesheet" href="./assets/css/style.css">\n'] + lines[757:800]

# Replace onclick in buttons
tabs_menu = lines[800:807]
new_tabs_menu = []
for line in tabs_menu:
    line = line.replace('onclick="abrirAba(\'aba-roster\')"', 'onclick="carregarAbaDinamica(\'aba-roster\', \'roster\')"')
    line = line.replace('onclick="abrirAba(\'aba-smokes\')"', 'onclick="carregarAbaDinamica(\'aba-smokes\', \'taticas\')"')
    line = line.replace('onclick="abrirAba(\'aba-midia\')"', 'onclick="carregarAbaDinamica(\'aba-midia\', \'midia\')"')
    line = line.replace('onclick="abrirAba(\'aba-cineratos\')"', 'onclick="carregarAbaDinamica(\'aba-cineratos\', \'cineratos\')"')
    line = line.replace('onclick="abrirAba(\'aba-receitas\')"', 'onclick="carregarAbaDinamica(\'aba-receitas\', \'receitas\')"')
    new_tabs_menu.append(line)

index_mid = ['\n    <div id="conteudo-dinamico">\n      <!-- O conteúdo das abas será injetado aqui pelo JS -->\n    </div>\n\n']

# End of tabs is 1126
index_bottom_html = lines[1128:1180] + ['  <script src="./assets/js/script.js" defer></script>\n'] + lines[1296:]

index_lines = index_top + new_tabs_menu + index_mid + index_bottom_html

with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(index_lines)

print("Modularization complete.")
