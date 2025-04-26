document.addEventListener("DOMContentLoaded", function () {
    const gamesContainer = document.getElementById("games-container");
    if (gamesContainer) {
        carregarJogos(gamesContainer);
    }

    const searchInput = document.getElementById("search");
    const searchResults = document.getElementById("search-results");

    if (searchInput && searchResults) {
        if (typeof Fuse === "undefined") {
            console.error("Fuse.js não foi carregado corretamente.");
            return;
        }

        configurarBusca(searchInput, searchResults);
    }
});

function carregarJogos(container) {
    fetch("jogos.json")
        .then(response => response.json())
        .then(jogos => {
            jogos.forEach(jogo => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <a href="detalhes.html?id=${jogo.id}">
                        <img src="${jogo.imagem}" alt="${jogo.nome}">
                        <h2>${jogo.nome}</h2>
                    </a>
                `;
                container.appendChild(card);
            });
        })
        .catch(error => console.error("Erro ao carregar os jogos:", error));
}

function configurarBusca(searchInput, searchResults) {
    let jogos = [];

    fetch("jogos.json")
        .then(response => response.json())
        .then(data => {
            jogos = data;

            const fuse = new Fuse(jogos, {
                keys: ["nome", "genero", "sinopse"],
                includeScore: true,
                threshold: 0.3,
            });

            searchInput.addEventListener("input", function () {
                const termo = this.value.trim();
                if (termo.length > 0) {
                    const resultados = fuse.search(termo);
                    exibirResultados(resultados, searchResults);
                } else {
                    searchResults.style.display = "none";
                }
            });
        })
        .catch(error => console.error("Erro ao carregar os jogos:", error));

    document.addEventListener("click", function (event) {
        if (!searchInput.contains(event.target)) {
            searchResults.style.display = "none";
        }
    });
}

function exibirResultados(resultados, container) {
    container.innerHTML = "";

    if (resultados.length > 0) {
        resultados.forEach(resultado => {
            const jogo = resultado.item;
            const item = document.createElement("div");
            item.className = "result-item";
            item.textContent = jogo.nome;
            item.addEventListener("click", () => {
                window.location.href = `detalhes.html?id=${jogo.id}`;
            });
            container.appendChild(item);
        });
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }
}

// Atualiza o ano no copyright
document.getElementById("current-year").textContent = new Date().getFullYear();

 // Verifica se o usuário já aceitou os cookies
 if (!localStorage.getItem('cookies-accepted')) {
    document.getElementById('cookie-popup').style.display = 'block';
  }

  // Botão "Aceitar"
  document.getElementById('accept-cookies').addEventListener('click', function() {
    localStorage.setItem('cookies-accepted', 'true');
    document.getElementById('cookie-popup').style.display = 'none';
    // Aqui você pode adicionar cookies reais se necessário
  });

  // Botão "Recusar"
  document.getElementById('reject-cookies').addEventListener('click', function() {
    document.getElementById('cookie-popup').style.display = 'none';
    // Opcional: Armazenar preferência de rejeição
    localStorage.setItem('cookies-accepted', 'false');
  });

  function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const contador = document.getElementById("carrinhoContador");
    if (contador) {
        contador.textContent = carrinho.length;
        contador.style.display = carrinho.length > 0 ? "flex" : "none";
    }
}