function aplicarMascaras() {
    const cardNumber = document.getElementById("card-number");
    if (cardNumber) {
        cardNumber.addEventListener("input", function(e) {
            let value = e.target.value.replace(/\D/g, "");
            value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
            e.target.value = value.trim().substring(0, 19);
            identificarBandeira(value);
        });
    }

    const cardExpiry = document.getElementById("card-expiry");
    if (cardExpiry) {
        cardExpiry.addEventListener("input", function(e) {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length > 2) {
                value = value.substring(0, 2) + "/" + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
        });
    }

    const cardCvv = document.getElementById("card-cvv");
    if (cardCvv) {
        cardCvv.addEventListener("input", function(e) {
            e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4);
        });
    }
}

function identificarBandeira(cardNumber) {
    const bandeiras = {
        '^4': 'visa',
        '^5[1-5]': 'mastercard',
        '^3[47]': 'amex',
        '^6(?:011|5)': 'discover'
    };
    cardNumber = cardNumber.replace(/\s/g, "");
    const cardInput = document.getElementById("card-number");
    cardInput.className = '';

    for (const [pattern, bandeira] of Object.entries(bandeiras)) {
        if (new RegExp(pattern).test(cardNumber)) {
            cardInput.className = bandeira;
            break;
        }
    }
}

function gerarQRCodePix() {
    const qrCodeContainer = document.getElementById("pix-qr-code");
    if (!qrCodeContainer) {
        console.error("Contêiner pix-qr-code não encontrado");
        return;
    }
    qrCodeContainer.innerHTML = '';
    
    const pixCode = document.getElementById("pix-code").textContent;
    if (!pixCode) {
        console.error("Código Pix não encontrado");
        return;
    }

    const qrCanvas = document.createElement("div");
    qrCodeContainer.appendChild(qrCanvas);

    // Verificar se QRCode está definido
    if (typeof QRCode === "undefined") {
        console.error("Biblioteca QRCode não carregada. Certifique-se de que qrcode.js está incluído.");
        qrCodeContainer.innerHTML = '<p>Erro: Não foi possível gerar o QR Code. Tente outro método de pagamento.</p>';
        return;
    }

    try {
        new QRCode(qrCanvas, {
            text: pixCode,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch (error) {
        console.error("Erro ao gerar QR Code:", error);
        qrCodeContainer.innerHTML = '<p>Erro ao gerar QR Code</p>';
    }
}

function iniciarTimerPix() {
    let timeLeft = 300;
    const timerElement = document.getElementById("pix-timer");
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.querySelector(".pix-container").innerHTML += `
                <div class="pix-expired">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>QR Code expirado</p>
                    <button id="refresh-pix" class="btn-refresh">Gerar Novo Código</button>
                </div>
            `;
            document.getElementById("refresh-pix").addEventListener("click", () => {
                updatePaymentFields("pix", document.getElementById("payment-details"));
            });
        }
        timeLeft--;
    }, 1000);
}

function copiarCodigoPix() {
    const codigo = document.getElementById("pix-code").textContent;
    navigator.clipboard.writeText(codigo).then(() => {
        const btn = document.getElementById("copy-pix-code");
        btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> Copiar Código';
        }, 2000);
    });
}

function validatePayment(method) {
    switch(method) {
        case "credit":
            return validateCreditCard();
        case "pix":
            return true;
        case "paypal":
            return true;
        default:
            return false;
    }
}

function validateCreditCard() {
    const card = {
        number: document.getElementById("card-number").value.replace(/\s/g, ""),
        name: document.getElementById("card-name").value.trim(),
        expiry: document.getElementById("card-expiry").value,
        cvv: document.getElementById("card-cvv").value
    };

    const errors = [];
    
    if (!/^\d{13,16}$/.test(card.number)) {
        errors.push("Número do cartão inválido (deve ter 13-16 dígitos)");
    } else {
        const bandeiras = {
            '^4': 'Visa',
            '^5[1-5]': 'Mastercard',
            '^3[47]': 'Amex',
            '^6(?:011|5)': 'Discover'
        };
        let validBand = false;
        for (const pattern of Object.keys(bandeiras)) {
            if (new RegExp(pattern).test(card.number)) {
                validBand = true;
                break;
            }
        }
        if (!validBand) errors.push("Bandeira do cartão não suportada");
    }
    
    if (!/^[a-zA-Z\s]{3,}$/.test(card.name)) {
        errors.push("Nome no cartão inválido (mínimo 3 letras)");
    }
    
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
        errors.push("Formato de validade inválido (MM/AA)");
    } else {
        const [month, year] = card.expiry.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (month < 1 || month > 12) errors.push("Mês inválido (01-12)");
        if (year < currentYear || (year == currentYear && month < currentMonth)) {
            errors.push("Cartão expirado");
        }
    }
    
    if (!/^\d{3,4}$/.test(card.cvv)) {
        errors.push("CVV inválido (3 ou 4 dígitos)");
    }
    
    if (errors.length > 0) {
        showValidationErrors(errors);
        return false;
    }
    
    return true;
}

