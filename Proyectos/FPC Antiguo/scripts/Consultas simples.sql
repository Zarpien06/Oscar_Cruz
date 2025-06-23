-- 1. Obtener todos los usuarios registrados.
SELECT * FROM usuarios;

-- 2. Listar los nombres y correos de los usuarios.
SELECT nombre_completo, correo FROM usuarios;

-- 3. Mostrar los usuarios con estado "Activo".
SELECT * FROM usuarios WHERE estado = 'Activo';

-- 4. Obtener todos los roles disponibles.
SELECT * FROM roles;

-- 5. Ver las reservas programadas para una fecha específica.
SELECT * FROM reservas WHERE fecha_reserva = '2025-05-01';

-- 6. Listar los usuarios con un número de teléfono registrado.
SELECT * FROM usuarios WHERE telefono IS NOT NULL;

-- 7. Mostrar todas las reservas ordenadas por fecha.
SELECT * FROM reservas ORDER BY fecha_reserva ASC;

-- 8. Contar cuántas reservas hay registradas.
SELECT COUNT(*) AS total_reservas FROM reservas;