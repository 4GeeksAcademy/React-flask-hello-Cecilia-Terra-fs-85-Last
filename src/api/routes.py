"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)



@api.route('/user', methods=['GET'])
def handle_hello():

    response_body = {
        "msg": "Hello, this is your GET /user response "
    }

    return jsonify(response_body), 200


# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.
@api.route("/login", methods=["POST"])
def login():
    try:
        email = request.json.get("email", None)
        password = request.json.get("password", None)
        user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one()

        if email == user.email and password == user.password:
             access_token = create_access_token(identity=email)
             return jsonify(access_token=access_token), 200
        else:
            return jsonify({"msg": "Bad email or password"}), 401
       
    except:
         return jsonify({"msg": "Not found"}), 404


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.
@api.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    print(current_user)
    return jsonify(logged_in_as=current_user), 200


#verificamos si el token existe
@api.route("/token-verify", methods=["GET"])
@jwt_required()#seguiridad
def token_verify():#defino token verify, si el token aparece, es correcto
    return jsonify({"msg": "Token is valid"}), 200




#crear un nuevo registro de usuario, le pido email y contraseña, no puede haber dos iguales
@api.route("/signup", methods=["POST"])
def signup():
    try:
        email = request.json.get("email", None)
        password = request.json.get("password", None)

        if not email or not password:
            return jsonify({"msg": "Email and password are required"}), 400

        # Verificar si el usuario ya existe
        existing_user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()#buscar un email unico, si existe, doy error
        if existing_user:
            return jsonify({"msg": "User already exists"}), 400

        # Crear nuevo usuario
        new_user = User(email=email, password=password)  
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"msg": "Error creating user", "error": str(e)}), 500
