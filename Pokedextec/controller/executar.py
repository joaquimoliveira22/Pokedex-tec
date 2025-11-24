from model.apistyles import buscar_pokemons_por_tipo
from model.apipokemon import buscar_pokemon

def executar():
    nome = input("Digite o nome do Pokémon: ")
    buscar_pokemon(nome)
    tipo = input("Digite o tipo de Pokémon: ")
    buscar_pokemons_por_tipo(tipo)
    

    
    