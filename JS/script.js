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
        })
        .catch(error => console.error("Erro ao carregar os jogos:", error));

    // Função para filtrar os jogos
    function filtrarJogos(termo) {
        return jogos.filter(jogo =>
            jogo.nome.toLowerCase().includes(termo.toLowerCase())
        );
    }

    // Função para exibir os resultados da pesquisa
    function exibirResultados(resultados) {
        searchResults.innerHTML = ""; // Limpa os resultados anteriores

        if (resultados.length > 0) {
            resultados.forEach(jogo => {
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
            const resultados = filtrarJogos(termo);
            exibirResultados(resultados);
        } else {
            searchResults.style.display = "none"; // Esconde os resultados se o campo estiver vazio
        }
    });

    // Esconde os resultados ao clicar fora da barra de pesquisa
    document.addEventListener("click", function (event) {
        if (!searchInput.contains(event.target)){
            searchResults.style.display = "none";
        }
    });
});