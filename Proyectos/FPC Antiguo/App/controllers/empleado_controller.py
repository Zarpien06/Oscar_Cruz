from flask import Blueprint, render_template

empleado_bp = Blueprint('empleado_bp', __name__, static_folder='static', template_folder='templates')

@empleado_bp.route('/empleado')
def dashboard_empleado():
    return render_template('empleado/Dashboard.html')
