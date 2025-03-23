document.addEventListener("DOMContentLoaded", function () {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const listaCompras = document.getElementById("lista-compras");

    if (usuarioLogado) {
        const userInfo = document.getElementById("userInfo");
        userInfo.textContent = `Olá, ${usuarioLogado.email}`;

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
            listaCompras.innerHTML = "<p>Você ainda não comprou nenhum jogo.</p>";
        }
    } else {
        window.location.href = "login.html"; // Redireciona para o login se não estiver logado
    }
});