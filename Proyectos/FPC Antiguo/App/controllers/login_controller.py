from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, session
from flask_bcrypt import Bcrypt
from app import bcrypt

login_bp = Blueprint('auth', __name__)

# Funciones auxiliares
def obtener_usuario_por_email(email):
    with current_app.connection.cursor() as cursor:
        cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (email,))
        return cursor.fetchone()

def crear_usuario(nombre_completo, telefono, correo, tipo_identificacion, numero_identificacion, password_hash, rol_id):
    try:
        with current_app.connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO usuarios (nombre_completo, telefono, correo, tipo_identificacion, numero_identificacion, password_hash, rol_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (nombre_completo, telefono, correo, tipo_identificacion, numero_identificacion, password_hash, rol_id))
            current_app.connection.commit()
        return True
    except Exception as e:
        current_app.logger.error(f"Error al crear usuario: {e}")
        return False

# Página de login y registro
@login_bp.route('/login', methods=['GET'])
def login_view():
    return render_template('login.html')

# Registro
@login_bp.route('/register', methods=['POST'])
def register():
    nombre_completo = request.form['username']
    telefono = request.form['phone']
    correo = request.form['email']
    tipo_identificacion = request.form['id_type']
    numero_identificacion = request.form['id_number']
    password = request.form['password']
    rol_id = 3  # Asumiendo que 3 es el ID de rol para clientes
    
    # Verificar si el usuario ya existe
    usuario_existente = obtener_usuario_por_email(correo)
    if usuario_existente:
        flash('Este correo electrónico ya está registrado.', 'error')
        return redirect(url_for('auth.login_view'))
    
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    if crear_usuario(nombre_completo, telefono, correo, tipo_identificacion, numero_identificacion, password_hash, rol_id):
        flash('Registro exitoso. Ahora puedes iniciar sesión.', 'success')
        # Redirigir al login en lugar de directamente al dashboard
        return redirect(url_for('auth.login_view'))
    else:
        flash('Hubo un error al registrar tu cuenta. Por favor, intenta nuevamente.', 'error')
        return redirect(url_for('auth.login_view'))

# Inicio de sesión
@login_bp.route('/login', methods=['POST'])
def login():
    correo = request.form['email']
    password = request.form['password']
    
    usuario = obtener_usuario_por_email(correo)
    
    if usuario and bcrypt.check_password_hash(usuario['password_hash'], password):
        # Guardar información del usuario en la sesión
        session['user_id'] = usuario['usuario_id']
        session['user_name'] = usuario['nombre_completo']
        session['user_email'] = usuario['correo']
        session['user_role'] = usuario['rol_id']
        
        rol_id = usuario['rol_id']
        
        flash('Inicio de sesión exitoso.', 'success')
        
        if rol_id == 1:  # admin
            return redirect(url_for('admin_bp.dashboard'))
        elif rol_id == 2:  # empleado
            return redirect(url_for('empleado.index'))
        elif rol_id == 3:  # cliente
            return redirect(url_for('cliente_bp.dashboard'))
        else:
            flash('Rol desconocido.', 'warning')
            return redirect(url_for('auth.login_view'))
    else:
        flash('Correo o contraseña incorrectos.', 'error')
        return redirect(url_for('auth.login_view'))

# Cerrar sesión
@login_bp.route('/logout')
def logout():
    # Limpiar la sesión
    session.clear()
    flash('Has cerrado sesión correctamente.', 'info')
    return redirect(url_for('auth.login_view'))

