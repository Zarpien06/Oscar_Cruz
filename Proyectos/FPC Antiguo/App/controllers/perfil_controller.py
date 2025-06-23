from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from flask_login import current_user, login_required
import pymysql

perfil_bp = Blueprint('perfil_bp', __name__, template_folder='templates', static_folder='static')

@perfil_bp.route('/perfil', methods=['GET', 'POST'])
@login_required
def perfil():
    # Datos fijos para el perfil (simula la carga de usuario)
    usuario = {
        'nombre_completo': 'Juan Pérez',
        'correo': 'juan.perez@example.com',
        'telefono': '1234567890',
        'numero_identificacion': '12345678'
    }

    if request.method == 'POST':
        # Recoger los datos del formulario
        nuevo_nombre = request.form['nombre']
        nuevo_correo = request.form['correo']
        nuevo_telefono = request.form['telefono']

        # Realizar actualización en la base de datos
        connection = current_app.connection
        cursor = connection.cursor(pymysql.cursors.DictCursor)
        
        try:
            cursor.execute("""
                UPDATE usuarios
                SET nombre_completo = %s, correo = %s, telefono = %s
                WHERE usuario_id = %s
            """, (nuevo_nombre, nuevo_correo, nuevo_telefono, current_user.usuario_id))
            connection.commit()
            flash('Datos actualizados con éxito.', 'success')
        except Exception as e:
            connection.rollback()
            flash(f'Error al actualizar los datos: {e}', 'danger')

        return redirect(url_for('perfil_bp.perfil'))  # Redirige después de guardar los cambios

    return render_template('cliente/perfil.html', usuario=usuario)
