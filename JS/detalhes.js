document.addEventListener("DOMContentLoaded", function () {
    const detalhesContainer = document.getElementById("detalhes-container");

    // Obtém o ID do jogo da URL
    const urlParams = new URLSearchParams(window.location.search);
    const jogoId = urlParams.get("id");

    // Carrega os dados dos jogos
    fetch("jogos.json")
        .then(response => response.json())
        .then(jogos => {
            const jogo = jogos.find(j => j.id == jogoId);
            if (jogo) {
                detalhesContainer.innerHTML = `
                    <div class="detalhes-jogo">
                        <img src="${jogo.imagem}" alt="${jogo.nome}">
                        <h1>${jogo.nome}</h1>
                        <p class="valor">${jogo.valor}</p>
                        <button class="btn-comprar">Comprar</button>
                        <p class="sinopse">${jogo.sinopse}</p>
                        <p class="avaliacoes">Avaliação: ${jogo.avaliacoes}/5</p>
                    </div>
                `;
            } else {
                detalhesContainer.innerHTML = "<p>Jogo não encontrado.</p>";
            }
        })
        .catch(error => console.error("Erro ao carregar os detalhes do jogo:", error));
});