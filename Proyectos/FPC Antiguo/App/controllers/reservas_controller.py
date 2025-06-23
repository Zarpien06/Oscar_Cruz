from flask import Blueprint, render_template, request, redirect, url_for, flash, current_app
from datetime import datetime

reservas_bp = Blueprint('reservas_bp', __name__)

@reservas_bp.route('/reservar', methods=['GET', 'POST'])
def reservar():
    if request.method == 'POST':
        # Obtener datos del formulario
        nombre_completo = request.form.get('nombre')
        correo = request.form.get('correo')
        telefono = request.form.get('telefono')
        comentario = request.form.get('comentario')
        fecha = "2025-04-15"  # También puedes usar: request.form.get('fecha')
        hora = "10:00"         # También puedes usar: request.form.get('hora')

        # Validar que todos los campos requeridos estén presentes
        if not all([nombre_completo, correo, telefono, fecha, hora]):
            flash("Por favor, complete todos los campos obligatorios.", "error")
            return redirect(url_for('reservas_bp.reservar'))

        # Conectar a la base de datos
        connection2 = current_app.connection
        try:
            with connection2.cursor() as cursor:
                # Buscar el usuario por correo
                cursor.execute("SELECT usuario_id FROM usuarios WHERE correo = %s", (correo,))
                result = cursor.fetchone()

                if result:
                    cliente_id = result[0]

                    # Insertar la reserva
                    cursor.execute("""
                        INSERT INTO Reservas (usuario_id, fecha, hora, comentario, estado)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (cliente_id, fecha, hora, comentario, 'Pendiente'))

                    flash("Reserva creada exitosamente.", "success")
                    connection2.commit()
                    return render_template('Factura.html')
                else:
                    flash("No se encontró un usuario con ese correo. Por favor, regístrese primero.", "error")
                    return redirect(url_for('reservas_bp.reservar'))

        except Exception as e:
            flash(f"Error al guardar la reserva: {str(e)}", "error")
            return "ha ocurrido un error: " + str(e)

    return render_template('reservas.html')
