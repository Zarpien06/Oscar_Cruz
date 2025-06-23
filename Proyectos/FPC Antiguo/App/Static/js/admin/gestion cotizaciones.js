          // Variables globales
          let cotizaciones = [];
          let currentPage = 1;
          const itemsPerPage = 10;
          let currentCotizacionId = null;
          
          // Elementos DOM
          const searchInput = document.getElementById('searchCotizacion');
          const filterStatus = document.getElementById('filterStatus');
          const filterDate = document.getElementById('filterDate');
          const cotizacionesTable = document.getElementById('cotizacionesTable');
          const prevPageBtn = document.getElementById('prevPage');
          const nextPageBtn = document.getElementById('nextPage');
          const currentPageSpan = document.getElementById('currentPage');
          const newCotizacionBtn = document.getElementById('newCotizacion');
          
          // Modales
          const cotizacionModal = document.getElementById('cotizacionModal');
          const viewCotizacionModal = document.getElementById('viewCotizacionModal');
          const deleteModal = document.getElementById('deleteModal');
          const closeButtons = document.querySelectorAll('.close');
          
          // Botones
          const saveBtn = document.getElementById('saveBtn');
          const cancelBtn = document.getElementById('cancelBtn');
          const printBtn = document.getElementById('printBtn');
          const updateStatusBtn = document.getElementById('updateStatusBtn');
          const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
          const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
          
          // Elementos del formulario
          const cotizacionForm = document.getElementById('cotizacionForm');
          const serviceCheckboxes = document.querySelectorAll('.service-checkbox');
          const totalAmountSpan = document.getElementById('totalAmount');
          
          // Inicialización
          document.addEventListener('DOMContentLoaded', () => {
              loadCotizacionesFromStorage();
              setupEventListeners();
              renderCotizaciones();
          });
          
          // Cargar datos desde localStorage
          function loadCotizacionesFromStorage() {
              const storedCotizaciones = localStorage.getItem('cotizaciones');
              if (storedCotizaciones) {
                  cotizaciones = JSON.parse(storedCotizaciones);
              } else {
                  // Datos de ejemplo para desarrollo
                  cotizaciones = [
                      {
                          id: 1,
                          cliente: 'Juan Pérez',
                          email: 'juan@example.com',
                          telefono: '3001234567',
                          vehiculo: 'Toyota Corolla',
                          año: 2019,
                          servicios: [
                              { nombre: 'Pintura general', precio: 350000 },
                              { nombre: 'Pulido y brillado', precio: 120000 }
                          ],
                          total: 470000,
                          fecha: '2023-10-15',
                          estado: 'Pendiente',
                          observaciones: 'Cliente solicita atención prioritaria'
                      },
                      {
                          id: 2,
                          cliente: 'María López',
                          email: 'maria@example.com',
                          telefono: '3109876543',
                          vehiculo: 'Mazda 3',
                          año: 2020,
                          servicios: [
                              { nombre: 'Latonería', precio: 180000 }
                          ],
                          total: 180000,
                          fecha: '2023-10-10',
                          estado: 'Aprobada',
                          observaciones: 'Golpe en guardafango delantero derecho'
                      }
                  ];
                  saveCotizacionesToStorage();
              }
          }
          
          // Guardar datos en localStorage
          function saveCotizacionesToStorage() {
              localStorage.setItem('cotizaciones', JSON.stringify(cotizaciones));
          }
          
          // Configurar los event listeners
          function setupEventListeners() {
              // Filtros y búsqueda
              searchInput.addEventListener('input', renderCotizaciones);
              filterStatus.addEventListener('change', renderCotizaciones);
              filterDate.addEventListener('change', renderCotizaciones);
              
              // Paginación
              prevPageBtn.addEventListener('click', () => {
                  if (currentPage > 1) {
                      currentPage--;
                      renderCotizaciones();
                  }
              });
              
              nextPageBtn.addEventListener('click', () => {
                  const totalPages = Math.ceil(getFilteredCotizaciones().length / itemsPerPage);
                  if (currentPage < totalPages) {
                      currentPage++;
                      renderCotizaciones();
                  }
              });
              
              // Nueva cotización
              newCotizacionBtn.addEventListener('click', openNewCotizacionModal);
              
              // Cerrar modales
              closeButtons.forEach(button => {
                  button.addEventListener('click', () => {
                      cotizacionModal.style.display = 'none';
                      viewCotizacionModal.style.display = 'none';
                      deleteModal.style.display = 'none';
                  });
              });
              
              // Click fuera del modal para cerrar
              window.addEventListener('click', (event) => {
                  if (event.target === cotizacionModal) {
                      cotizacionModal.style.display = 'none';
                  } else if (event.target === viewCotizacionModal) {
                      viewCotizacionModal.style.display = 'none';
                  } else if (event.target === deleteModal) {
                      deleteModal.style.display = 'none';
                  }
              });
              
              // Formulario de cotización
              cotizacionForm.addEventListener('submit', handleFormSubmit);
              cancelBtn.addEventListener('click', () => {
                  cotizacionModal.style.display = 'none';
              });
              
              // Actualizar total al seleccionar servicios
              serviceCheckboxes.forEach(checkbox => {
                  checkbox.addEventListener('change', updateTotal);
              });
              
              // Acciones de modales
              printBtn.addEventListener('click', printCotizacion);
              updateStatusBtn.addEventListener('click', openUpdateStatusOptions);
              confirmDeleteBtn.addEventListener('click', deleteCotizacion);
              cancelDeleteBtn.addEventListener('click', () => {
                  deleteModal.style.display = 'none';
              });
          }
          
          // Filtrar cotizaciones según criterios de búsqueda
          function getFilteredCotizaciones() {
              let filtered = [...cotizaciones];
              
              // Filtrar por búsqueda
              const searchTerm = searchInput.value.toLowerCase();
              if (searchTerm) {
                  filtered = filtered.filter(cotizacion => 
                      cotizacion.cliente.toLowerCase().includes(searchTerm) ||
                      cotizacion.vehiculo.toLowerCase().includes(searchTerm) ||
                      cotizacion.id.toString().includes(searchTerm)
                  );
              }
              
              // Filtrar por estado
              const statusFilter = filterStatus.value;
              if (statusFilter !== 'all') {
                  const statusMapping = {
                      'pending': 'Pendiente',
                      'approved': 'Aprobada',
                      'rejected': 'Rechazada'
                  };
                  filtered = filtered.filter(cotizacion => cotizacion.estado === statusMapping[statusFilter]);
              }
              
              // Filtrar por fecha
              const dateFilter = filterDate.value;
              if (dateFilter !== 'all') {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  
                  filtered = filtered.filter(cotizacion => {
                      const cotizacionDate = new Date(cotizacion.fecha);
                      
                      if (dateFilter === 'today') {
                          return cotizacionDate.toDateString() === today.toDateString();
                      } else if (dateFilter === 'week') {
                          const weekStart = new Date(today);
                          weekStart.setDate(today.getDate() - today.getDay());
                          return cotizacionDate >= weekStart;
                      } else if (dateFilter === 'month') {
                          return cotizacionDate.getMonth() === today.getMonth() && 
                                 cotizacionDate.getFullYear() === today.getFullYear();
                      }
                      return true;
                  });
              }
              
              return filtered;
          }
          
          // Renderizar la lista de cotizaciones
          function renderCotizaciones() {
              const filteredCotizaciones = getFilteredCotizaciones();
              const totalItems = filteredCotizaciones.length;
              const totalPages = Math.ceil(totalItems / itemsPerPage);
              
              // Actualizar paginación
              currentPageSpan.textContent = `Página ${currentPage} de ${totalPages || 1}`;
              prevPageBtn.disabled = currentPage <= 1;
              nextPageBtn.disabled = currentPage >= totalPages;
              
              // Calcular qué items mostrar
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              const cotizacionesToShow = filteredCotizaciones.slice(startIndex, endIndex);
              
              // Limpiar la tabla
              const tbody = cotizacionesTable.querySelector('tbody');
              tbody.innerHTML = '';
              
              // Agregar cotizaciones a la tabla
              if (cotizacionesToShow.length === 0) {
                  const tr = document.createElement('tr');
                  tr.innerHTML = '<td colspan="8" class="no-data">No se encontraron cotizaciones</td>';
                  tbody.appendChild(tr);
              } else {
                  cotizacionesToShow.forEach(cotizacion => {
                      const tr = document.createElement('tr');
                      
                      // Servicios en formato lista
                      const serviciosText = cotizacion.servicios.map(s => s.nombre).join(', ');
                      
                      // Formatear precio
                      const formattedTotal = formatCurrency(cotizacion.total);
                      
                      // Formatear fecha
                      const fechaFormateada = formatDate(cotizacion.fecha);
                      
                      // Estado con clase para estilo
                      const estadoClass = getStatusClass(cotizacion.estado);
                      
                      tr.innerHTML = `
                          <td>${cotizacion.id}</td>
                          <td>${cotizacion.cliente}</td>
                          <td>${cotizacion.vehiculo} (${cotizacion.año})</td>
                          <td>${serviciosText}</td>
                          <td>${formattedTotal}</td>
                          <td>${fechaFormateada}</td>
                          <td><span class="status ${estadoClass}">${cotizacion.estado}</span></td>
                          <td class="actions">
                              <button class="btn-icon view-btn" data-id="${cotizacion.id}">
                                  <i class="fas fa-eye"></i>
                              </button>
                              <button class="btn-icon edit-btn" data-id="${cotizacion.id}">
                                  <i class="fas fa-edit"></i>
                              </button>
                              <button class="btn-icon delete-btn" data-id="${cotizacion.id}">
                                  <i class="fas fa-trash"></i>
                              </button>
                          </td>
                      `;
                      
                      tbody.appendChild(tr);
                  });
                  
                  // Agregar event listeners a los botones
                  document.querySelectorAll('.view-btn').forEach(btn => {
                      btn.addEventListener('click', () => openViewCotizacionModal(parseInt(btn.dataset.id)));
                  });
                  
                  document.querySelectorAll('.edit-btn').forEach(btn => {
                      btn.addEventListener('click', () => openEditCotizacionModal(parseInt(btn.dataset.id)));
                  });
                  
                  document.querySelectorAll('.delete-btn').forEach(btn => {
                      btn.addEventListener('click', () => openDeleteConfirmModal(parseInt(btn.dataset.id)));
                  });
              }
          }
          
          // Funciones auxiliares
          function formatCurrency(amount) {
              return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
          }
          
          function formatDate(dateString) {
              const date = new Date(dateString);
              return date.toLocaleDateString('es-CO');
          }
          
          function getStatusClass(status) {
              switch(status) {
                  case 'Pendiente': return 'status-pending';
                  case 'Aprobada': return 'status-approved';
                  case 'Rechazada': return 'status-rejected';
                  default: return '';
              }
          }
          
          // Modal para nueva cotización
          function openNewCotizacionModal() {
              // Limpiar formulario
              cotizacionForm.reset();
              document.getElementById('cotizacionId').value = '';
              document.getElementById('modalTitle').textContent = 'Nueva Cotización';
              updateTotal();
              currentCotizacionId = null;
              
              // Mostrar modal
              cotizacionModal.style.display = 'block';
          }
          
          // Modal para editar cotización
          function openEditCotizacionModal(id) {
              const cotizacion = cotizaciones.find(c => c.id === id);
              if (!cotizacion) return;
              
              currentCotizacionId = id;
              document.getElementById('modalTitle').textContent = 'Editar Cotización';
              
              // Llenar formulario
              document.getElementById('cotizacionId').value = cotizacion.id;
              document.getElementById('clientName').value = cotizacion.cliente;
              document.getElementById('clientEmail').value = cotizacion.email;
              document.getElementById('clientPhone').value = cotizacion.telefono;
              document.getElementById('carModel').value = cotizacion.vehiculo;
              document.getElementById('carYear').value = cotizacion.año;
              document.getElementById('observations').value = cotizacion.observaciones || '';
              
              // Marcar servicios
              serviceCheckboxes.forEach(checkbox => {
                  const serviceName = checkbox.nextElementSibling.textContent.split('(')[0].trim();
                  checkbox.checked = cotizacion.servicios.some(s => s.nombre === serviceName);
              });
              
              updateTotal();
              cotizacionModal.style.display = 'block';
          }
          
          // Modal para ver detalles de cotización
          function openViewCotizacionModal(id) {
              const cotizacion = cotizaciones.find(c => c.id === id);
              if (!cotizacion) return;
              
              currentCotizacionId = id;
              
              // Llenar datos en el modal
              document.getElementById('viewCotizacionId').textContent = cotizacion.id;
              document.getElementById('viewFecha').textContent = formatDate(cotizacion.fecha);
              document.getElementById('viewClientName').textContent = cotizacion.cliente;
              document.getElementById('viewClientEmail').textContent = cotizacion.email;
              document.getElementById('viewClientPhone').textContent = cotizacion.telefono;
              document.getElementById('viewCarModel').textContent = cotizacion.vehiculo;
              document.getElementById('viewCarYear').textContent = cotizacion.año;
              document.getElementById('viewObservations').textContent = cotizacion.observaciones || 'Ninguna';
              document.getElementById('viewTotalAmount').textContent = formatCurrency(cotizacion.total);
              
              const statusElement = document.getElementById('viewStatus');
              statusElement.textContent = cotizacion.estado;
              statusElement.className = getStatusClass(cotizacion.estado);
              
              // Llenar tabla de servicios
              const servicesList = document.getElementById('viewServicesList');
              servicesList.innerHTML = '';
              
              cotizacion.servicios.forEach(servicio => {
                  const tr = document.createElement('tr');
                  tr.innerHTML = `
                      <td>${servicio.nombre}</td>
                      <td>${formatCurrency(servicio.precio)}</td>
                  `;
                  servicesList.appendChild(tr);
              });
              
              viewCotizacionModal.style.display = 'block';
          }
          
          // Modal para confirmar eliminación
          function openDeleteConfirmModal(id) {
              currentCotizacionId = id;
              deleteModal.style.display = 'block';
          }
          
          // Actualizar total al seleccionar servicios
          function updateTotal() {
              let total = 0;
              serviceCheckboxes.forEach(checkbox => {
                  if (checkbox.checked) {
                      total += parseInt(checkbox.dataset.price);
                  }
              });
              totalAmountSpan.textContent = formatCurrency(total);
          }
          
          // Manejar envío del formulario
          function handleFormSubmit(e) {
              e.preventDefault();
              
              // Obtener valores del formulario
              const cliente = document.getElementById('clientName').value;
              const email = document.getElementById('clientEmail').value;
              const telefono = document.getElementById('clientPhone').value;
              const vehiculo = document.getElementById('carModel').value;
              const año = parseInt(document.getElementById('carYear').value);
              const observaciones = document.getElementById('observations').value;
              
              // Obtener servicios seleccionados
              const servicios = [];
              let total = 0;
              serviceCheckboxes.forEach(checkbox => {
                  if (checkbox.checked) {
                      const precio = parseInt(checkbox.dataset.price);
                      const nombre = checkbox.nextElementSibling.textContent.split('(')[0].trim();
                      servicios.push({ nombre, precio });
                      total += precio;
                  }
              });
              
              // Validación básica
              if (servicios.length === 0) {
                  alert('Debe seleccionar al menos un servicio');
                  return;
              }
              
              // Fecha actual
              const fecha = new Date().toISOString().split('T')[0];
              
              // Crear o actualizar cotización
              if (currentCotizacionId) {
                  // Actualizar existente
                  const index = cotizaciones.findIndex(c => c.id === currentCotizacionId);
                  if (index !== -1) {
                      cotizaciones[index] = {
                          ...cotizaciones[index],
                          cliente,
                          email,
                          telefono,
                          vehiculo,
                          año,
                          servicios,
                          total,
                          observaciones,
                          // Mantener fecha y estado originales
                          fecha: cotizaciones[index].fecha,
                          estado: cotizaciones[index].estado
                      };
                  }
              } else {
                  // Crear nueva
                  const newId = cotizaciones.length > 0 ? Math.max(...cotizaciones.map(c => c.id)) + 1 : 1;
                  cotizaciones.push({
                      id: newId,
                      cliente,
                      email,
                      telefono,
                      vehiculo,
                      año,
                      servicios,
                      total,
                      fecha,
                      estado: 'Pendiente',
                      observaciones
                  });
              }
              
              // Guardar y actualizar vista
              saveCotizacionesToStorage();
              renderCotizaciones();
              cotizacionModal.style.display = 'none';
          }
          
          // Eliminar cotización
          function deleteCotizacion() {
              if (currentCotizacionId) {
                  cotizaciones = cotizaciones.filter(c => c.id !== currentCotizacionId);
                  saveCotizacionesToStorage();
                  renderCotizaciones();
                  deleteModal.style.display = 'none';
                  currentCotizacionId = null;
              }
          }
          
          // Imprimir cotización
          function printCotizacion() {
              const cotizacion = cotizaciones.find(c => c.id === currentCotizacionId);
              if (!cotizacion) return;
              
              // Crear contenido para imprimir
              const printContent = `
                  <html>
                  <head>
                      <title>Cotización #${cotizacion.id} - Full Paint Cars</title>
                      <style>
                          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
                          .header { display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
                          .company-info h1 { margin: 0; color: #333; }
                          .company-info p { margin: 5px 0; color: #666; }
                          .cotizacion-info { text-align: right; }
                          h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
                          .section { margin-bottom: 20px; }
                          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                          th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
                          th { background-color: #f8f8f8; }
                          .total { font-size: 1.2em; font-weight: bold; text-align: right; margin-top: 20px; }
                          .footer { margin-top: 50px; text-align: center; font-size: 0.9em; color: #666; }
                      </style>
                  </head>
                  <body>
                      <div class="header">
                          <div class="company-info">
                              <h1>Full Paint Cars</h1>
                              <p>Servicios Automotrices de Calidad</p>
                              <p>NIT: 900.123.456-7</p>
                              <p>Dirección: Calle 123 #45-67, Bogotá</p>
                              <p>Teléfono: (601) 123-4567</p>
                          </div>
                          <div class="cotizacion-info">
                              <h2>COTIZACIÓN</h2>
                              <p><strong>Nº:</strong> ${cotizacion.id}</p>
                              <p><strong>Fecha:</strong> ${formatDate(cotizacion.fecha)}</p>
                          </div>
                      </div>
                      
                      <div class="section">
                          <h2>Información del Cliente</h2>
                          <p><strong>Nombre:</strong> ${cotizacion.cliente}</p>
                          <p><strong>Email:</strong> ${cotizacion.email}</p>
                          <p><strong>Teléfono:</strong> ${cotizacion.telefono}</p>
                      </div>
                      
                      <div class="section">
                          <h2>Información del Vehículo</h2>
                          <p><strong>Modelo:</strong> ${cotizacion.vehiculo}</p>
                          <p><strong>Año:</strong> ${cotizacion.año}</p>
                      </div>
                      
                      <div class="section">
                          <h2>Servicios Cotizados</h2>
                          <table>
                              <thead>
                                  <tr>
                                      <th>Descripción</th>
                                      <th style="text-align: right;">Precio</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  ${cotizacion.servicios.map(servicio => `
                                      <tr>
                                          <td>${servicio.nombre}</td>
                                          <td style="text-align: right;">${formatCurrency(servicio.precio)}</td>
                                      </tr>
                                  `).join('')}
                              </tbody>
                          </table>
                          <div class="total">
                              Total: ${formatCurrency(cotizacion.total)}
                          </div>
                      </div>
                      
                      ${cotizacion.observaciones ? `
                          <div class="section">
                              <h2>Observaciones</h2>
                              <p>${cotizacion.observaciones}</p>
                          </div>
                      ` : ''}
                      
                      <div class="section">
                          <p><strong>Estado:</strong> ${cotizacion.estado}</p>
                          <p>Esta cotización tiene validez de 15 días a partir de la fecha de emisión.</p>
                      </div>
                      
                      <div class="footer">
                          <p>Full Paint Cars - Todos los derechos reservados © ${new Date().getFullYear()}</p>
                      </div>
                  </body>
                  </html>
              `;
              
              // Abrir ventana de impresión
              const printWindow = window.open('', '_blank');
              printWindow.document.write(printContent);
              printWindow.document.close();
              printWindow.focus();
              // Esperar a que se cargue el contenido
              setTimeout(() => {
                  printWindow.print();
                  printWindow.close();
              }, 500);
          }
          
          // Actualizar estado de cotización
          function openUpdateStatusOptions() {
              const cotizacion = cotizaciones.find(c => c.id === currentCotizacionId);
              if (!cotizacion) return;
              
              // Crear elementos para selección de estado
              const statusContainer = document.createElement('div');
              statusContainer.className = 'status-options';
              statusContainer.innerHTML = `
                  <h3>Actualizar Estado</h3>
                  <div class="status-btns">
                      <button class="status-btn ${cotizacion.estado === 'Pendiente' ? 'active' : ''}" data-status="Pendiente">Pendiente</button>
                      <button class="status-btn ${cotizacion.estado === 'Aprobada' ? 'active' : ''}" data-status="Aprobada">Aprobada</button>
                      <button class="status-btn ${cotizacion.estado === 'Rechazada' ? 'active' : ''}" data-status="Rechazada">Rechazada</button>
                  </div>
              `;
              
              // Reemplazar botón con opciones
              const modalActions = document.querySelector('.modal-actions');
              modalActions.innerHTML = '';
              modalActions.appendChild(statusContainer);
              
              // Agregar botón para volver
              const backBtn = document.createElement('button');
              backBtn.className = 'btn-secondary';
              backBtn.innerHTML = 'Volver';
              backBtn.addEventListener('click', () => {
                  modalActions.innerHTML = `
                      <button type="button" id="printBtn" class="btn-secondary">
                          <i class="fas fa-print"></i> Imprimir
                      </button>
                      <button type="button" id="updateStatusBtn" class="btn-primary">
                          Actualizar Estado
                      </button>
                  `;
                  // Restaurar event listeners
                  document.getElementById('printBtn').addEventListener('click', printCotizacion);
                  document.getElementById('updateStatusBtn').addEventListener('click', openUpdateStatusOptions);
              });
              modalActions.appendChild(backBtn);
              
              // Agregar eventos a los botones de estado
              document.querySelectorAll('.status-btn').forEach(btn => {
                  btn.addEventListener('click', () => {
                      const newStatus = btn.dataset.status;
                      updateCotizacionStatus(newStatus);
                      
                      // Actualizar vista
                      document.getElementById('viewStatus').textContent = newStatus;
                      document.getElementById('viewStatus').className = getStatusClass(newStatus);
                      
                      // Restaurar botones originales
                      backBtn.click();
                  });
              });
          }
          
          // Actualizar estado de cotización
          function updateCotizacionStatus(newStatus) {
              const index = cotizaciones.findIndex(c => c.id === currentCotizacionId);
              if (index !== -1) {
                  cotizaciones[index].estado = newStatus;
                  saveCotizacionesToStorage();
                  renderCotizaciones();
              }
          }
          