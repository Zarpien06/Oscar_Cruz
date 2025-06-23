from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app, session, jsonify
import pymysql
import os
from datetime import datetime, timedelta 
from werkzeug.utils import secure_filename

cliente_bp = Blueprint('cliente_bp', __name__, static_folder='static', template_folder='templates')

# Función para obtener la conexión a la base de datos
def get_db_connection():
    return current_app.connection

# Función para verificar si el usuario está autenticado y es un cliente
@cliente_bp.before_request
def verificar_cliente():
    # Excluimos la ruta de logout de la verificación
    if request.endpoint and 'logout' in request.endpoint:
        return
    
    if 'user_id' not in session or session.get('user_role') != 3:
        flash('Acceso denegado. Debes iniciar sesión como cliente.', 'error')
        return redirect(url_for('auth.login_view'))

# Dashboard del cliente
@cliente_bp.route('/cliente', endpoint='dashboard')
def dashboard_cliente():
    user_id = session.get('user_id')
    
    # Initialize variables to prevent scope issues
    cliente = None
    vehiculos = []
    reservas = []
    cotizaciones = []
    
    # Obtener información del cliente
    connection = get_db_connection()
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Obtener datos del usuario
            cursor.execute("SELECT * FROM usuarios WHERE usuario_id = %s", (user_id,))
            cliente = cursor.fetchone()
            
            # Obtener vehículos del cliente
            cursor.execute("SELECT * FROM vehiculos WHERE usuario_id = %s", (user_id,))
            vehiculos = cursor.fetchall()
            
            # Obtener reservas del cliente
            cursor.execute("""
                SELECT r.*, v.marca, v.modelo, v.placa 
                FROM reservas r 
                JOIN vehiculos v ON r.vehiculo_id = v.vehiculo_id 
                WHERE r.usuario_id = %s 
                ORDER BY r.fecha DESC
            """, (user_id,))
            reservas = cursor.fetchall()
            
            # Obtener cotizaciones pendientes
            cursor.execute("""
                SELECT c.*, v.marca, v.modelo, v.placa 
                FROM cotizaciones c 
                LEFT JOIN vehiculos v ON c.vehiculo_id = v.vehiculo_id 
                WHERE c.usuario_id = %s AND c.estado = 'Pendiente'
            """, (user_id,))
            cotizaciones = cursor.fetchall()
            
            # Return the template with all the data
            return render_template('cliente/dashboard.html', 
                                  cliente=cliente, 
                                  vehiculos=vehiculos, 
                                  reservas=reservas, 
                                  cotizaciones=cotizaciones)
    except Exception as e:
        flash(f'Error al cargar el dashboard: {str(e)}', 'error')
        # Return the template with initialized variables to avoid scope issues
        return render_template('cliente/dashboard.html',
                              cliente=cliente,
                              vehiculos=vehiculos,
                              reservas=reservas,
                              cotizaciones=cotizaciones)
# Chat con empleados
@cliente_bp.route('/chat/<int:vehiculo_id>', endpoint='chat_vehiculo')
def chat(vehiculo_id):
    user_id = session.get('user_id')
    connection = get_db_connection()
    
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Verificar que el vehículo pertenece al cliente
            cursor.execute("SELECT * FROM vehiculos WHERE vehiculo_id = %s AND usuario_id = %s", 
                          (vehiculo_id, user_id))
            vehiculo = cursor.fetchone()
            
            if not vehiculo:
                flash('No tienes permiso para acceder a este vehículo', 'error')
                return redirect(url_for('cliente_bp.vehiculos'))
            
            # Obtener mensajes del chat
            cursor.execute("""
                SELECT c.*, 
                       u_remitente.nombre_completo as remitente_nombre, 
                       u_receptor.nombre_completo as receptor_nombre 
                FROM chat c
                JOIN usuarios u_remitente ON c.remitente_id = u_remitente.usuario_id
                JOIN usuarios u_receptor ON c.receptor_id = u_receptor.usuario_id
                WHERE c.vehiculo_id = %s
                ORDER BY c.fecha_envio ASC
            """, (vehiculo_id,))
            mensajes = cursor.fetchall()
            
            # Obtener empleados asignados a este vehículo (si hay un servicio en proceso)
            cursor.execute("""
                SELECT DISTINCT u.usuario_id, u.nombre_completo 
                FROM usuarios u
                JOIN procesos p ON u.usuario_id = p.empleado_id
                JOIN reservas r ON p.reserva_id = r.reserva_id
                WHERE r.vehiculo_id = %s AND r.estado IN ('Pendiente', 'En proceso')
            """, (vehiculo_id,))
            empleados = cursor.fetchall()
            
            return render_template('cliente/chat_vehiculo.html', 
                                  vehiculo=vehiculo, 
                                  mensajes=mensajes, 
                                  empleados=empleados)
    except Exception as e:
        flash(f'Error al cargar el chat: {str(e)}', 'error')
        return redirect(url_for('cliente_bp.vehiculos'))

