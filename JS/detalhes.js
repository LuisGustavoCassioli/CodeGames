// Função para gerar key aleatória (adicionada no início do arquivo)
function gerarKeyAleatoria() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    const partes = [4, 4, 4, 4]; // Formato: XXXX-XXXX-XXXX-XXXX
    
    for (let i = 0; i < partes.length; i++) {
        for (let j = 0; j < partes[i]; j++) {
            key += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        if (i < partes.length - 1) key += '-';
    }
    
    return key;
}

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

function comprarJogo(jogoId, botaoCompra) {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        alert("Faça login para comprar jogos.");
        window.location.href = "login.html";
        return;
    }

    fetch("jogos.json")
        .then(response => response.json())
        .then(jogos => {
            const jogoComprado = jogos.find(jogo => jogo.id == jogoId);

            if (jogoComprado) {
                // Inicializa array de compras se não existir
                if (!usuarioLogado.compras) {
                    usuarioLogado.compras = [];
                }

                // Verifica se o jogo já foi comprado
                const jogoJaComprado = usuarioLogado.compras.some(compra => compra.id == jogoId);
                if (jogoJaComprado) {
                    alert("Você já comprou este jogo.");
                    return;
                }

                // Gera uma key única para esta compra
                const key = gerarKeyAleatoria();
                
                // Cria o objeto de compra com a key
                const compra = {
                    ...jogoComprado,
                    dataCompra: new Date().toISOString(),
                    key: key
                };

                // Adiciona a compra ao usuário
                usuarioLogado.compras.push(compra);

                // Atualiza o LocalStorage
                const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
                const usuarioIndex = usuarios.findIndex(usuario => usuario.email === usuarioLogado.email);
                
                if (usuarioIndex !== -1) {
                    usuarios[usuarioIndex] = usuarioLogado;
                } else {
                    usuarios.push(usuarioLogado);
                }
                
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
                localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));

                // Feedback visual
                botaoCompra.disabled = true;
                botaoCompra.textContent = "Comprado";
                const mensagemSucesso = botaoCompra.nextElementSibling;
                if (mensagemSucesso) {
                    mensagemSucesso.style.display = "block";
                }
                
                // Exibe a key para o usuário
                alert(`Compra realizada com sucesso!\nSua key de ativação: ${key}\nAnote e guarde em local seguro.`);
            } else {
                alert("Jogo não encontrado.");
            }
        })
        .catch(error => {
            console.error("Erro ao carregar os jogos:", error);
            alert("Ocorreu um erro ao processar sua compra.");
        });
}