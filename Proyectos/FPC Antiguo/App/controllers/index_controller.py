from flask import Blueprint, render_template

index_bp = Blueprint('index_bp', __name__, static_folder='static', template_folder='templates')

@index_bp.route('/')
def home():
    return render_template('index.html')

@index_bp.route('/login')
def login():
    return render_template('login.html')

@index_bp.route('/cotizaciones')
def cotizaciones():
    return render_template('Cotizaciones.html')

