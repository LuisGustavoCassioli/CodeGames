document.addEventListener("DOMContentLoaded", function () {
    // Verifica se o usuário está logado
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const listaCompras = document.getElementById("lista-compras");

    if (!listaCompras) {
        console.error("Elemento 'lista-compras' não encontrado.");
        return;
    }

    if (usuarioLogado) {
        // Exibe o e-mail do usuário logado
        const userInfo = document.getElementById("userInfo");
        if (userInfo) {
            userInfo.textContent = `Olá, ${usuarioLogado.email}`;
        }

        // Verifica se há compras para exibir
        if (usuarioLogado.compras && usuarioLogado.compras.length > 0) {
            usuarioLogado.compras.forEach(jogo => {
                const item = document.createElement("div");
                item.className = "card";
                item.innerHTML = `
                    <img src="${jogo.imagem}" alt="${jogo.nome}">
                    <h2>${jogo.nome}</h2>
                    <p>Valor: ${jogo.valor}</p>
                `;
                listaCompras.appendChild(item);
            });
        } else {
            // Mensagem caso não haja compras
            listaCompras.innerHTML = "<p>Você ainda não comprou nenhum jogo.</p>";
        }
    } else {
        // Redireciona para a página de login se o usuário não estiver logado
        console.log("Usuário não logado. Redirecionando para login.html...");
        window.location.href = "login.html";
    }
});