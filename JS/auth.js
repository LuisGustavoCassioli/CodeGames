// Função para salvar um usuário no LocalStorage
function cadastrarUsuario(email, senha) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioExistente = usuarios.find(usuario => usuario.email === email);

    if (usuarioExistente) {
        alert("E-mail já cadastrado. Tente outro e-mail.");
        return;
    }

    const novoUsuario = { email, senha, compras: [] }; // Adiciona um array de compras
    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Cadastro realizado com sucesso! Faça login.");
    window.location.href = "login.html";
}

// Função para autenticar um usuário
function autenticarUsuario(email, senha) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuario = usuarios.find(usuario => usuario.email === email && usuario.senha === senha);

    if (usuario) {
        localStorage.setItem("usuarioLogado", JSON.stringify(usuario)); // Salva o usuário logado
        alert("Login realizado com sucesso!");
        window.location.href = "Index.html"; // Redireciona para a página inicial
    } else {
        alert("E-mail ou senha incorretos.");
    }
}

// Função para exibir o usuário logado na home
// Modifique a função exibirUsuarioLogado
function exibirUsuarioLogado() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const userInfo = document.getElementById("userInfo");
    const loginSection = document.getElementById("loginSection");
    const actionsSection = document.getElementById("actionsSection");

    if (userInfo && loginSection && actionsSection) {
        if (usuarioLogado) {
            userInfo.textContent = `Olá, ${usuarioLogado.email}`;
            loginSection.style.display = "none";
            actionsSection.style.display = "block";
        } else {
            userInfo.textContent = "";
            loginSection.style.display = "block";
            actionsSection.style.display = "none";
        }
    }
    
    // Atualiza o contador do carrinho
    if (window.atualizarContadorCarrinho) {
        atualizarContadorCarrinho();
    }
}

// Função para logout
function logout() {
    localStorage.removeItem("usuarioLogado");
    alert("Você saiu da sua conta.");
    window.location.href = "Index.html";
}

// Evento de cadastro
if (document.getElementById("cadastroForm")) {
    document.getElementById("cadastroForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        cadastrarUsuario(email, senha);
    });
}

// Evento de login
if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;
        autenticarUsuario(email, senha);
    });
}

// Evento de logout
if (document.getElementById("logoutButton")) {
    document.getElementById("logoutButton").addEventListener("click", function () {
        logout();
    });
}

// Exibe o usuário logado ao carregar a página
document.addEventListener("DOMContentLoaded", exibirUsuarioLogado);

// Função para gerar uma key aleatória (já existe no seu auth.js)
function gerarKeyAleatoria() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = '';
    const partes = [4, 4, 4, 4]; // Formato: XXXX-XXXX-XXXX-XXXX
    
    partes.forEach((tamanho, index) => {
        for (let i = 0; i < tamanho; i++) {
            key += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        if (index < partes.length - 1) key += '-';
    });
    
    return key;
}