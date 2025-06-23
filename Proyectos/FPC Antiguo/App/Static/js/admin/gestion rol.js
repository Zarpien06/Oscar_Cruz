
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const rolesTable = document.getElementById('rolesTable');
    const btnAddRole = document.getElementById('btnAddRole');
    const roleModal = document.getElementById('roleModal');
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    const roleForm = document.getElementById('roleForm');
    const modalTitle = document.getElementById('modalTitle');
    const btnSaveRole = document.getElementById('btnSaveRole');
    const btnCancel = document.getElementById('btnCancel');
    const btnCancelDelete = document.getElementById('btnCancelDelete');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    const searchRoles = document.getElementById('searchRoles');
    const filterStatus = document.getElementById('filterStatus');
    const btnRefresh = document.getElementById('btnRefresh');
    
    // Estado de la aplicación
    let roles = [
        {
            id: 1,
            name: 'Administrador',
            description: 'Acceso completo al sistema',
            permissions: ['Crear', 'Editar', 'Eliminar', 'Ver'],
            status: 'active'
        },
        {
            id: 2,
            name: 'Supervisor',
            description: 'Gestión de procesos y reportes',
            permissions: ['Editar', 'Ver'],
            status: 'active'
        },
        {
            id: 3,
            name: 'Operador',
            description: 'Solo vista de procesos asignados',
            permissions: ['Ver'],
            status: 'inactive'
        }
    ];
    let currentRoleId = null;
    let deletingRoleId = null;
    
    // Renderizar tabla de roles
    function renderRolesTable(rolesArray = roles) {
        const tbody = rolesTable.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (rolesArray.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="6" style="text-align: center;">No se encontraron roles</td>
            `;
            tbody.appendChild(emptyRow);
            return;
        }
        
        rolesArray.forEach(role => {
            const tr = document.createElement('tr');
            
            // Crear badges para permisos
            const permissionBadges = role.permissions.map(perm => 
                `<span class="permission-badge">${perm}</span>`
            ).join('');
            
            // Determinar clase para el estado
            const statusClass = role.status === 'active' ? 'active' : 'inactive';
            const statusText = role.status === 'active' ? 'Activo' : 'Inactivo';
            
            tr.innerHTML = `
                <td>${role.id}</td>
                <td>${role.name}</td>
                <td>${role.description}</td>
                <td>${permissionBadges}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td class="actions">
                    <button class="btn-icon edit-role" data-id="${role.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-role" data-id="${role.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tbody.appendChild(tr);
        });
        
        // Asignar eventos a los botones de editar y eliminar
        assignActionButtonEvents();
    }
    
    // Asignar eventos a los botones de acción en la tabla
    function assignActionButtonEvents() {
        // Botones de editar
        document.querySelectorAll('.edit-role').forEach(btn => {
            btn.addEventListener('click', function() {
                const roleId = parseInt(this.getAttribute('data-id'));
                openEditRoleModal(roleId);
            });
        });
        
        // Botones de eliminar
        document.querySelectorAll('.delete-role').forEach(btn => {
            btn.addEventListener('click', function() {
                const roleId = parseInt(this.getAttribute('data-id'));
                openDeleteConfirmModal(roleId);
            });
        });
    }
    
    // Abrir modal para nuevo rol
    function openNewRoleModal() {
        modalTitle.textContent = 'Nuevo Rol';
        roleForm.reset();
        document.getElementById('roleId').value = '';
        currentRoleId = null;
        
        // Deseleccionar todos los checkboxes de permisos
        document.getElementById('permCreate').checked = false;
        document.getElementById('permEdit').checked = false;
        document.getElementById('permDelete').checked = false;
        document.getElementById('permView').checked = false;
        
        // Seleccionar estado activo por defecto
        document.getElementById('roleStatus').value = 'active';
        
        roleModal.classList.add('active');
    }
    
    // Abrir modal para editar rol
    function openEditRoleModal(roleId) {
        const role = roles.find(r => r.id === roleId);
        if (!role) return;
        
        modalTitle.textContent = 'Editar Rol';
        document.getElementById('roleId').value = role.id;
        document.getElementById('roleName').value = role.name;
        document.getElementById('roleDescription').value = role.description;
        
        // Establecer permisos
        document.getElementById('permCreate').checked = role.permissions.includes('Crear');
        document.getElementById('permEdit').checked = role.permissions.includes('Editar');
        document.getElementById('permDelete').checked = role.permissions.includes('Eliminar');
        document.getElementById('permView').checked = role.permissions.includes('Ver');
        
        // Establecer estado
        document.getElementById('roleStatus').value = role.status;
        
        currentRoleId = roleId;
        roleModal.classList.add('active');
    }
    
    // Abrir modal de confirmación para eliminar
    function openDeleteConfirmModal(roleId) {
        const role = roles.find(r => r.id === roleId);
        if (!role) return;
        
        deletingRoleId = roleId;
        
        // Mostrar nombre del rol en el mensaje de confirmación
        const confirmMessage = document.querySelector('#confirmDeleteModal .modal-body p');
        confirmMessage.textContent = `¿Está seguro de que desea eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`;
        
        confirmDeleteModal.classList.add('active');
    }
    
    // Cerrar modales
    function closeModals() {
        roleModal.classList.remove('active');
        confirmDeleteModal.classList.remove('active');
    }
    
    // Guardar rol (crear o actualizar)
    function saveRole(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const name = document.getElementById('roleName').value.trim();
        const description = document.getElementById('roleDescription').value.trim();
        const status = document.getElementById('roleStatus').value;
        
        // Recopilar permisos seleccionados
        const permissions = [];
        if (document.getElementById('permCreate').checked) permissions.push('Crear');
        if (document.getElementById('permEdit').checked) permissions.push('Editar');
        if (document.getElementById('permDelete').checked) permissions.push('Eliminar');
        if (document.getElementById('permView').checked) permissions.push('Ver');
        
        // Validación básica
        if (name === '') {
            alert('El nombre del rol es obligatorio');
            return;
        }
        
        if (permissions.length === 0) {
            alert('Debe seleccionar al menos un permiso');
            return;
        }
        
        // Crear objeto del rol
        const roleData = {
            name,
            description,
            permissions,
            status
        };
        
        if (currentRoleId === null) {
            // Crear nuevo rol
            roleData.id = getNextId();
            roles.push(roleData);
            showNotification('Rol creado exitosamente');
        } else {
            // Actualizar rol existente
            roleData.id = currentRoleId;
            const index = roles.findIndex(r => r.id === currentRoleId);
            if (index !== -1) {
                roles[index] = roleData;
                showNotification('Rol actualizado exitosamente');
            }
        }
        
        // Cerrar modal y actualizar tabla
        closeModals();
        renderRolesTable();
    }
    
    // Eliminar rol
    function deleteRole() {
        if (deletingRoleId === null) return;
        
        const index = roles.findIndex(r => r.id === deletingRoleId);
        if (index !== -1) {
            roles.splice(index, 1);
            showNotification('Rol eliminado exitosamente');
        }
        
        closeModals();
        renderRolesTable();
        deletingRoleId = null;
    }
    
    // Obtener siguiente ID disponible
    function getNextId() {
        return roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    }
    
    // Buscar roles
    function searchRolesByKeyword(keyword) {
        keyword = keyword.toLowerCase();
        
        return roles.filter(role => 
            role.name.toLowerCase().includes(keyword) ||
            role.description.toLowerCase().includes(keyword)
        );
    }
    
    // Filtrar roles por estado
    function filterRolesByStatus(status) {
        if (status === 'all') return roles;
        
        return roles.filter(role => role.status === status);
    }
    
    // Aplicar filtros combinados
    function applyFilters() {
        const keyword = searchRoles.value.trim();
        const status = filterStatus.value;
        
        let filteredRoles = roles;
        
        // Primero filtramos por palabra clave
        if (keyword !== '') {
            filteredRoles = searchRolesByKeyword(keyword);
        }
        
        // Luego filtramos por estado (si no es 'all')
        if (status !== 'all') {
            filteredRoles = filteredRoles.filter(role => role.status === status);
        }
        
        renderRolesTable(filteredRoles);
    }
    
    // Mostrar notificación
    function showNotification(message) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Estilos para la notificación
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#2ecc71';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        // Añadir al DOM
        document.body.appendChild(notification);
        
        // Mostrar notificación con animación
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Ocultar y eliminar después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Inicializar paginación (dummy, sin funcionalidad real)
    function initPagination() {
        const paginationButtons = document.querySelectorAll('.pagination .btn-page');
        
        paginationButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Solo para demostración
                if (this.disabled || this.classList.contains('active')) return;
                
                // Quitar active de todos los botones
                paginationButtons.forEach(b => b.classList.remove('active'));
                
                // Marcar este botón como activo
                this.classList.add('active');
            });
        });
    }
    
    // === Event Listeners ===
    
    // Botón para añadir nuevo rol
    btnAddRole.addEventListener('click', openNewRoleModal);
    
    // Botones para cerrar modales
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Botón cancelar en modal de rol
    btnCancel.addEventListener('click', closeModals);
    
    // Botón cancelar en modal de confirmación
    btnCancelDelete.addEventListener('click', closeModals);
    
    // Envío del formulario de rol
    roleForm.addEventListener('submit', saveRole);
    
    // Botón confirmar eliminación
    btnConfirmDelete.addEventListener('click', deleteRole);
    
    // Búsqueda de roles
    searchRoles.addEventListener('input', applyFilters);
    
    // Filtro por estado
    filterStatus.addEventListener('change', applyFilters);
    
    // Botón de refrescar
    btnRefresh.addEventListener('click', function() {
        searchRoles.value = '';
        filterStatus.value = 'all';
        renderRolesTable();
    });
    
    // Inicializar la tabla y funcionalidades
    renderRolesTable();
    initPagination();
    
    // Cerrar modales al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === roleModal) {
            closeModals();
        }
        if (e.target === confirmDeleteModal) {
            closeModals();
        }
    });
});
