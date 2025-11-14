// auth.js - lógica para login e cadastro (localStorage, múltiplos usuários, validações)

/*
  Estrutura armazenada em localStorage:
  key: "pokedex_users"
  value: JSON.stringify([{ name, email, password } , ...])
*/

// ---------- Helpers ----------
const USERS_KEY = "pokedex_users";

/** Recupera array de usuários do localStorage (ou []) */
function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Erro lendo usuários do localStorage", e);
    return [];
  }
}

/** Salva array de usuários no localStorage */
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/** Mostra mensagem temporária em container (classe: containerElement, tipo 'error' ou 'success') */
function showMessage(containerElement, text, type = "error", timeout = 3200) {
  // remove mensagens antigas
  const prev = containerElement.querySelector(".msg");
  if (prev) prev.remove();

  const div = document.createElement("div");
  div.className = "msg " + (type === "success" ? "success" : "error");
  div.textContent = text;
  containerElement.prepend(div);

  if (timeout) setTimeout(() => div.remove(), timeout);
}

/** Valida email simples */
function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

/** Pega elemento pai .auth-card para mostrar mensagens */
function getCardElement() {
  return document.querySelector(".auth-card");
}

// ---------- Cadastro ----------
function cadastrar() {
  const nomeEl = document.getElementById("cadNome");
  const emailEl = document.getElementById("cadEmail");
  const senhaEl = document.getElementById("cadSenha");
  const card = getCardElement();

  const nome = nomeEl?.value?.trim();
  const email = emailEl?.value?.trim()?.toLowerCase();
  const senha = senhaEl?.value;

  if (!nome || !email || !senha) {
    showMessage(card, "Preencha todos os campos.", "error");
    return;
  }
  if (!isValidEmail(email)) {
    showMessage(card, "Email inválido.", "error");
    return;
  }
  if (senha.length < 4) {
    showMessage(card, "Senha muito curta (mín 4 caracteres).", "error");
    return;
  }

  const users = getStoredUsers();

  // checa se já existe email
  if (users.some(u => u.email === email)) {
    showMessage(card, "Já existe uma conta com esse e-mail.", "error");
    return;
  }

  // adiciona novo usuário
  users.push({ name: nome, email, password: senha });
  saveUsers(users);

  showMessage(card, "Conta criada com sucesso! Redirecionando...", "success", 2000);

  setTimeout(() => {
    window.location.href = "login.html";
  }, 900);
}

// ---------- Login ----------
function login() {
  const emailEl = document.getElementById("loginEmail");
  const senhaEl = document.getElementById("loginPassword");
  const card = getCardElement();

  const email = emailEl?.value?.trim()?.toLowerCase();
  const senha = senhaEl?.value;

  if (!email || !senha) {
    showMessage(card, "Preencha e-mail e senha.", "error");
    return;
  }

  const users = getStoredUsers();
  const user = users.find(u => u.email === email && u.password === senha);

  if (!user) {
    showMessage(card, "E-mail ou senha incorretos.", "error");
    return;
  }

  // Salva sessão simples (apenas para navegação local)
  localStorage.setItem("pokedex_session", JSON.stringify({ email: user.email, name: user.name, loggedAt: Date.now() }));

  showMessage(card, `Bem-vindo, ${user.name}! Entrando...`, "success", 1000);
  setTimeout(() => {
    window.location.href = "index.html";
  }, 900);
}

// ---------- Mostrar/ocultar senha (utilitário para as duas páginas) ----------
function setupPasswordToggles() {
  // procura botões com class pw-toggle e conecta ao input data-target
  const toggles = document.querySelectorAll(".pw-toggle");
  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      if (!targetId) return;
      const input = document.getElementById(targetId);
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      btn.textContent = input.type === "password" ? "Mostrar" : "Ocultar";
    });
  });
}

// ---------- Inicialização quando a página carrega (apenas para auth pages) ----------
document.addEventListener("DOMContentLoaded", () => {
  // Se estiver nas páginas com ids dos campos, conecta botões
  if (document.getElementById("cadNome")) {
    // página de cadastro
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pw-toggle";
    btn.setAttribute("data-target", "cadSenha");
    btn.textContent = "Mostrar";
    // inserir ao lado do campo de senha
    const pwRow = document.querySelector("#cadSenha");
    if (pwRow) {
      // wrap row
      const wrapper = document.createElement("div");
      wrapper.className = "pw-row";
      pwRow.parentNode.insertBefore(wrapper, pwRow);
      wrapper.appendChild(pwRow);
      wrapper.appendChild(btn);
    }
  }

  if (document.getElementById("loginPassword")) {
    // página de login
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pw-toggle";
    btn.setAttribute("data-target", "loginPassword");
    btn.textContent = "Mostrar";
    const pwRow = document.querySelector("#loginPassword");
    if (pwRow) {
      const wrapper = document.createElement("div");
      wrapper.className = "pw-row";
      pwRow.parentNode.insertBefore(wrapper, pwRow);
      wrapper.appendChild(pwRow);
      wrapper.appendChild(btn);
    }
  }

  setupPasswordToggles();
});
