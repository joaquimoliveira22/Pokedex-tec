import requests
import random

# dicionario pra armazenar os tipos de ingles pra portugues
TIPOS_PT_TO_EN = {
    "fogo": "fire",
    "agua": "water",
    "agua2": "water",
    "grama": "grass",
    "eletrico": "electric",
    "eletrico": "electric",
    "voador": "flying",
    "fighting": "fighting",
    "lutador": "fighting",
    "psychic": "psychic",
    "psíquico": "psychic",
    "inseto": "bug",
    "venenoso": "poison",
    "pedra": "rock",
    "terra": "ground",
    "gelo": "ice",
    "fantasma": "ghost",
    "dragao": "dragon",
    "dark": "dark",
    "sombrio": "dark",
    "steel": "steel",
    "aço": "steel",
    "normal": "normal"
}

def _normalizar_tipo(tipo):
    t = tipo.strip().lower()
    return TIPOS_PT_TO_EN.get(t, t) 

def buscar_pokemons_por_tipo(tipo):
    tipo_api = _normalizar_tipo(tipo)
    url = f"https://pokeapi.co/api/v2/type/{tipo_api}"
    resposta = requests.get(url, timeout=10)

    if resposta.status_code != 200:
        return None

    dados = resposta.json()
    pokemons = dados.get("pokemon", [])
    if not pokemons:
        return []

    quantidade = min(5, len(pokemons))
    if len(pokemons) == quantidade:
        pokemons_aleatorios = pokemons
    else:
        pokemons_aleatorios = random.sample(pokemons, quantidade)

    lista = []
    for p in pokemons_aleatorios:
        try:
            info = requests.get(p["pokemon"]["url"], timeout=10).json()
        except Exception:
            continue

        imagem = info.get("sprites", {}) \
                     .get("other", {}) \
                     .get("official-artwork", {}) \
                     .get("front_default")

        lista.append({
            "nome": info.get("name", "").capitalize(),
            # se imagem for None, coloque uma placeholder (opcional)
            "imagem": imagem or "/static/images/placeholder.png",
            "tipos": [t["type"]["name"] for t in info.get("types", [])],
            # opcional: limitar ataques a 6
            "ataques": [m["move"]["name"] for m in info.get("moves", [])][:6]
        })

    return lista
