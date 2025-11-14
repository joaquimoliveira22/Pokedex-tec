// ---------------------------
// CONFIGURAÇÕES
// ---------------------------
const pokeAPI = "https://pokeapi.co/api/v2/";
const modal = new bootstrap.Modal(document.getElementById("pokemonModal"));
const modalBody = document.getElementById("modalBody");
const resultsDiv = document.getElementById("results");

// ---------------------------
// EVENTOS
// ---------------------------
document.getElementById("searchBtn").addEventListener("click", handleSearch);

// ---------------------------
// FUNÇÃO PRINCIPAL
// ---------------------------
async function handleSearch() {
    const searchText = document.getElementById("searchInput").value.trim().toLowerCase();
    const mode = document.querySelector("input[name='mode']:checked").value;

    if (!searchText) {
        alert("Digite algo para pesquisar!");
        return;
    }

    resultsDiv.innerHTML = `<h3 class="text-white">Carregando...</h3>`;

    mode === "pokemon"
        ? searchPokemon(searchText)
        : searchByType(searchText);
}

// ---------------------------
// 1) Buscar Pokémon
// ---------------------------
async function searchPokemon(name) {
    try {
        const response = await axios.get(`${pokeAPI}pokemon/${name}`);
        const p = response.data;
        showPokemon([p]);
        
    } catch (err) {
        resultsDiv.innerHTML = `<h3 class="text-white">Pokémon não encontrado!</h3>`;
    }
}

// ---------------------------
// 2) Buscar Pokémon pelo tipo
// ---------------------------
async function searchByType(type) {
    try {
        const response = await axios.get(`${pokeAPI}type/${type}`);
        const pokemonList = response.data.pokemon.map(p => p.pokemon);
        
        const pokemonPromises = pokemonList.slice(0, 20).map(p => axios.get(p.url));
        const pokemonData = (await Promise.all(pokemonPromises)).map(r => r.data);

        showPokemon(pokemonData);

    } catch (err) {
        resultsDiv.innerHTML = `<h3 class='text-white'>Tipo não encontrado!</h3>`;
    }
}

// ---------------------------
// EXIBE CARDS NO FRONT
// ---------------------------
function showPokemon(pokemonArray) {
    resultsDiv.innerHTML = "";

    pokemonArray.forEach(p => {
        const card = document.createElement("div");
        card.className = "pokemon-card";
        card.innerHTML = `
            <img src="${p.sprites.front_default}" alt="${p.name}">
            <h4>${capitalize(p.name)}</h4>
        `;

        card.addEventListener("click", () => openModal(p));
        resultsDiv.appendChild(card);
    });
}

// ---------------------------
// MODAL DETALHES
// ---------------------------
async function openModal(pokemon) {
    modalBody.innerHTML = `
        <img src="${pokemon.sprites.front_default}" />
        <h2 class="text-center">${capitalize(pokemon.name)}</h2>
        <p class="text-center">Carregando descrição da IA...</p>
    `;

    modal.show();

    const description = await getAIDescription(pokemon.name);

    modalBody.innerHTML = `
        <img src="${pokemon.sprites.front_default}">
        <h2 class="text-center">${capitalize(pokemon.name)}</h2>
        <p class="mt-3">${description}</p>
    `;
}

// ---------------------------
// DESCRIÇÃO POR IA
// ---------------------------
async function getAIDescription(name) {
    try {
        const res = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=SUA_API_KEY_AQUI",
            {
                contents: [{
                    parts: [{
                        text: `Descreva o Pokémon ${name} de forma bonita, envolvente e detalhada.`
                    }]
                }]
            }
        );

        return res.data.candidates[0].content.parts[0].text;

    } catch {
        return "Não foi possível gerar a descrição.";
    }
}

// ---------------------------
// UTILITÁRIOS
// ---------------------------
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// CONTROLE DO POKEBALL LOADER
function showPokeball(message) {
  const el = document.getElementById('pokeballLoader');
  if (!el) return;
  if (message) {
    const txt = el.querySelector('.loader-text');
    if (txt) txt.textContent = message;
  }
  el.style.display = 'flex';
  // lock scroll while loading
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

function hidePokeball() {
  const el = document.getElementById('pokeballLoader');
  if (!el) return;
  el.style.display = 'none';
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

/* Exemplo de integração:
   - No boot sequence: showPokeball('Iniciando Pokédex...'); setTimeout(hidePokeball, 2600);
   - Ao pesquisar: showPokeball('Buscando ' + nome + '...'); depois hidePokeball();
*/

// Exemplo prático (troque pelo seu fluxo de boot)
document.addEventListener('DOMContentLoaded', () => {
  // se quiser usar no boot, descomente:
  // showPokeball('Inicializando Pokédex...');
  // setTimeout(hidePokeball, 2200);
});

