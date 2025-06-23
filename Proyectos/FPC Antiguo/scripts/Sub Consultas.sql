-- 9. Obtener los usuarios que tienen el rol "cliente".
SELECT * FROM usuarios WHERE rol_id = (SELECT rol_id FROM roles WHERE nombre = 'cliente');

-- 10. Listar los usuarios que han hecho al menos una reserva.
SELECT * FROM usuarios WHERE usuario_id IN (SELECT usuario_id FROM reservas);

-- 11. Mostrar los usuarios que no han hecho ninguna reserva.
SELECT * FROM usuarios WHERE usuario_id NOT IN (SELECT usuario_id FROM reservas);

-- 12. Obtener los roles asignados a más de un usuario.
SELECT * FROM roles WHERE rol_id IN (
  SELECT rol_id FROM usuarios GROUP BY rol_id HAVING COUNT(*) > 1
);

-- 13. Mostrar los usuarios que tienen el rol con el nombre más corto.
SELECT * FROM usuarios WHERE rol_id = (
  SELECT rol_id FROM roles ORDER BY LENGTH(nombre) ASC LIMIT 1
);
