# controllers/cliente/cotizaciones_controller.py

from flask import Blueprint, render_template

cotizaciones_bp = Blueprint(
    'cotizaciones', __name__,
    template_folder='templates',
    static_folder='static',
    url_prefix='/cliente'
)

@cotizaciones_bp.route('/cotizaciones')
def home():
    return render_template('Cotizaciones.html')

@cotizaciones_bp.route('/inicio')
def inicio():
    return render_template('index.html')

@cotizaciones_bp.route('/login')
def login():
    return render_template('login.html')
