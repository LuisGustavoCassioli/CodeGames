document.addEventListener("DOMContentLoaded", function () {
    const gamesContainer = document.getElementById("games-container");

    // Carrega os dados dos jogos
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
                gamesContainer.appendChild(card);
            });
        })
        .catch(error => console.error("Erro ao carregar os jogos:", error));
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const searchResults = document.getElementById("search-results");

    let jogos = []; // Armazenará a lista de jogos

    // Carrega os dados dos jogos
    fetch("jogos.json")
        .then(response => response.json())
        .then(data => {
            jogos = data; // Armazena os jogos na variável

            // Configura o Fuse.js para busca aproximada
            const fuse = new Fuse(jogos, {
                keys: ["nome", "genero", "sinopse"], // Campo que será usado para a busca
                includeScore: true, // Inclui a pontuação de similaridade
                threshold: 0.3, // Define o limite de similaridade (0 = exato, 1 = qualquer coisa)
            });

            // Função para exibir os resultados da pesquisa
            function exibirResultados(resultados) {
                searchResults.innerHTML = ""; // Limpa os resultados anteriores

                if (resultados.length > 0) {
                    resultados.forEach(resultado => {
                        const jogo = resultado.item; // O jogo correspondente
                        const item = document.createElement("div");
                        item.className = "result-item";
                        item.textContent = jogo.nome;
                        item.addEventListener("click", () => {
                            window.location.href = `detalhes.html?id=${jogo.id}`;
                        });
                        searchResults.appendChild(item);
                    });
                    searchResults.style.display = "block"; // Exibe os resultados
                } else {
                    searchResults.style.display = "none"; // Esconde os resultados se não houver correspondências
                }
            }

            // Evento de input na barra de pesquisa
            searchInput.addEventListener("input", function () {
                const termo = this.value.trim();
                if (termo.length > 0) {
                    const resultados = fuse.search(termo); // Usa o Fuse.js para buscar
                    exibirResultados(resultados);
                } else {
                    searchResults.style.display = "none"; // Esconde os resultados se o campo estiver vazio
                }
            });
        })
        .catch(error => console.error("Erro ao carregar os jogos:", error));

    // Esconde os resultados ao clicar fora da barra de pesquisa
    document.addEventListener("click", function (event) {
        if (!searchInput.contains(event.target)) {
            searchResults.style.display = "none";
        }
    });
});