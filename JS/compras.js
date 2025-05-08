document.addEventListener("DOMContentLoaded", function () {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const listaCompras = document.getElementById("lista-compras");

    if (!listaCompras) {
        console.error("Elemento 'lista-compras' não encontrado.");
        return;
    }

    if (usuarioLogado) {
        const userInfo = document.getElementById("userInfo");
        if (userInfo) {
            userInfo.textContent = `Olá, ${usuarioLogado.email}`;
        }

        // Verifica se há compras e se elas têm keys
        if (usuarioLogado.compras && usuarioLogado.compras.length > 0) {
            listaCompras.innerHTML = '<h2>Suas Compras</h2>';
            
            usuarioLogado.compras.forEach(jogo => {
                // Verifica se a key existe, caso contrário mostra mensagem
                const keyDisplay = jogo.key ? jogo.key : 'Key não disponível';
                const dataDisplay = jogo.dataCompra ? new Date(jogo.dataCompra).toLocaleDateString() : 'Data não disponível';
                
                const item = document.createElement("div");
                item.className = "card-compra";
                item.innerHTML = `
                    <div class="compra-header">
                        <img src="${jogo.imagem || 'ASSETS/default-game.png'}" alt="${jogo.nome || 'Jogo'}">
                        <h3>${jogo.nome || 'Jogo sem nome'}</h3>
                    </div>
                    <div class="compra-detalhes">
                        <p><strong>Data:</strong> ${dataDisplay}</p>
                        <p><strong>Preço:</strong> ${jogo.valor || 'Preço não disponível'}</p>
                        <div class="key-container">
                            <strong>Key:</strong> 
                            <span class="key-value">${keyDisplay}</span>
                            ${jogo.key ? `<button class="btn-copy" data-key="${jogo.key}">Copiar</button>` : ''}
                        </div>
                    </div>
                `;
                listaCompras.appendChild(item);
            });

            // Adiciona evento para copiar keys
            document.querySelectorAll('.btn-copy').forEach(btn => {
                btn.addEventListener('click', function() {
                    const key = this.getAttribute('data-key');
                    navigator.clipboard.writeText(key).then(() => {
                        this.textContent = 'Copiado!';
                        setTimeout(() => {
                            this.textContent = 'Copiar';
                        }, 2000);
                    });
                });
            });
        } else {
            listaCompras.innerHTML = `
                <div class="empty-compras">
                    <i class="fas fa-gamepad"></i>
                    <p>Você ainda não comprou nenhum jogo</p>
                    <a href="Index.html" class="btn">Ver jogos disponíveis</a>
                </div>
            `;
        }
    } else {
        window.location.href = "login.html";
    }
});