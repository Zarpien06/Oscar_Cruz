 // Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Toggle para el menú lateral
    const toggleMenu = document.querySelector('.toggle-menu');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');
    
    toggleMenu.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
    });
    
    // Manejo de los items del menú
    const menuItems = document.querySelectorAll('.menu li');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remover clase active de todos los items
            menuItems.forEach(i => i.classList.remove('active'));
            // Agregar clase active al item clickeado
            this.classList.add('active');
        });
    });
    
    // Inicializar el gráfico de actividad de usuarios
    const ctx = document.getElementById('userActivityChart').getContext('2d');
    
    // Datos de ejemplo para el gráfico
    const userData = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [
            {
                label: 'Usuarios Activos',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                tension: 0.4
            },
            {
                label: 'Nuevos Registros',
                data: [28, 48, 40, 19, 26, 27, 20],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    };
    
    const userActivityChart = new Chart(ctx, {
        type: 'line',
        data: userData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end'
                }
            }
        }
    });
    
    // Manejo del selector de tiempo para el gráfico
    const timeSelector = document.querySelector('.widget-actions select');
    
    timeSelector.addEventListener('change', function() {
        // Simular cambio de datos según la selección de tiempo
        let newData;
        
        switch(this.value) {
            case 'Último mes':
                newData = [150, 220, 180, 250, 120, 190, 210, 170, 230, 200, 160, 180, 
                          190, 210, 170, 150, 220, 180, 250, 120, 190, 210, 170, 230, 
                          200, 160, 180, 190, 210, 170];
                userActivityChart.data.labels = Array.from({length: 30}, (_, i) => i + 1);
                userActivityChart.data.datasets[0].data = newData;
                userActivityChart.data.datasets[1].data = newData.map(n => Math.floor(n * 0.4));
                break;
                
            case 'Último año':
                newData = [500, 620, 750, 800, 760, 820, 900, 850, 750, 820, 880, 950];
                userActivityChart.data.labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                userActivityChart.data.datasets[0].data = newData;
                userActivityChart.data.datasets[1].data = newData.map(n => Math.floor(n * 0.3));
                break;
                
            default: // Últimos 7 días
                userActivityChart.data.labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                userActivityChart.data.datasets[0].data = [65, 59, 80, 81, 56, 55, 40];
                userActivityChart.data.datasets[1].data = [28, 48, 40, 19, 26, 27, 20];
        }
        
        userActivityChart.update();
    });
    
    // Manejar la funcionalidad del chat
    const chatInput = document.querySelector('.chat-input input');
    const chatSendButton = document.querySelector('.chat-input button');
    const chatContainer = document.querySelector('.chat-container');
    
    chatSendButton.addEventListener('click', function() {
        sendMessage();
    });
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Crear nuevo mensaje enviado
            const now = new Date();
            const timeString = 'Ahora';
            
            const messageHTML = `
                <div class="chat-message sent">
                    <div class="message-content">
                        <div class="message-info">
                            <h4>Admin</h4>
                            <span>${timeString}</span>
                        </div>
                        <p>${message}</p>
                    </div>
                    <img src="/api/placeholder/40/40" alt="Admin">
                </div>
            `;
            
            chatContainer.insertAdjacentHTML('beforeend', messageHTML);
            chatInput.value = '';
            
            // Scroll al final del chat
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }
    
    // Funcionalidad para las notificaciones
    const notificationBells = document.querySelectorAll('.notifications, .messages');
    
    notificationBells.forEach(bell => {
        bell.addEventListener('click', function() {
            // Aquí iría la lógica para mostrar las notificaciones
            alert('Panel de notificaciones - Funcionalidad pendiente de implementar');
        });
    });
    
    // Funcionalidad para los botones de acciones en la tabla
    const actionButtons = document.querySelectorAll('.data-table .btn-icon');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('i').className;
            const row = this.closest('tr');
            const cotizacionId = row.querySelector('td:first-child').textContent;
            
            if (action.includes('fa-eye')) {
                alert(`Ver detalles de cotización ${cotizacionId}`);
            } else if (action.includes('fa-edit')) {
                alert(`Editar cotización ${cotizacionId}`);
            } else if (action.includes('fa-trash')) {
                if (confirm(`¿Está seguro que desea eliminar la cotización ${cotizacionId}?`)) {
                    alert(`Cotización ${cotizacionId} eliminada`);
                }
            }
        });
    });
    
    // Botón para crear nueva cotización
    const newQuoteButton = document.querySelector('.btn-primary');
    
    newQuoteButton.addEventListener('click', function() {
        alert('Formulario para crear nueva cotización - Funcionalidad pendiente de implementar');
    });
    
    // Efecto de hover para las tarjetas de estadísticas
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.05)';
        });
    });
});
       