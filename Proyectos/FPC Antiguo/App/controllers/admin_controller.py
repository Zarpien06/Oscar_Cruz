from flask import Blueprint, render_template, redirect, url_for, current_app
import app.controllers.gestion_usuario_controller as get_connection
import pymysql.cursors

admin_bp = Blueprint('admin_bp', __name__, static_folder='static', template_folder='templates')
@admin_bp.route('/admin/usuarios', methods=['GET'])
def listar_usuarios():
    
    conn = current_app.connection
    with conn.cursor(pymysql.cursors.DictCursor) as cursor:
        cursor.execute("SELECT * FROM usuarios")
        usuarios = cursor.fetchall() 
    return render_template('admin/gestion_usuarios.html', usuarios=usuarios)
@admin_bp.route('/admin')
def dashboard():
    return render_template('admin/Dasboard.html')

@admin_bp.route('/Usuarios')
def Usuarios():
    return redirect(url_for('admin_bp.listar_usuarios'))

@admin_bp.route('/Roles')
def Roles():
    return render_template('admin/Gestion Rol.html')

@admin_bp.route('/Automoviles')
def Automoviles():
    return render_template('admin/Gestion Automoviles.html')

@admin_bp.route('/Reportes')
def Reportes():
    return render_template('admin/Gestion Reportes.html')

@admin_bp.route('/Chat')
def Chat():
    return render_template('admin/Gestion Chat.html')

@admin_bp.route('/Cotizaciones')
def Cotizaciones():
    return render_template('admin/Gestion Cotizaciones.html')

@admin_bp.route('/Procesos')
def Procesos():
    return render_template('admin/Gestion Procesos.html')


