from flask import Flask, render_template, request, redirect, url_for
import pymysql
from datetime import datetime

app = Flask(__name__)

def obtener_conexion():
    return pymysql.connect(host='localhost', user='root', password='', db='FPC', cursorclass=pymysql.cursors.DictCursor)
@app.route('/Usuarios')
def Usuarios():
    return render_template('admin/Gestion Usuarios.html')
@app.route('/agregar-vehiculo')
def formulario_vehiculo():
    # Aquí simulas las listas, puedes cargarlas desde la BD también
    marcas = [{"id": 1, "nombre": "Toyota"}, {"id": 2, "nombre": "Mazda"}, {"id": 3, "nombre": "Chevrolet"}]
    colores = [{"id": 1, "nombre": "Negro"}, {"id": 2, "nombre": "Rojo"}, {"id": 3, "nombre": "Blanco"}]
    estados = [
        {"valor": "Activo", "nombre": "Activo"},
        {"valor": "En Mantenimiento", "nombre": "En Mantenimiento"},
        {"valor": "Completado", "nombre": "Completado"}
    ]
    return render_template('vehicle_modal.html', marcas=marcas, colores=colores, estados=estados)

@app.route('/guardar-vehiculo', methods=['POST'])
def guardar_vehiculo():
    placa = request.form['placa']
    marca_id = request.form['marca_id']
    modelo = request.form['modelo']
    anio = request.form['anio']
    color_id = request.form['color_id']
    propietario = request.form['propietario']
    telefono = request.form['telefono']
    correo = request.form['correo']
    estado = request.form['estado']
    notas = request.form['notas']
    fecha_registro = datetime.now()

    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        sql = """
            INSERT INTO vehiculos (placa, marca_id, modelo, anio, color_id, propietario, telefono, correo, estado, notas, fecha_registro)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (placa, marca_id, modelo, anio, color_id, propietario, telefono, correo, estado, notas, fecha_registro))
        conexion.commit()
    conexion.close()
    return redirect(url_for('admin/Gestion Usuarios.html'))  # Puedes redirigir a donde gustes

