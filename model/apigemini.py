from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

MINHA_CHAVE = os.getenv("gemini_key")

try:
    client = genai.Client(api_key=MINHA_CHAVE)
    print("Cliente Gemini inicializado no módulo apigemini.")

except Exception as e:
    client = None
    print(f"AVISO: Cliente Gemini não inicializado. Erro: {e}")

def gerar_descricao_pokemon(pokemon_name, types): 
    "Gera uma descrição para o Pokémon usando o Gemini."
    if not client:
        return "Serviço Gemini não disponível. Verifique a chave de API."

    types_str = " e ".join(types)
    
    prompt = f"Gere uma descrição divertida, criativa e aleatória (máximo de 3 frases) para o Pokémon {pokemon_name}, que é do(s) tipo(s) {types_str}. Adicione um fato curioso ou uma mini-história sobre ele."

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt
        )
        return response.text.strip()
        
    except Exception as e:
        print(f"Erro ao gerar conteúdo com Gemini para {pokemon_name}: {e}")
        return "Não foi possível gerar a descrição do Gemini no momento."