function showValidationErrors(errors) {
    const existingError = document.querySelector(".validation-errors");
    if (existingError) existingError.remove();

    const errorContainer = document.createElement("div");
    errorContainer.className = "validation-errors";
    errorContainer.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Corrija os seguintes erros:</h3>
        <ul>
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    const form = document.getElementById("payment-form");
    form.insertBefore(errorContainer, form.firstChild);
    
    setTimeout(() => {
        errorContainer.remove();
    }, 5000);
}

async function processPayment(method) {
    const paymentForm = document.getElementById("payment-form");
    showLoading(paymentForm);
    
    try {
        const response = await simulatePaymentAPI(method);
        const data = await response.json();

        if (data.status === 'approved') {
            finalizarCompra();
            showSuccessMessage(data, paymentForm);
        } else {
            showErrorMessage(data.message || "Pagamento recusado", paymentForm);
        }
    } catch (error) {
        console.error("Erro na API:", error);
        showErrorMessage("Falha na conexão com o gateway de pagamento", paymentForm);
    }
}

function simulatePaymentAPI(method) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                json: () => ({
                    status: Math.random() > 0.2 ? 'approved' : 'declined',
                    message: Math.random() > 0.2 ? '' : 'Fundos insuficientes',
                    transactionId: 'tx_' + Math.random().toString(36).substr(2, 9)
                })
            });
        }, 1500);
    });
}

function finalizarCompra() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    if (!usuarioLogado || carrinho.length === 0) {
        console.error("Usuário não logado ou carrinho vazio");
        return;
    }

    fetch("jogos.json")
        .then(response => response.json())
        .then(jogos => {
            const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const usuarioIndex = usuarios.findIndex(u => u.email === usuarioLogado.email);
            
            if (usuarioIndex !== -1) {
                carrinho.forEach(item => {
                    const jogo = jogos.find(j => j.id == item.id);
                    if (jogo && !usuarioLogado.compras?.some(c => c.id === item.id)) {
                        const compra = {
                            ...jogo,
                            dataCompra: new Date().toISOString(),
                            key: gerarKeyAleatoria()
                        };
                        
                        if (!usuarioLogado.compras) usuarioLogado.compras = [];
                        usuarioLogado.compras.push(compra);
                    }
                });

                usuarios[usuarioIndex] = usuarioLogado;
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
                localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
                localStorage.setItem("carrinho", JSON.stringify([]));
                
                const contador = document.getElementById("carrinhoContador");
                if (contador) contador.textContent = "0";
            }
        })
        .catch(error => {
            console.error("Erro ao finalizar compra:", error);
        });
}

function gerarKeyAleatoria() {
    return 'XXXX-XXXX-XXXX-XXXX'.replace(/[X]/g, () => {
        return Math.floor(Math.random() * 16).toString(16).toUpperCase();
    });
}

