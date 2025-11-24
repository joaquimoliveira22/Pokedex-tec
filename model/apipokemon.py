import requests

def buscar_pokemon(nome_pokemon):
    url = f"https://pokeapi.co/api/v2/pokemon/{nome_pokemon.lower()}"
    response = requests.get(url)

    if response.status_code != 200:
        return {"erro": "Pokémon não encontrado."}

    data = response.json()

    return {
        "nome": data["name"].capitalize(),
        "imagem": data["sprites"]["other"]["official-artwork"]["front_default"],
        "tipos": [t["type"]["name"] for t in data["types"]],
        "ataques": [m["move"]["name"] for m in data["moves"]][:10]
    }

