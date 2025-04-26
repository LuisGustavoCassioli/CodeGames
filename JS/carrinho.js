function adicionarAoCarrinho(jogoId) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    
    if (!carrinho.some(item => item.id === jogoId)) {
        carrinho.push({ id: jogoId });
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        alert("Jogo adicionado ao carrinho!");
        
        if (window.atualizarContadorCarrinho) {
            atualizarContadorCarrinho();
        }
    } else {
        alert("Este jogo já está no seu carrinho.");
    }
}

function removerDoCarrinho(id) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho = carrinho.filter(item => item.id != id);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    alert("Item removido do carrinho.");
    window.location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM carregado. Elementos no main:", document.querySelector("main").innerHTML);
    const carrinhoItens = document.getElementById("carrinho-itens");
    console.log("carrinhoItens:", carrinhoItens);
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const finalizarCompraBtn = document.getElementById("finalizar-compra");

    if (!carrinhoItens) {
        console.error("Elemento 'carrinho-itens' não encontrado no DOM");
        document.querySelector("main").innerHTML = `
            <div class="erro">
                <p>Erro: Não foi possível carregar o carrinho. Contate o suporte.</p>
            </div>
        `;
        return;
    }

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        localStorage.setItem("redirectAfterLogin", "carrinho.html");
        window.location.href = "login.html";
        return;
    }

    const userInfo = document.getElementById("userInfo");
    if (userInfo) {
        userInfo.textContent = `Olá, ${usuarioLogado.email}`;
    }

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    
    if (carrinho.length === 0) {
        carrinhoItens.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
                <a href="index.html" class="btn">Continuar comprando</a>
            </div>
        `;
        const carrinhoResumo = document.querySelector(".carrinho-resumo");
        if (carrinhoResumo) {
            carrinhoResumo.style.display = "none";
        }
        return;
    }

    fetch("jogos.json")
        .then(response => response.json())
        .then(jogos => {
            let subtotal = 0;
            
            carrinhoItens.innerHTML = "";
            
            carrinho.forEach(item => {
                const jogo = jogos.find(j => j.id == item.id);
                if (jogo) {
                    const valorNumerico = parseFloat(jogo.valor.replace("R$ ", "").replace(",", "."));
                    subtotal += valorNumerico;
                    
                    const itemElement = document.createElement("div");
                    itemElement.className = "carrinho-item";
                    itemElement.innerHTML = `
                        <div class="item-imagem">
                            <img src="${jogo.imagem}" alt="${jogo.nome}">
                        </div>
                        <div class="item-info">
                            <h3>${jogo.nome}</h3>
                            <p class="item-preco">${jogo.valor}</p>
                            <div class="item-acoes">
                                <button class="btn-remover" data-id="${jogo.id}">
                                    <i class="fas fa-trash"></i> Remover
                                </button>
                            </div>
                        </div>
                    `;
                    carrinhoItens.appendChild(itemElement);
                }
            });
            
            if (subtotalElement) {
                subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
            }
            if (totalElement) {
                totalElement.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
            }
            
            document.querySelectorAll(".btn-remover").forEach(btn => {
                btn.addEventListener("click", function() {
                    const id = this.getAttribute("data-id");
                    removerDoCarrinho(id);
                });
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os jogos:", error);
            carrinhoItens.innerHTML = `<p>Erro ao carregar os itens do carrinho.</p>`;
        });

    if (finalizarCompraBtn) {
        finalizarCompraBtn.addEventListener("click", function() {
            window.location.href = "checkout.html";
        });
    } else {
        console.error("Botão 'finalizar-compra' não encontrado no DOM");
    }
});