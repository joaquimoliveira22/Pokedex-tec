import requests

def buscar_pokemon(nome_pokemon):
    url = f"https://pokeapi.co/api/v2/pokemon/{nome_pokemon.lower()}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        # Nome
        print(f"\n=== {data['name'].capitalize()} ===")

        # Imagem oficial
        imagem = data["sprites"]["other"]["official-artwork"]["front_default"]
        print(f"Imagem: {imagem}")

        # Tipos
        tipos = [t["type"]["name"] for t in data["types"]]
        print(f"Tipo(s): {', '.join(tipos)}")

        # Ataques (lista de moves)
        ataques = [m["move"]["name"] for m in data["moves"]]
        print(f"Ataques ({len(ataques)}):")
        for ataque in ataques[:10]: 
            print(f"  - {ataque}")

    else:
        print("Pokémon não encontrado. Verifique o nome e tente novamente.")
    return nome_pokemon