# Enviar mensaje en el chat
@cliente_bp.route('/chat/enviar', methods=['POST'])
def enviar_mensaje():
    user_id = session.get('user_id')
    vehiculo_id = request.form.get('vehiculo_id')
    receptor_id = request.form.get('receptor_id')
    mensaje = request.form.get('mensaje')
    tipo_mensaje = request.form.get('tipo_mensaje', 'texto')
    archivo_url = None
    
    # Procesar archivo si existe
    if 'archivo' in request.files and request.files['archivo'].filename != '':
        archivo = request.files['archivo']
        filename = secure_filename(archivo.filename)
        # Asegurar que existe el directorio para guardar archivos
        upload_dir = os.path.join(current_app.root_path, 'static', 'uploads', 'chat')
        os.makedirs(upload_dir, exist_ok=True)
        
        archivo_path = os.path.join(upload_dir, filename)
        archivo.save(archivo_path)
        archivo_url = f'/static/uploads/chat/{filename}'
    
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO chat (vehiculo_id, remitente_id, receptor_id, mensaje, tipo_mensaje, archivo_url)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (vehiculo_id, user_id, receptor_id, mensaje, tipo_mensaje, archivo_url))
        connection.commit()
        flash('Mensaje enviado correctamente', 'success')
    except Exception as e:
        flash(f'Error al enviar mensaje: {str(e)}', 'error')
    
    return redirect(url_for('cliente_bp.chat_vehiculo', vehiculo_id=vehiculo_id))

# Cotizaciones y servicios
@cliente_bp.route('/cotizar')
def cotizar():
    connection = get_db_connection()
    
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Obtener todos los servicios disponibles
            cursor.execute("SELECT * FROM servicios")
            servicios = cursor.fetchall()
            
            # Obtener vehículos del cliente para seleccionar
            user_id = session.get('user_id')
            cursor.execute("SELECT * FROM vehiculos WHERE usuario_id = %s", (user_id,))
            vehiculos = cursor.fetchall()
            
            # Obtener items en el carrito temporal
            cursor.execute("""
                SELECT ct.*, s.nombre, s.precio, s.imagen
                FROM carrito_temporal ct
                JOIN servicios s ON ct.servicio_id = s.servicio_id
                WHERE ct.usuario_id = %s
            """, (user_id,))
            carrito = cursor.fetchall()
            
            # Calcular total del carrito
            total_carrito = sum(item['precio'] * item['cantidad'] for item in carrito)
            
            return render_template('cliente/cotizar.html', 
                                  servicios=servicios, 
                                  vehiculos=vehiculos, 
                                  carrito=carrito,
                                  total_carrito=total_carrito)
    except Exception as e:
        flash(f'Error al cargar servicios: {str(e)}', 'error')
        return render_template('cliente/cotizar.html')

# Agregar servicio al carrito
@cliente_bp.route('/agregar-al-carrito', methods=['POST'])
def agregar_al_carrito():
    user_id = session.get('user_id')
    servicio_id = request.form.get('servicio_id')
    cantidad = request.form.get('cantidad', 1)
    
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Verificar si ya existe en el carrito
            cursor.execute("SELECT * FROM carrito_temporal WHERE usuario_id = %s AND servicio_id = %s", 
                          (user_id, servicio_id))
            item_existente = cursor.fetchone()
            
            if item_existente:
                # Actualizar cantidad
                cursor.execute("""
                    UPDATE carrito_temporal 
                    SET cantidad = cantidad + %s 
                    WHERE usuario_id = %s AND servicio_id = %s
                """, (cantidad, user_id, servicio_id))
            else:
                # Insertar nuevo item
                cursor.execute("""
                    INSERT INTO carrito_temporal (usuario_id, servicio_id, cantidad) 
                    VALUES (%s, %s, %s)
                """, (user_id, servicio_id, cantidad))
        
        connection.commit()
        flash('Servicio agregado al carrito', 'success')
    except Exception as e:
        flash(f'Error al agregar al carrito: {str(e)}', 'error')
    
    return redirect(url_for('cliente_bp.cotizar'))

