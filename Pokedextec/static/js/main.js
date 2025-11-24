document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const resultsDiv = document.getElementById("results");

    const modeRadios = document.querySelectorAll("input[name='mode']");
    let searchMode = "pokemon";

    // Detecta se está pesquisando Pokémon ou Tipo
    modeRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            searchMode = radio.value;
        });
    });

    // Clique no botão pesquisar
    searchBtn.addEventListener("click", () => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            alert("Digite algo para pesquisar.");
            return;
        }

        resultsDiv.innerHTML = `<p class="text-center text-light">Carregando...</p>`;

        if (searchMode === "pokemon") {
            buscarPokemon(query);
        } else {
            buscarPorTipo(query);
        }
    });

    
    //  Buscar Pokémon por nome
    
    async function buscarPokemon(nome) {
        try {
            const response = await fetch(`/api/pokemon/${nome}`);
            const data = await response.json();

            if (data.error) {
                resultsDiv.innerHTML = `<p class="text-center text-danger">Pokémon não encontrado!</p>`;
                return;
            }

            exibirPokemon(data);

        } catch (error) {
            console.error("Erro:", error);
            resultsDiv.innerHTML = `<p class="text-danger text-center">Erro ao buscar o Pokémon.</p>`;
        }
    }

  
    //  Buscar Pokémon por tipo
    
    async function buscarPorTipo(tipo) {
        try {
            const response = await fetch(`/api/type/${tipo}`);
            const data = await response.json();

            if (data.error) {
                resultsDiv.innerHTML = `<p class="text-center text-danger">Tipo não encontrado!</p>`;
                return;
            }

            exibirListaPokemons(data.pokemons);

        } catch (error) {
            console.error("Erro:", error);
            resultsDiv.innerHTML = `<p class="text-danger text-center">Erro ao buscar o tipo.</p>`;
        }
    }

    
    //  Exibir Pokémon individual
    
    function exibirPokemon(poke) {
        resultsDiv.innerHTML = `
            <div class="pokemon-card" onclick="abrirModal('${poke.name}')">
                <img src="${poke.image}" alt="${poke.name}">
                <h3>${poke.name.toUpperCase()}</h3>
                <p>ID: ${poke.id}</p>
                <p>Tipo: ${poke.types.join(", ")}</p>
            </div>
        `;
    }

   
    //  Exibir lista de Pokémon (busca por tipo)
    
    function exibirListaPokemons(lista) {
        if (!lista.length) {
            resultsDiv.innerHTML = `<p class="text-center text-warning">Nenhum Pokémon encontrado para esse tipo.</p>`;
            return;
        }

        resultsDiv.innerHTML = "";

        lista.forEach(p => {
            resultsDiv.innerHTML += `
                <div class="pokemon-card" onclick="abrirModal('${p.name}')">
                    <img src="${p.image}" alt="${p.name}">
                    <h3>${p.name.toUpperCase()}</h3>
                </div>
            `;
        });
    }

   
    // Modal com descrição via IA
    
    window.abrirModal = async function (pokemonName) {
        const modalBody = document.getElementById("modalBody");
        modalBody.innerHTML = `<p class="text-center text-light">Carregando...</p>`;

        const modal = new bootstrap.Modal(document.getElementById("pokemonModal"));

        try {
            const res = await fetch(`/api/description/${pokemonName}`);
            const data = await res.json();

            modalBody.innerHTML = `
                <h2 class="text-center">${pokemonName.toUpperCase()}</h2>
                <p class="mt-3">${data.description}</p>
            `;
        } catch {
            modalBody.innerHTML = `<p class="text-danger">Erro ao carregar descrição.</p>`;
        }

        modal.show();
    };
});
