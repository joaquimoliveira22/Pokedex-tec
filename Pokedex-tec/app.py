from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_sqlalchemy import SQLAlchemy
import jwt
import datetime
import secrets
from functools import wraps
from model.apipokemon import buscar_pokemon
from model.apistyles import buscar_pokemons_por_tipo

app = Flask(__name__)
app.secret_key = "abacaxi123"

# Banco SQLite
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

JWT_SECRET = "SEGREDO_JWT"
JWT_ALGORITHM = "HS256"

# MODEL DO BANCO
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    senha = db.Column(db.String(200), nullable=False)
    token_acesso = db.Column(db.String(200), nullable=True)  # Token único por usuário

    def __repr__(self):
        return f"<Usuario {self.email}>"

# Gera o token do usuario
# token com 64 caracteres de forma aleatoria
def gerar_token_acesso():
    return secrets.token_hex(32)  

# Gera o token da sessão
def gerar_token(email):
    payload = {
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

# Verifica o jwt
def verificar_token(token):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except:
        return None

# exige que faça login
def login_requerido(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        token = session.get("token")
        if not token or not verificar_token(token):
            return redirect(url_for("login"))
        return func(*args, **kwargs)
    return wrapper

# ROTA PRINCIPAL → redireciona ao login
@app.route("/")
def home():
    return redirect(url_for("login"))

# LOGIN
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        senha = request.form.get("senha")

        user = Usuario.query.filter_by(email=email, senha=senha).first()

        if not user:
            return render_template("login.html", erro="Token invalido ou credenciais erradas")

        # Verifica se usuário possui token próprio
        if not user.token_acesso:
            return render_template("login.html", erro="Token invalido")

        # Login permitido → Gera JWT e salva sessão
        token = gerar_token(email)
        session["token"] = token
        session["email"] = email

        return redirect(url_for("index"))

    return render_template("login.html")

# TELA DE CADASTRO
@app.route("/cadastro", methods=["GET"])
def cadastro():
    return render_template("cadastro.html")

# API DE CADASTRO
@app.route("/api/cadastro", methods=["POST"])
def api_cadastro():
    dados = request.get_json()

    nome = dados.get("nome")
    email = dados.get("email")
    senha = dados.get("senha")

    if Usuario.query.filter_by(email=email).first():
        return jsonify({"erro": "E-mail já cadastrado"}), 400

    token_acesso = gerar_token_acesso()

    novo = Usuario(
        nome=nome,
        email=email,
        senha=senha,
        token_acesso=token_acesso
    )

    db.session.add(novo)
    db.session.commit()

    # login automático após cadastro
    token = gerar_token(email)
    session["token"] = token
    session["email"] = email

    return jsonify({"mensagem": "ok", "redirect": "/index"}), 201

# TELA PRINCIPAL
@app.route("/index")
@login_requerido
def index():
    return render_template("index.html")

# LOGOUT
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))

# ROTA PARA VERIFICAR TOKEN JWT
@app.route("/api/dados")
def api_dados():
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        return jsonify({"erro": "Token não enviado"}), 401

    token = auth.split(" ")[1]
    user = verificar_token(token)

    if not user:
        return jsonify({"erro": "Token inválido"}), 401

    return jsonify({"mensagem": "Acesso liberado!", "usuario": user["email"]})

# BUSCA DE POKÉMON OU TIPO
@app.route("/buscar", methods=["POST"])
def buscar():
    modo = request.form.get("mode", "pokemon")
    termo = request.form.get("search", "").strip()

    if not termo:
        return render_template("index.html", resultado={"erro": "Digite um termo para buscar."})

    if modo == "pokemon":
        resultado = buscar_pokemon(termo)
        if resultado is None:
            return render_template("index.html", resultado={"erro": "Pokémon não encontrado."})
        return render_template("index.html", resultado=resultado)

    else:
        lista = buscar_pokemons_por_tipo(termo)
        if lista is None:
            return render_template("index.html", resultado={"erro": "Tipo não encontrado ou erro na API."})
        return render_template("index.html", resultado={"lista": lista})

# CRIA O BANCO SE NÃO EXISTIR
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