# Eliminar item del carrito
@cliente_bp.route('/eliminar-del-carrito/<int:carrito_id>', methods=['POST'])
def eliminar_del_carrito(carrito_id):
    user_id = session.get('user_id')
    
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                DELETE FROM carrito_temporal 
                WHERE carrito_id = %s AND usuario_id = %s
            """, (carrito_id, user_id))
        
        connection.commit()
        flash('Item eliminado del carrito', 'success')
    except Exception as e:
        flash(f'Error al eliminar del carrito: {str(e)}', 'error')
    
    return redirect(url_for('cliente_bp.cotizar'))

# Crear cotización desde carrito
@cliente_bp.route('/crear-cotizacion', methods=['POST'])
def crear_cotizacion():
    user_id = session.get('user_id')
    vehiculo_id = request.form.get('vehiculo_id')
    
    if not vehiculo_id:
        flash('Debes seleccionar un vehículo para la cotización', 'error')
        return redirect(url_for('cliente_bp.cotizar'))
    
    connection = get_db_connection()
    try:
        connection.begin()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Verificar que hay items en el carrito
            cursor.execute("""
                SELECT ct.*, s.precio 
                FROM carrito_temporal ct
                JOIN servicios s ON ct.servicio_id = s.servicio_id
                WHERE ct.usuario_id = %s
            """, (user_id,))
            items_carrito = cursor.fetchall()
            
            if not items_carrito:
                flash('El carrito está vacío', 'error')
                return redirect(url_for('cliente_bp.cotizar'))
            
            # Calcular total
            total = sum(item['precio'] * item['cantidad'] for item in items_carrito)
            
            # Crear cotización
            cursor.execute("""
                INSERT INTO cotizaciones (usuario_id, vehiculo_id, total, estado)
                VALUES (%s, %s, %s, 'Pendiente')
            """, (user_id, vehiculo_id, total))
            
            # Obtener ID de la cotización creada
            cotizacion_id = cursor.lastrowid
            
            # Agregar servicios a la cotización
            for item in items_carrito:
                subtotal = item['precio'] * item['cantidad']
                cursor.execute("""
                    INSERT INTO cotizacion_servicio (cotizacion_id, servicio_id, cantidad, subtotal)
                    VALUES (%s, %s, %s, %s)
                """, (cotizacion_id, item['servicio_id'], item['cantidad'], subtotal))
            
            # Limpiar carrito
            cursor.execute("DELETE FROM carrito_temporal WHERE usuario_id = %s", (user_id,))
            
        connection.commit()
        flash('Cotización creada exitosamente', 'success')
        return redirect(url_for('cliente_bp.reservas'))
    
    except Exception as e:
        connection.rollback()
        flash(f'Error al crear cotización: {str(e)}', 'error')
        return redirect(url_for('cliente_bp.cotizar'))

# Crear reserva desde cotización
@cliente_bp.route('/crear-reserva/<int:cotizacion_id>', methods=['POST'])
def crear_reserva(cotizacion_id):
    user_id = session.get('user_id')
    fecha = request.form.get('fecha')
    hora = request.form.get('hora')
    comentario = request.form.get('comentario', '')
    
    connection = get_db_connection()
    try:
        connection.begin()
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Obtener información de la cotización
            cursor.execute("""
                SELECT * FROM cotizaciones 
                WHERE cotizacion_id = %s AND usuario_id = %s
            """, (cotizacion_id, user_id))
            cotizacion = cursor.fetchone()
            
            if not cotizacion:
                flash('Cotización no encontrada', 'error')
                return redirect(url_for('cliente_bp.reservas'))
            
            # Crear reserva
            cursor.execute("""
                INSERT INTO reservas (cotizacion_id, vehiculo_id, usuario_id, fecha, hora, comentario, total, estado)
                VALUES (%s, %s, %s, %s, %s, %s, %s, 'Pendiente')
            """, (cotizacion_id, cotizacion['vehiculo_id'], user_id, fecha, hora, comentario, cotizacion['total']))
            
            # Actualizar estado de la cotización
            cursor.execute("""
                UPDATE cotizaciones 
                SET estado = 'Aceptada' 
                WHERE cotizacion_id = %s
            """, (cotizacion_id,))
        
        connection.commit()
        flash('Reserva creada exitosamente', 'success')
    except Exception as e:
        connection.rollback()
        flash(f'Error al crear reserva: {str(e)}', 'error')
    
    return redirect(url_for('cliente_bp.reservas'))

# Gestión de reservas
@cliente_bp.route('/reservas')
def reservas():
    user_id = session.get('user_id')
    connection = get_db_connection()
    
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Obtener cotizaciones pendientes
            cursor.execute("""
                SELECT c.*, v.marca, v.modelo, v.placa 
                FROM cotizaciones c
                JOIN vehiculos v ON c.vehiculo_id = v.vehiculo_id
                WHERE c.usuario_id = %s AND c.estado = 'Pendiente'
                ORDER BY c.fecha_creacion DESC
            """, (user_id,))
            cotizaciones = cursor.fetchall()
            
            # Obtener reservas activas
            cursor.execute("""
                SELECT r.*, v.marca, v.modelo, v.placa, v.imagen,
                       c.total as cotizacion_total
                FROM reservas r
                JOIN vehiculos v ON r.vehiculo_id = v.vehiculo_id
                LEFT JOIN cotizaciones c ON r.cotizacion_id = c.cotizacion_id
                WHERE r.usuario_id = %s
                ORDER BY r.fecha DESC, r.estado
            """, (user_id,))
            reservas_activas = cursor.fetchall()
            
            # Para cada reserva, obtener servicios incluidos
            for reserva in reservas_activas:
                cursor.execute("""
                    SELECT cs.*, s.nombre, s.descripcion
                    FROM cotizacion_servicio cs
                    JOIN servicios s ON cs.servicio_id = s.servicio_id
                    WHERE cs.cotizacion_id = %s
                """, (reserva['cotizacion_id'],))
                reserva['servicios'] = cursor.fetchall()
            
            return render_template('cliente/reservas.html', 
                                  cotizaciones=cotizaciones, 
                                  reservas=reservas_activas)
    except Exception as e:
        flash(f'Error al cargar reservas: {str(e)}', 'error')
        return render_template('cliente/reservas.html')

# Reportes y procesos del vehículo
@cliente_bp.route('/reportes/<int:vehiculo_id>', endpoint='reportes_vehiculo')
def reportes(vehiculo_id):
    user_id = session.get('user_id')
    connection = get_db_connection()
    
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Verificar que el vehículo pertenece al cliente
            cursor.execute("SELECT * FROM vehiculos WHERE vehiculo_id = %s AND usuario_id = %s", 
                          (vehiculo_id, user_id))
            vehiculo = cursor.fetchone()
            
            if not vehiculo:
                flash('No tienes permiso para acceder a este vehículo', 'error')
                return redirect(url_for('cliente_bp.vehiculos'))
            
            # Obtener historial de servicios
            cursor.execute("""
                SELECT hs.*, r.estado as reserva_estado
                FROM historial_servicios hs
                LEFT JOIN reservas r ON hs.reserva_id = r.reserva_id
                WHERE hs.vehiculo_id = %s
                ORDER BY hs.fecha_inicio DESC
            """, (vehiculo_id,))
            historial = cursor.fetchall()
            
            # Obtener procesos activos
            cursor.execute("""
                SELECT p.*, r.reserva_id, r.fecha as reserva_fecha,
                       u.nombre_completo as empleado_nombre
                FROM procesos p
                JOIN reservas r ON p.reserva_id = r.reserva_id
                LEFT JOIN usuarios u ON p.empleado_id = u.usuario_id
                WHERE r.vehiculo_id = %s
                ORDER BY p.fecha_inicio DESC
            """, (vehiculo_id,))
            procesos = cursor.fetchall()
            
            # Obtener reportes
            cursor.execute("""
                SELECT r.*, u.nombre_completo as empleado_nombre
                FROM reportes r
                JOIN usuarios u ON r.usuario_id = u.usuario_id
                WHERE r.vehiculo_id = %s
                ORDER BY r.fecha_reporte DESC
            """, (vehiculo_id,))
            reportes_list = cursor.fetchall()
            
            # Para cada reporte, obtener archivos adjuntos
            for reporte in reportes_list:
                cursor.execute("""
                    SELECT * FROM archivos_proceso
                    WHERE reporte_id = %s
                """, (reporte['reporte_id'],))
                reporte['archivos'] = cursor.fetchall()
            
            return render_template('cliente/reportes.html', 
                                  vehiculo=vehiculo, 
                                  historial=historial,
                                  procesos=procesos, 
                                  reportes=reportes_list)
    except Exception as e:
        flash(f'Error al cargar reportes: {str(e)}', 'error')
        return redirect(url_for('cliente_bp.vehiculos'))

# Gestión de perfil
@cliente_bp.route('/perfil')
def perfil():
    user_id = session.get('user_id')
    connection = get_db_connection()
    
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT * FROM usuarios WHERE usuario_id = %s", (user_id,))
            usuario = cursor.fetchone()
            
            return render_template('cliente/perfil.html', usuario=usuario)
    except Exception as e:
        flash(f'Error al cargar perfil: {str(e)}', 'error')
        return render_template('cliente/perfil.html')

# Actualizar perfil
@cliente_bp.route('/actualizar-perfil', methods=['POST'])
def actualizar_perfil():
    user_id = session.get('user_id')
    correo = request.form.get('correo')
    telefono = request.form.get('telefono')
    password_actual = request.form.get('password_actual')
    password_nuevo = request.form.get('password_nuevo')
    
    connection = get_db_connection()
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            # Obtener usuario actual
            cursor.execute("SELECT * FROM usuarios WHERE usuario_id = %s", (user_id,))
            usuario = cursor.fetchone()
            
            # Actualizar foto de perfil si se proporcionó
            nueva_foto = None
            if 'foto_perfil' in request.files and request.files['foto_perfil'].filename != '':
                foto = request.files['foto_perfil']
                filename = secure_filename(f"perfil_{user_id}_{foto.filename}")
                # Asegurar que existe el directorio para guardar archivos
                upload_dir = os.path.join(current_app.root_path, 'static', 'uploads', 'perfiles')
                os.makedirs(upload_dir, exist_ok=True)
                
                foto_path = os.path.join(upload_dir, filename)
                foto.save(foto_path)
                nueva_foto = f'/static/uploads/perfiles/{filename}'
            
            # Actualizar datos básicos
            cursor.execute("""
                UPDATE usuarios 
                SET correo = %s, telefono = %s
                WHERE usuario_id = %s
            """, (correo, telefono, user_id))
            
            # Actualizar foto si se subió una nueva
            if nueva_foto:
                cursor.execute("""
                    UPDATE usuarios 
                    SET foto_perfil = %s
                    WHERE usuario_id = %s
                """, (nueva_foto, user_id))
            
            # Cambiar contraseña si se proporcionó
            if password_actual and password_nuevo:
                from flask_bcrypt import Bcrypt
                bcrypt = Bcrypt()
                
                # Verificar contraseña actual
                if bcrypt.check_password_hash(usuario['password_hash'], password_actual):
                    password_hash = bcrypt.generate_password_hash(password_nuevo).decode('utf-8')
                    cursor.execute("""
                        UPDATE usuarios 
                        SET password_hash = %s
                        WHERE usuario_id = %s
                    """, (password_hash, user_id))
                    flash('Contraseña actualizada correctamente', 'success')
                else:
                    flash('La contraseña actual es incorrecta', 'error')
            
        connection.commit()
        session['user_email'] = correo  # Actualizar email en la sesión
        flash('Perfil actualizado correctamente', 'success')
    except Exception as e:
        flash(f'Error al actualizar perfil: {str(e)}', 'error')
    
    return redirect(url_for('cliente_bp.perfil'))

# Gestión de vehículos
@cliente_bp.route('/vehiculos')
def vehiculos():
    user_id = session.get('user_id')
    connection = get_db_connection()
    
    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("""
                SELECT v.*, 
                       (SELECT COUNT(*) FROM reservas r WHERE r.vehiculo_id = v.vehiculo_id AND r.estado IN ('Pendiente', 'En proceso')) as servicios_activos
                FROM vehiculos v
                WHERE v.usuario_id = %s
                ORDER BY v.fecha_registro DESC
            """, (user_id,))
            vehiculos_list = cursor.fetchall()
            
            return render_template('cliente/vehiculos.html', vehiculos=vehiculos_list)
    except Exception as e:
        flash(f'Error al cargar vehículos: {str(e)}', 'error')
        return render_template('cliente/vehiculos.html')

# Añadir nuevo vehículo
@cliente_bp.route('/agregar-vehiculo', methods=['POST'])
def agregar_vehiculo():
    user_id = session.get('user_id')
    marca = request.form.get('marca')
    modelo = request.form.get('modelo')
    anio = request.form.get('anio')
    placa = request.form.get('placa')
    color = request.form.get('color')
    tipo = request.form.get('tipo')
    
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Verificar si ya existe un vehículo con esa placa
            cursor.execute("SELECT * FROM vehiculos WHERE placa = %s", (placa,))
            if cursor.fetchone():
                flash('Ya existe un vehículo registrado con esa placa', 'error')
                return redirect(url_for('cliente_bp.vehiculos'))
            
            # Procesar imagen si se proporcionó
            imagen = None
            if 'imagen' in request.files and request.files['imagen'].filename != '':
                archivo = request.files['imagen']
                filename = secure_filename(f"vehiculo_{placa}_{archivo.filename}")
                # Asegurar que existe el directorio para guardar archivos
                upload_dir = os.path.join(current_app.root_path, 'static', 'uploads', 'vehiculos')
                os.makedirs(upload_dir, exist_ok=True)
                
                archivo_path = os.path.join(upload_dir, filename)
                archivo.save(archivo_path)
                imagen = f'/static/uploads/vehiculos/{filename}'
            
            # Insertar vehículo
            if imagen:
                cursor.execute("""
                    INSERT INTO vehiculos (usuario_id, marca, modelo, anio, placa, color, tipo, imagen)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (user_id, marca, modelo, anio, placa, color, tipo, imagen))
            else:
                cursor.execute("""
                    INSERT INTO vehiculos (usuario_id, marca, modelo, anio, placa, color, tipo)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (user_id, marca, modelo, anio, placa, color, tipo))
        
        connection.commit()
        flash('Vehículo agregado correctamente', 'success')
    except Exception as e:
        flash(f'Error al agregar vehículo: {str(e)}', 'error')
    
    return redirect(url_for('cliente_bp.vehiculos'))

# Editar vehículo
@cliente_bp.route('/editar-vehiculo/<int:vehiculo_id>', methods=['POST'])
def editar_vehiculo(vehiculo_id):
    user_id = session.get('user_id')
    marca = request.form.get('marca')
    modelo = request.form.get('modelo')
    anio = request.form.get('anio')
    color = request.form.get('color')
    tipo = request.form.get('tipo')
    
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Verificar que el vehículo pertenece al cliente
            cursor.execute("SELECT * FROM vehiculos WHERE vehiculo_id = %s AND usuario_id = %s", 
                          (vehiculo_id, user_id))
            if not cursor.fetchone():
                flash('No tienes permiso para editar este vehículo', 'error')
                return redirect(url_for('cliente_bp.vehiculos'))
            
            # Procesar imagen si se proporcionó
            imagen_sql = ""
            params = [marca, modelo, anio, color, tipo, vehiculo_id, user_id]
            
            if 'imagen' in request.files and request.files['imagen'].filename != '':
                archivo = request.files['imagen']
                filename = secure_filename(f"vehiculo_{vehiculo_id}_{archivo.filename}")
                # Asegurar que existe el directorio para guardar archivos
                upload_dir = os.path.join(current_app.root_path, 'static', 'uploads', 'vehiculos')
                os.makedirs(upload_dir, exist_ok=True)
                
                archivo_path = os.path.join(upload_dir, filename)
                archivo.save(archivo_path)
                imagen = f'/static/uploads/vehiculos/{filename}'
                imagen_sql = ", imagen = %s"
                params.insert(5, imagen)
            
            # Actualizar vehículo
            cursor.execute(f"""
                UPDATE vehiculos
                SET marca = %s, modelo = %s, anio = %s, color = %s, tipo = %s{imagen_sql}
                WHERE vehiculo_id = %s AND usuario_id = %s
            """, params)
        
        connection.commit()
        flash('Vehículo actualizado correctamente', 'success')
    except Exception as e:
        flash(f'Error al actualizar vehículo: {str(e)}', 'error')
    
    return redirect(url_for('cliente_bp.vehiculos'))

# Cerrar sesión
@cliente_bp.route('/logout')
def logout():
    session.clear()
    flash('Has cerrado sesión correctamente', 'info')
    return redirect(url_for('auth.login_view'))

@cliente_bp.route('/cancelar-reserva', methods=['POST'])
def cancelar_reserva():
    user_id = session.get('user_id')
    reserva_id = request.form.get('reserva_id')
    motivo = request.form.get('motivo')
    comentario = request.form.get('comentario', '')
    
    # Lógica para cancelar la reserva
    # ...
    
    flash('Reserva cancelada correctamente', 'success')
    return redirect(url_for('cliente_bp.reservas'))

