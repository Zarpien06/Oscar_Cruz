from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, session
from flask_bcrypt import Bcrypt
from datetime import datetime

# Inicializar Bcrypt
bcrypt = Bcrypt()

# Definir el Blueprint
usuarios_bp = Blueprint('usuarios', __name__, template_folder='templates/admin')

# Función auxiliar para hashear contraseñas
def generar_hash(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')

# Guardar (crear o editar) usuario
@usuarios_bp.route('/admin/usuarios/guardar', methods=['POST'])
def guardar_usuario():
    try:
        # Obtención de los datos del formulario
        user_id = request.form.get('user_id')
        nombre_completo = request.form.get('nombre_completo')
        correo = request.form.get('correo')
        telefono = request.form.get('telefono')
        tipo_identificacion = request.form.get('tipo_identificacion')
        numero_identificacion = request.form.get('numero_identificacion')
        password = request.form.get('password')
        rol_id = request.form.get('rol_id')
        estado = request.form.get('estado')

        # Validación de campos obligatorios
        if not nombre_completo or not correo or not tipo_identificacion or not numero_identificacion:
            flash("Por favor completa todos los campos obligatorios", "warning")
            return redirect(url_for('admin_bp.listar_usuarios'))

        # Conectar a la base de datos
        with current_app.connection.cursor(dictionary=True) as cursor:
            if user_id:  # Edición
                # Actualización de datos
                actualizar_usuario(cursor, nombre_completo, correo, telefono, tipo_identificacion,
                                   numero_identificacion, password, rol_id, estado, user_id)
                flash("Usuario actualizado exitosamente", "success")
            else:  # Nuevo usuario
                # Validar existencia de usuario por correo o número de identificación
                if usuario_existe(cursor, correo, numero_identificacion):
                    flash("Ya existe un usuario con ese correo o número de identificación", "danger")
                    return redirect(url_for('admin_bp.listar_usuarios'))

                # Crear usuario
                crear_usuario(cursor, nombre_completo, correo, telefono, tipo_identificacion, 
                              numero_identificacion, password, rol_id, estado)
                flash("Usuario creado exitosamente", "success")

        current_app.connection.commit()
        return redirect(url_for('admin_bp.listar_usuarios'))

    except Exception as e:
        current_app.logger.error(f"Error al guardar usuario: {str(e)}")
        flash("Error al guardar el usuario", "danger")
        return redirect(url_for('admin_bp.listar_usuarios'))

# Función para actualizar usuario
def actualizar_usuario(cursor, nombre_completo, correo, telefono, tipo_identificacion, 
                       numero_identificacion, password, rol_id, estado, user_id):
    if password:
        hashed_password = generar_hash(password)
        query = """
        UPDATE usuarios SET 
            nombre_completo = %s, 
            correo = %s, 
            telefono = %s,
            tipo_identificacion = %s,
            numero_identificacion = %s,
            password_hash = %s, 
            rol_id = %s,
            estado = %s
        WHERE usuario_id = %s
        """
        cursor.execute(query, (nombre_completo, correo, telefono, tipo_identificacion,
                               numero_identificacion, hashed_password, rol_id, estado, user_id))
    else:
        query = """
        UPDATE usuarios SET 
            nombre_completo = %s, 
            correo = %s, 
            telefono = %s,
            tipo_identificacion = %s,
            numero_identificacion = %s,
            rol_id = %s,
            estado = %s
        WHERE usuario_id = %s
        """
        cursor.execute(query, (nombre_completo, correo, telefono, tipo_identificacion,
                               numero_identificacion, rol_id, estado, user_id))

# Función para crear usuario
def crear_usuario(cursor, nombre_completo, correo, telefono, tipo_identificacion, 
                  numero_identificacion, password, rol_id, estado):
    hashed_password = generar_hash(password)
    query = """
    INSERT INTO usuarios 
    (nombre_completo, correo, telefono, tipo_identificacion, 
     numero_identificacion, password_hash, rol_id, estado, fecha_registro) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (nombre_completo, correo, telefono, tipo_identificacion,
                           numero_identificacion, hashed_password, rol_id, estado, datetime.now()))

# Función para verificar si el usuario existe
def usuario_existe(cursor, correo, numero_identificacion):
    cursor.execute("SELECT 1 FROM usuarios WHERE correo = %s OR numero_identificacion = %s", 
                   (correo, numero_identificacion))
    return cursor.fetchone()

# Eliminar usuario
@usuarios_bp.route('/admin/usuarios/eliminar/<int:user_id>', methods=['POST'])
def eliminar_usuario(user_id):
    try:
        with current_app.connection.cursor() as cursor:
            cursor.execute("DELETE FROM usuarios WHERE usuario_id = %s", (user_id,))
        current_app.connection.commit()
        flash("Usuario eliminado exitosamente", "success")
    except Exception as e:
        current_app.logger.error(f"Error al eliminar usuario: {str(e)}")
        flash("Error al eliminar el usuario", "danger")
    return redirect(url_for('admin_bp.listar_usuarios'))