from flask import Blueprint, request, jsonify, current_app
import pymysql.cursors

chat_bp = Blueprint('chat', __name__)

# Ruta para obtener mensajes del chat
@chat_bp.route('/get_messages/<int:cliente_id>/<int:empleado_id>', methods=['GET'])
def get_messages(cliente_id, empleado_id):
    connection = current_app.connection
    with connection.cursor() as cursor:
        query = '''
        SELECT chat_id, remitente_id, receptor_id, mensaje, fecha_hora
        FROM Chat
        WHERE (remitente_id = %s AND receptor_id = %s) OR (remitente_id = %s AND receptor_id = %s)
        ORDER BY fecha_hora ASC
        '''
        cursor.execute(query, (cliente_id, empleado_id, empleado_id, cliente_id))
        messages = cursor.fetchall()
    
    return jsonify(messages)


# Ruta para enviar un mensaje
@chat_bp.route('/send_message', methods=['POST'])
def send_message():
    data = request.get_json()
    remitente_id = data['remitente_id']
    receptor_id = data['receptor_id']
    mensaje = data['mensaje']

    connection = current_app.connection
    with connection.cursor() as cursor:
        query = '''
        INSERT INTO Chat (remitente_id, receptor_id, mensaje)
        VALUES (%s, %s, %s)
        '''
        cursor.execute(query, (remitente_id, receptor_id, mensaje))
        connection.commit()

    return jsonify({'status': 'Message sent successfully'})
