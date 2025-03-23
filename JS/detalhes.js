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
                        <button class="btn-comprar" data-id="${jogo.id}">Comprar</button>
                        <p class="mensagem-sucesso" style="display: none; color: green;">Comprado!</p>
                        <p class="sinopse">${jogo.sinopse}</p>
                        <p class="avaliacoes">Avaliação: ${jogo.avaliacoes}/5</p>
                    </div>
                `;

                // Adiciona evento de compra ao botão
                const botaoCompra = document.querySelector(".btn-comprar");
                botaoCompra.addEventListener("click", function () {
                    const jogoId = this.getAttribute("data-id");
                    comprarJogo(jogoId, this);
                });
            } else {
                detalhesContainer.innerHTML = "<p>Jogo não encontrado.</p>";
            }
        })
        .catch(error => console.error("Erro ao carregar os detalhes do jogo:", error));
});

// Função para comprar um jogo
function comprarJogo(jogoId, botaoCompra) {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        alert("Faça login para comprar jogos.");
        window.location.href = "login.html";
        return;
    }

    // Carrega os jogos disponíveis
    fetch("jogos.json")
        .then(response => response.json())
        .then(jogos => {
            const jogoComprado = jogos.find(jogo => jogo.id == jogoId);

            if (jogoComprado) {
                // Verifica se o jogo já foi comprado
                const jogoJaComprado = usuarioLogado.compras.some(compra => compra.id == jogoId);
                if (jogoJaComprado) {
                    alert("Você já comprou este jogo.");
                    return;
                }

                // Adiciona o jogo ao array de compras do usuário
                usuarioLogado.compras.push(jogoComprado);

                // Atualiza o LocalStorage
                const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
                const usuarioIndex = usuarios.findIndex(usuario => usuario.email === usuarioLogado.email);
                usuarios[usuarioIndex] = usuarioLogado;
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
                localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

                // Feedback visual
                botaoCompra.disabled = true; // Desabilita o botão de compra
                botaoCompra.textContent = "Comprado"; // Altera o texto do botão
                const mensagemSucesso = botaoCompra.nextElementSibling; // Exibe a mensagem de sucesso
                mensagemSucesso.style.display = "block";

                console.log(`${jogoComprado.nome} comprado com sucesso!`);
            } else {
                alert("Jogo não encontrado.");
            }
        })
        .catch(error => console.error("Erro ao carregar os jogos:", error));
}