function updatePaymentFields(method, paymentDetails) {
    if (!paymentDetails) {
        console.error("paymentDetails não está definido");
        return;
    }
    paymentDetails.innerHTML = '';
    
    switch(method) {
        case "credit":
            paymentDetails.innerHTML = `
                <div class="form-group">
                    <label for="card-name">Nome no Cartão</label>
                    <input type="text" id="card-name" required>
                </div>
                <div class="form-group">
                    <label for="card-number">Número do Cartão</label>
                    <input type="text" id="card-number" placeholder="0000 0000 0000 0000" required>
                </div>
                <div class="form-group-row">
                    <div class="form-group">
                        <label for="card-expiry">Validade</label>
                        <input type="text" id="card-expiry" placeholder="MM/AA" required>
                    </div>
                    <div class="form-group">
                        <label for="card-cvv">CVV</label>
                        <input type="text" id="card-cvv" placeholder="000" required>
                    </div>
                </div>
            `;
            aplicarMascaras();
            break;
            
        case "pix":
            paymentDetails.innerHTML = `
                <div class="pix-container">
                    <div class="pix-qr-code" id="pix-qr-code"></div>
                    <p class="pix-instruction">Escaneie o QR Code com seu app bancário</p>
                    <div class="pix-timer">
                        <i class="fas fa-clock"></i>
                        <span id="pix-timer">05:00</span>
                    </div>
                    <div class="pix-copy">
                        <button id="copy-pix-code" class="btn-copy">
                            <i class="fas fa-copy"></i> Copiar Código
                        </button>
                        <span id="pix-code">00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-4266554400005204000053039865405${document.getElementById("checkout-total").textContent.replace("R$ ", "").replace(",", ".")}5802BR5913MERCADO PAGO6008BRASILIA62070503***6304A2B3</span>
                    </div>
                </div>
            `;
            gerarQRCodePix();
            iniciarTimerPix();
            document.getElementById("copy-pix-code").addEventListener("click", copiarCodigoPix);
            break;
            
        case "paypal":
            paymentDetails.innerHTML = `
                <div class="paypal-instructions">
                    <p>Você será redirecionado para o PayPal após confirmar a compra</p>
                </div>
            `;
            break;
    }
}

function showLoading(paymentForm) {
    paymentForm.innerHTML = `
        <div class="loading-payment">
            <div class="spinner"></div>
            <p>Processando pagamento...</p>
        </div>
    `;
}

function showSuccessMessage(data, paymentForm) {
    paymentForm.innerHTML = `
        <div class="payment-success">
            <i class="fas fa-check-circle"></i>
            <h2>Pagamento Aprovado!</h2>
            <p>ID da Transação: ${data.transactionId}</p>
            <p>As keys dos jogos estão disponíveis em <a href="compras.html">Minhas Compras</a></p>
            <button id="back-to-store" class="btn-continue">Continuar Comprando</button>
        </div>
    `;
    document.getElementById("back-to-store").addEventListener("click", () => {
        window.location.href = "index.html";
    });
}

function showErrorMessage(message, paymentForm) {
    paymentForm.innerHTML = `
        <div class="payment-error">
            <i class="fas fa-times-circle"></i>
            <h2>Erro no Pagamento</h2>
            <p>${message}</p>
            <button id="try-again" class="btn-retry">Tentar Novamente</button>
        </div>
    `;
    document.getElementById("try-again").addEventListener("click", () => {
        window.location.reload();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
    if (!usuarioLogado) {
        window.location.href = "login.html";
        return;
    }

    const checkoutItens = document.getElementById("checkout-itens");
    const checkoutTotal = document.getElementById("checkout-total");
    const paymentForm = document.getElementById("payment-form");
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const paymentDetails = document.getElementById("payment-details");

    console.log("checkoutItens:", checkoutItens);
    console.log("checkoutTotal:", checkoutTotal);
    console.log("paymentForm:", paymentForm);
    console.log("paymentDetails:", paymentDetails);

    if (!checkoutItens || !checkoutTotal || !paymentForm || !paymentDetails) {
        console.error("Um ou mais elementos do DOM não foram encontrados");
        return;
    }

    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    
    if (carrinho.length === 0) {
        window.location.href = "carrinho.html";
        return;
    }

    fetch("jogos.json")
        .then(response => response.json())
        .then(jogos => {
            let total = 0;
            checkoutItens.innerHTML = '';
            
            carrinho.forEach(item => {
                const jogo = jogos.find(j => j.id == item.id);
                if (jogo) {
                    const valor = parseFloat(jogo.valor.replace("R$ ", "").replace(",", "."));
                    total += valor;
                    
                    checkoutItens.innerHTML += `
                        <div class="checkout-item">
                            <img src="${jogo.imagem}" alt="${jogo.nome}">
                            <div>
                                <h3>${jogo.nome}</h3>
                                <p>${jogo.valor}</p>
                            </div>
                        </div>
                    `;
                }
            });
            
            checkoutTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
        })
        .catch(error => {
            console.error("Erro ao carregar jogos:", error);
            checkoutItens.innerHTML = `<p>Erro ao carregar os itens do carrinho.</p>`;
        });

    paymentMethods.forEach(method => {
        method.addEventListener("change", function() {
            updatePaymentFields(this.value, paymentDetails);
        });
    });

    paymentForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const method = document.querySelector('input[name="payment-method"]:checked').value;
        
        if (validatePayment(method)) {
            processPayment(method);
        }
    });

    updatePaymentFields("credit", paymentDetails);
});