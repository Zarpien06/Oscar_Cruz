// Datos de ejemplo para simular la base de datos
let users = [
    {
        id: 2,
        nombre: "Daniel",
        correo: "admin@gmail.com",
        rol: "Administrador",
        estado: "activo",
        fecha_creacion: "2024-03-15"
    },
    {
        id: 1,
        nombre: "Johan",
        correo: "cliente@gmail.com",
        rol: "Cliente",
        estado: "activo",
        fecha_creacion: "2024-03-20"
    },
    {
        id: 3,
        nombre: "María López",
        correo: "maria.lopez@gmail.com",
        rol: "Cliente",
        estado: "activo",
        fecha_creacion: "2024-03-25"
    },
    {
        id: 4,
        nombre: "Carlos Rodríguez",
        correo: "carlos.rodriguez@fullpaintcars.com",
        rol: "Empleado",
        estado: "inactivo",
        fecha_creacion: "2024-02-10"
    }
];

// Función para cargar los usuarios en la tabla
function loadUsers() {
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = ''; // Limpiar tabla antes de cargar nuevos datos

    // Obtener los filtros
    const roleFilter = document.getElementById('filter-role').value;
    const statusFilter = document.getElementById('filter-status').value;

    // Filtrar los usuarios según los valores seleccionados
    const filteredUsers = users.filter(user => {
        const matchesRole = roleFilter ? user.rol === roleFilter : true;
        const matchesStatus = statusFilter ? user.estado === statusFilter : true;
        return matchesRole && matchesStatus;
    });

    // Si no hay usuarios que coincidan con el filtro, mostrar mensaje
    if (filteredUsers.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="7" class="text-center">No se encontraron usuarios que coincidan con los filtros.</td>`;
        tbody.appendChild(tr);
    } else {
        // Iterar sobre los usuarios filtrados y agregar filas a la tabla
        filteredUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.id}</td>
                <td>${user.nombre}</td>
                <td>${user.correo}</td>
                <td>${user.rol}</td>
                <td>${user.estado}</td>
                <td>${user.fecha_creacion}</td>
                <td>
                    <button class="btn btn-edit" data-id="${user.id}">Editar</button>
                    <button class="btn btn-delete" data-id="${user.id}">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    addEditAndDeleteListeners(); // Añadir eventos a los botones de editar y eliminar
}

// Función para abrir el modal de nuevo usuario
document.getElementById('btn-new-user').addEventListener('click', function() {
    document.getElementById('user-modal').style.display = 'block';
    document.getElementById('modal-title').textContent = 'Nuevo Usuario';
    document.getElementById('user-form').reset();
    document.getElementById('user-id').value = ''; // Asegúrate de limpiar el campo oculto
});

// Función para cerrar los modales
document.querySelectorAll('.close-modal, #btn-cancel').forEach(function(btn) {
    btn.addEventListener('click', function() {
        document.getElementById('user-modal').style.display = 'none';
        document.getElementById('confirm-modal').style.display = 'none';
    });
});

// Añadir listeners para los botones de editar y eliminar
// Añadir listeners para los botones de editar y eliminar
function addEditAndDeleteListeners() {
    document.querySelectorAll('.btn-edit').forEach(function(button) {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            const user = users.find(u => u.id == userId);
            // Cargar los datos del usuario en el formulario de edición
            document.getElementById('user-id').value = user.id;
            document.getElementById('user-name').value = user.nombre;
            document.getElementById('correo').value = user.correo;
            document.getElementById('nuevo_rol').value = user.rol;
            document.getElementById('user-status').value = user.estado;
            document.getElementById('modal-title').textContent = 'Editar Usuario';
            document.getElementById('user-modal').style.display = 'block';
        });
    });

    document.querySelectorAll('.btn-delete').forEach(function(button) {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            const user = users.find(u => u.id == userId);
            document.getElementById('delete-user-id').value = user.id;
            document.getElementById('confirm-modal').style.display = 'block';
        });
    });
}

// Función para eliminar un usuario
document.getElementById('btn-confirm-delete').addEventListener('click', function() {
    const userId = document.getElementById('delete-user-id').value;
    users = users.filter(user => user.id != userId); // Eliminar usuario de la lista
    loadUsers(); // Recargar la tabla
    document.getElementById('confirm-modal').style.display = 'none'; // Cerrar el modal
});

// Función para guardar un nuevo usuario o actualizar uno existente
document.getElementById('user-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío normal del formulario

    const userId = document.getElementById('user-id').value;
    const userName = document.getElementById('user-name').value;
    const userEmail = document.getElementById('correo').value;
    const userRole = document.getElementById('nuevo_rol').value;
    const userStatus = document.getElementById('user-status').value;

    if (userId) {
        // Actualizar usuario existente
        const user = users.find(u => u.id == userId);
        user.nombre = userName;
        user.correo = userEmail;
        user.rol = userRole;
        user.estado = userStatus;
    } else {
        // Crear nuevo usuario
        const newUser  = {
            id: users.length + 1, // Asignar un nuevo ID
            nombre: userName,
            correo: userEmail,
            rol: userRole,
            estado: userStatus,
            fecha_creacion: new Date().toISOString().split('T')[0] // Fecha actual
        };
        users.push(newUser );
    }

    loadUsers(); // Recargar la tabla
    document.getElementById('user-modal').style.display = 'none'; // Cerrar el modal
});

// Llamada inicial para cargar los usuarios
loadUsers();