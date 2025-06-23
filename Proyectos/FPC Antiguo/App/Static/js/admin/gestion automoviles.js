 // Datos de muestra para automóviles
let vehiclesData = [
    {
        id: 1,
        plate: "ABC123",
        brand: "Toyota",
        model: "Corolla",
        year: 2023,
        color: "Negro",
        owner: "Juan Pérez",
        phone: "3001234567",
        email: "juan.perez@ejemplo.com",
        status: "active",
        lastService: "2023-12-15",
        notes: "Vehículo en excelentes condiciones."
    },
    {
        id: 2,
        plate: "XYZ789",
        brand: "Honda",
        model: "Civic",
        year: 2022,
        color: "Rojo",
        owner: "María López",
        phone: "3109876543",
        email: "maria.lopez@ejemplo.com",
        status: "maintenance",
        lastService: "2024-01-20",
        notes: "Requiere cambio de aceite y filtros."
    },
    {
        id: 3,
        plate: "DEF456",
        brand: "Mazda",
        model: "CX-5",
        year: 2021,
        color: "Azul",
        owner: "Carlos Ramírez",
        phone: "3202345678",
        email: "carlos.ramirez@ejemplo.com",
        status: "complete",
        lastService: "2024-02-05",
        notes: "Se realizó revisión completa."
    },
    {
        id: 4,
        plate: "GHI789",
        brand: "Chevrolet",
        model: "Spark",
        year: 2020,
        color: "Blanco",
        owner: "Ana Martínez",
        phone: "3153456789",
        email: "ana.martinez@ejemplo.com",
        status: "active",
        lastService: "2023-11-10",
        notes: "Próximo mantenimiento en mayo 2024."
    },
    {
        id: 5,
        plate: "JKL012",
        brand: "Renault",
        model: "Sandero",
        year: 2023,
        color: "Gris",
        owner: "Pedro González",
        phone: "3004567890",
        email: "pedro.gonzalez@ejemplo.com",
        status: "active",
        lastService: "2024-01-05",
        notes: "Vehículo nuevo, primer revisión."
    }
];

// Datos de muestra para historial de servicios
let servicesData = [
    {
        id: 1,
        vehicleId: 1,
        date: "2023-12-15",
        type: "Mantenimiento preventivo",
        description: "Cambio de aceite, filtros y revisión general",
        status: "complete"
    },
    {
        id: 2,
        vehicleId: 1,
        date: "2023-10-20",
        type: "Reparación",
        description: "Cambio de pastillas de freno",
        status: "complete"
    },
    {
        id: 3,
        vehicleId: 2,
        date: "2024-01-20",
        type: "Diagnóstico",
        description: "Revisión del sistema eléctrico",
        status: "in-progress"
    },
    {
        id: 4,
        vehicleId: 3,
        date: "2024-02-05",
        type: "Mantenimiento completo",
        description: "Revisión general, cambio de aceite y ajustes",
        status: "complete"
    },
    {
        id: 5,
        vehicleId: 4,
        date: "2023-11-10",
        type: "Mantenimiento preventivo",
        description: "Cambio de aceite y filtros",
        status: "complete"
    },
    {
        id: 6,
        vehicleId: 5,
        date: "2024-01-05",
        type: "Revisión inicial",
        description: "Verificación de sistemas y fluidos",
        status: "complete"
    }
];

// Variables globales
let currentPage = 1;
const itemsPerPage = 5;
let currentVehicleId = null;
let isEditing = false;

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la aplicación
    loadVehiclesTable();
    setupEventListeners();
});

// Función para configurar los event listeners
function setupEventListeners() {
    // Botón para agregar vehículo
    document.getElementById('add-vehicle-btn').addEventListener('click', () => {
        openAddVehicleModal();
    });

    // Cerrar modales
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Botón cancelar en formulario
    document.getElementById('cancel-btn').addEventListener('click', closeAllModals);

    // Formulario de vehículo
    document.getElementById('vehicle-form').addEventListener('submit', handleVehicleFormSubmit);

    // Paginación
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadVehiclesTable();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(vehiclesData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadVehiclesTable();
        }
    });

    // Búsqueda
    document.getElementById('search-vehicle').addEventListener('input', debounce(handleSearch, 300));

    // Filtros
    document.getElementById('filter-status').addEventListener('change', loadVehiclesTable);
    document.getElementById('filter-year').addEventListener('change', loadVehiclesTable);

    // Botones de detalles
    document.getElementById('back-btn').addEventListener('click', closeAllModals);
    document.getElementById('edit-btn').addEventListener('click', () => {
        closeModal('details-modal');
        openEditVehicleModal(currentVehicleId);
    });

    // Botones de eliminar
    document.getElementById('cancel-delete-btn').addEventListener('click', closeAllModals);
    document.getElementById('confirm-delete-btn').addEventListener('click', deleteVehicle);
}

