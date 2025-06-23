// Mostrar más detalles al hacer clic en "Ver más"
document.querySelectorAll('.widget-header a').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const widget = event.target.closest('.widget');
    const content = widget.querySelector('.widget-content');

    // Toggle (mostrar/ocultar) el contenido de la sección
    content.classList.toggle('expanded');
    if (content.classList.contains('expanded')) {
      event.target.textContent = 'Ver menos';
    } else {
      event.target.textContent = 'Ver todas';
    }
  });
});

// Animación de las barras de progreso
document.querySelectorAll('.progress').forEach((progressBar) => {
  const progressValue = progressBar.style.width;
  progressBar.style.width = '0'; // Empieza en 0
  setTimeout(() => {
    progressBar.style.transition = 'width 2s ease'; // Animación suave
    progressBar.style.width = progressValue; // Restaura el valor original
  }, 200); // Espera para comenzar la animación
});

// Actualización de mensajes recientes
const messages = document.querySelector('.widget-content .list-items');
const addMessage = () => {
  const newMessage = document.createElement('li');
  newMessage.innerHTML = '<strong>Empleado Pedro:</strong> El servicio de tu vehículo ha avanzado.';
  messages.insertBefore(newMessage, messages.firstChild); // Insertar al principio
};

// Simulamos la llegada de un mensaje nuevo cada 5 segundos
setInterval(addMessage, 30000);
