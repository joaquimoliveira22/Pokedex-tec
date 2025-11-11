import requests
import random

def buscar_pokemons_por_tipo(tipo):
    url = f"https://pokeapi.co/api/v2/type/{tipo.lower().strip()}"
    resposta = requests.get(url)

    if resposta.status_code != 200:
        print(f"Tipo '{tipo}' não encontrado.")
        return

    dados = resposta.json()
    pokemons = dados["pokemon"]

    # pega 5 pokemons aleatorios
    quantidade = min(5, len(pokemons))
    pokemons_aleatorios = random.sample(pokemons, quantidade)

    print(f"\n=== {quantidade} Pokémon aleatórios do tipo {tipo.capitalize()} ===")

    for i, p in enumerate(pokemons_aleatorios, start=1):
        nome = p["pokemon"]["name"]
        url_pokemon = p["pokemon"]["url"]

        # Faz nova requisição para obter os detalhes e imagem
        info = requests.get(url_pokemon).json()
        imagem = info["sprites"]["other"]["official-artwork"]["front_default"]

        print(f"\n{i}. {nome.capitalize()}")
        print(f"Imagem: {imagem if imagem else 'Sem imagem disponível'}")

    return nome