// Función para cargar la tabla de vehículos
function loadVehiclesTable() {
    const tableBody = document.querySelector('#vehicles-table tbody');
    tableBody.innerHTML = '';

    // Aplicar filtros
    let filteredVehicles = filterVehicles();
    
    // Calcular paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);
    
    // Actualizar información de página
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    document.getElementById('page-info').textContent = `Página ${currentPage} de ${totalPages || 1}`;
    
    // Generar filas de la tabla
    if (paginatedVehicles.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">No se encontraron vehículos</td>
            </tr>
        `;
        return;
    }
    
    paginatedVehicles.forEach(vehicle => {
        const row = document.createElement('tr');
        
        // Formato de fecha para el último servicio
        const lastServiceDate = new Date(vehicle.lastService);
        const formattedDate = lastServiceDate.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        
        // Determinar clase de estado
        let statusClass = '';
        let statusText = '';
        
        switch (vehicle.status) {
            case 'active':
                statusClass = 'active';
                statusText = 'Activo';
                break;
            case 'maintenance':
                statusClass = 'maintenance';
                statusText = 'En Mantenimiento';
                break;
            case 'complete':
                statusClass = 'complete';
                statusText = 'Completado';
                break;
        }
        
        row.innerHTML = `
            <td>${vehicle.plate}</td>
            <td>${vehicle.brand}</td>
            <td>${vehicle.model}</td>
            <td>${vehicle.year}</td>
            <td>${vehicle.owner}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${formattedDate}</td>
            <td>
                <div class="action-column">
                    <div class="action-icon view-btn" data-id="${vehicle.id}" title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="action-icon edit-btn" data-id="${vehicle.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="action-icon delete-btn" data-id="${vehicle.id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </div>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Configurar event listeners para los botones de acción
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const vehicleId = parseInt(btn.getAttribute('data-id'));
            openVehicleDetailsModal(vehicleId);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const vehicleId = parseInt(btn.getAttribute('data-id'));
            openEditVehicleModal(vehicleId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const vehicleId = parseInt(btn.getAttribute('data-id'));
            openDeleteConfirmationModal(vehicleId);
        });
    });
}

// Función para filtrar vehículos
function filterVehicles() {
    const searchTerm = document.getElementById('search-vehicle').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const yearFilter = document.getElementById('filter-year').value;
    
    return vehiclesData.filter(vehicle => {
        // Filtro de búsqueda
        const matchesSearch = 
            vehicle.plate.toLowerCase().includes(searchTerm) ||
            vehicle.brand.toLowerCase().includes(searchTerm) ||
            vehicle.model.toLowerCase().includes(searchTerm) ||
            vehicle.owner.toLowerCase().includes(searchTerm);
        
        // Filtro de estado
        const matchesStatus = statusFilter === '' || vehicle.status === statusFilter;
        
        // Filtro de año
        let matchesYear = true;
        if (yearFilter !== '') {
            if (yearFilter === 'older') {
                matchesYear = vehicle.year < 2022;
            } else {
                matchesYear = vehicle.year.toString() === yearFilter;
            }
        }
        
        return matchesSearch && matchesStatus && matchesYear;
    });
}

// Función para manejar la búsqueda
function handleSearch() {
    currentPage = 1; // Resetear a la primera página al buscar
    loadVehiclesTable();
}

// Función para abrir el modal de añadir vehículo
function openAddVehicleModal() {
    const modal = document.getElementById('vehicle-modal');
    document.getElementById('modal-title').textContent = 'Agregar Nuevo Automóvil';
    document.getElementById('vehicle-form').reset();
    isEditing = false;
    currentVehicleId = null;
    
    openModal(modal);
}

// Función para abrir el modal de edición de vehículo
function openEditVehicleModal(vehicleId) {
    const modal = document.getElementById('vehicle-modal');
    document.getElementById('modal-title').textContent = 'Editar Automóvil';
    isEditing = true;
    currentVehicleId = vehicleId;
    
    const vehicle = vehiclesData.find(v => v.id === vehicleId);
    if (vehicle) {
        document.getElementById('plate').value = vehicle.plate;
        document.getElementById('brand').value = vehicle.brand;
        document.getElementById('model').value = vehicle.model;
        document.getElementById('year').value = vehicle.year;
        document.getElementById('color').value = vehicle.color;
        document.getElementById('owner').value = vehicle.owner;
        document.getElementById('phone').value = vehicle.phone;
        document.getElementById('email').value = vehicle.email;
        document.getElementById('status').value = vehicle.status;
        document.getElementById('notes').value = vehicle.notes;
    }
    
    openModal(modal);
}

