// Função para salvar um usuário no LocalStorage
function cadastrarUsuario(email, senha) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioExistente = usuarios.find(usuario => usuario.email === email);

    if (usuarioExistente) {
        alert("E-mail já cadastrado. Tente outro e-mail.");
        return;
    }

    const novoUsuario = { email, senha };
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
        alert("Login realizado com sucesso!");
        window.location.href = "index.html"; // Redireciona para a página inicial
    } else {
        alert("E-mail ou senha incorretos.");
    }
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