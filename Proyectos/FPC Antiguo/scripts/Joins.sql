-- 17. Obtener todos los usuarios junto con el nombre de su rol.
SELECT u.nombre_completo, r.nombre AS rol FROM usuarios u
JOIN roles r ON u.rol_id = r.rol_id;

-- 18. Mostrar las reservas junto con el nombre del usuario.
SELECT r.*, u.nombre_completo FROM reservas r
JOIN usuarios u ON r.usuario_id = u.usuario_id;

-- 19. Listar todos los usuarios y su rol, ordenados alfabéticamente por rol.
SELECT u.nombre_completo, r.nombre AS rol FROM usuarios u
JOIN roles r ON u.rol_id = r.rol_id ORDER BY r.nombre;

-- 20. Ver las reservas de usuarios con el rol "cliente".
SELECT r.* FROM reservas r
JOIN usuarios u ON r.usuario_id = u.usuario_id
JOIN roles ro ON u.rol_id = ro.rol_id
WHERE ro.nombre = 'cliente';

-- 21. Listar los nombres de usuarios y la fecha de sus reservas.
SELECT u.nombre_completo, r.fecha_reserva FROM usuarios u
JOIN reservas r ON u.usuario_id = r.usuario_id;

-- 22. Mostrar todos los usuarios, su correo y su rol.
SELECT u.nombre_completo, u.correo, r.nombre AS rol FROM usuarios u
JOIN roles r ON u.rol_id = r.rol_id;

-- 23. Ver el número total de reservas por cada usuario.
SELECT u.nombre_completo, COUNT(r.reserva_id) AS total_reservas FROM usuarios u
LEFT JOIN reservas r ON u.usuario_id = r.usuario_id
GROUP BY u.usuario_id;

-- 24. Mostrar los usuarios con rol y fecha de su próxima reserva (si tiene).
SELECT u.nombre_completo, ro.nombre AS rol, r.fecha_reserva FROM usuarios u
JOIN roles ro ON u.rol_id = ro.rol_id
LEFT JOIN reservas r ON u.usuario_id = r.usuario_id
ORDER BY r.fecha_reserva ASC;