// Función para abrir el modal de detalles del vehículo
function openVehicleDetailsModal(vehicleId) {
    const modal = document.getElementById('details-modal');
    currentVehicleId = vehicleId;
    
    const vehicle = vehiclesData.find(v => v.id === vehicleId);
    if (vehicle) {
        // Llenar información del vehículo
        document.getElementById('detail-brand-model').textContent = `${vehicle.brand} ${vehicle.model}`;
        document.getElementById('detail-plate').textContent = vehicle.plate;
        
        let statusText = '';
        let statusClass = '';
        
        switch (vehicle.status) {
            case 'active':
                statusText = 'Activo';
                statusClass = 'active';
                break;
            case 'maintenance':
                statusText = 'En Mantenimiento';
                statusClass = 'maintenance';
                break;
            case 'complete':
                statusText = 'Completado';
                statusClass = 'complete';
                break;
        }
        
        const statusElement = document.getElementById('detail-status');
        statusElement.textContent = statusText;
        statusElement.className = 'status-badge ' + statusClass;
        
        document.getElementById('detail-year').textContent = vehicle.year;
        document.getElementById('detail-color').textContent = vehicle.color;
        document.getElementById('detail-owner').textContent = vehicle.owner;
        document.getElementById('detail-phone').textContent = vehicle.phone || 'No registrado';
        document.getElementById('detail-email').textContent = vehicle.email || 'No registrado';
        document.getElementById('detail-notes').textContent = vehicle.notes || 'Sin notas adicionales';
        
        // Cargar historial de servicios
        loadServicesHistory(vehicleId);
    }
    
    openModal(modal);
}

// Función para cargar el historial de servicios
function loadServicesHistory(vehicleId) {
    const tableBody = document.getElementById('services-history');
    tableBody.innerHTML = '';
    
    const vehicleServices = servicesData.filter(service => service.vehicleId === vehicleId);
    
    if (vehicleServices.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">No hay servicios registrados</td>
            </tr>
        `;
        return;
    }
    
    // Ordenar servicios por fecha (más reciente primero)
    vehicleServices.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Mostrar los últimos 3 servicios
    const recentServices = vehicleServices.slice(0, 3);
    
    recentServices.forEach(service => {
        const row = document.createElement('tr');
        
        // Formato de fecha
        const serviceDate = new Date(service.date);
        const formattedDate = serviceDate.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        
        // Determinar clase de estado
        let statusClass = '';
        let statusText = '';
        
        switch (service.status) {
            case 'complete':
                statusClass = 'active';
                statusText = 'Completado';
                break;
            case 'in-progress':
                statusClass = 'maintenance';
                statusText = 'En Proceso';
                break;
            case 'pending':
                statusClass = 'warning';
                statusText = 'Pendiente';
                break;
        }
        
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${service.type}</td>
            <td>${service.description}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Función para abrir el modal de confirmación de eliminación
function openDeleteConfirmationModal(vehicleId) {
    const modal = document.getElementById('delete-modal');
    currentVehicleId = vehicleId;
    openModal(modal);
}

// Función para manejar el envío del formulario de vehículo
function handleVehicleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        plate: document.getElementById('plate').value,
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        year: parseInt(document.getElementById('year').value),
        color: document.getElementById('color').value,
        owner: document.getElementById('owner').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        status: document.getElementById('status').value,
        notes: document.getElementById('notes').value,
        lastService: new Date().toISOString().split('T')[0]
    };
    
    if (isEditing) {
        // Actualizar vehículo existente
        const index = vehiclesData.findIndex(v => v.id === currentVehicleId);
        if (index !== -1) {
            vehiclesData[index] = { ...vehiclesData[index], ...formData };
            showNotification('Vehículo actualizado correctamente', 'success');
        }
    } else {
        // Crear nuevo vehículo
        const newId = vehiclesData.length > 0 ? Math.max(...vehiclesData.map(v => v.id)) + 1 : 1;
        vehiclesData.push({ id: newId, ...formData });
        showNotification('Vehículo registrado correctamente', 'success');
    }
    
    closeAllModals();
    loadVehiclesTable();
}

// Función para eliminar un vehículo
function deleteVehicle() {
    const index = vehiclesData.findIndex(v => v.id === currentVehicleId);
    if (index !== -1) {
        vehiclesData.splice(index, 1);
        showNotification('Vehículo eliminado correctamente', 'success');
        
        // Eliminar servicios asociados
        servicesData = servicesData.filter(service => service.vehicleId !== currentVehicleId);
        
        closeAllModals();
        loadVehiclesTable();
    }
}

// Funciones para gestionar modales
function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = ''; // Restaurar scroll
}

// Función para mostrar una notificación (Simulada)
function showNotification(message, type = 'info') {
    // Esta función simula una notificación ya que no tenemos un sistema de notificaciones
    // En una implementación real, se usaría un sistema de notificaciones
    console.log(`Notificación (${type}): ${message}`);
    
    // Creamos un elemento de notificación temporal
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Estilos básicos para la notificación
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '2000';
    
    // Diferentes colores según el tipo
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#d4edda';
            notification.style.color = '#155724';
            notification.style.border = '1px solid #c3e6cb';
            break;
        case 'error':
            notification.style.backgroundColor = '#f8d7da';
            notification.style.color = '#721c24';
            notification.style.border = '1px solid #f5c6cb';
            break;
        default:
            notification.style.backgroundColor = '#d1ecf1';
            notification.style.color = '#0c5460';
            notification.style.border = '1px solid #bee5eb';
    }
    
    document.body.appendChild(notification);
    
    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Función de utilidad para debounce (retrasar la ejecución)
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

    