
// Elementos DOM
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messageContainer = document.getElementById('messageContainer');
const fileInput = document.getElementById('fileInput');
const attachmentBtn = document.querySelector('.attachment-btn');
const infoBtn = document.querySelector('.info-btn');
const closeInfoBtn = document.querySelector('.close-info');
const chatInfo = document.getElementById('chatInfo');
const chatContacts = document.querySelectorAll('.chat-contact');
const closeBtn = document.querySelector('.close-btn');
const chatFilterButtons = document.querySelectorAll('.chat-filter button');

// Evento para enviar mensajes
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Función para enviar mensaje
function sendMessage() {
    const messageText = messageInput.value.trim();
    if (messageText === '') return;
    
    const currentTime = new Date();
    const timeString = `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'message sent';
    messageElement.innerHTML = `
        <div class="message-content">
            <p>${messageText}</p>
            <span class="time">${timeString}</span>
        </div>
    `;
    
    messageContainer.appendChild(messageElement);
    messageInput.value = '';
    
    // Scroll al último mensaje
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Manejo de archivos adjuntos
attachmentBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        
        const currentTime = new Date();
        const timeString = `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message sent';
        
        const fileIcon = file.type.includes('image') ? 'fa-file-image' : 'fa-file-pdf';
        
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="attachment">
                    <i class="fas ${fileIcon}"></i>
                    <span>${file.name}</span>
                </div>
                <span class="time">${timeString}</span>
            </div>
        `;
        
        messageContainer.appendChild(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }
});

// Panel de información
infoBtn.addEventListener('click', () => {
    chatInfo.classList.toggle('active');
});

closeInfoBtn.addEventListener('click', () => {
    chatInfo.classList.remove('active');
});

// Cambiar entre contactos de chat
chatContacts.forEach(contact => {
    contact.addEventListener('click', () => {
        // Quitar clase activa de todos los contactos
        chatContacts.forEach(c => c.classList.remove('active'));
        // Agregar clase activa al contacto seleccionado
        contact.classList.add('active');
        // Aquí se podría cargar la conversación correspondiente
        // usando el atributo data-id para identificar la conversación
        const chatId = contact.getAttribute('data-id');
        // loadConversation(chatId); // Función que cargaría los mensajes
    });
});

// Cerrar chat actual
closeBtn.addEventListener('click', () => {
    // Aquí puedes implementar la lógica para cerrar el chat actual
    alert('Chat cerrado');
});

// Filtros de chat
chatFilterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Quitar clase activa de todos los botones
        chatFilterButtons.forEach(btn => btn.classList.remove('active'));
        // Agregar clase activa al botón seleccionado
        button.classList.add('active');
        
        // Aquí se implementaría la lógica para filtrar los chats
        const filter = button.textContent.toLowerCase();
        // filterChats(filter); // Función que filtraría los chats
    });
});

// Función para cargar conversación (simulada)
function loadConversation(chatId) {
    // Esta función cargaría los mensajes de la conversación seleccionada
    console.log(`Cargando conversación ${chatId}`);
    // Aquí se haría una petición al servidor para obtener los mensajes
}

// Función para filtrar chats (simulada)
function filterChats(filter) {
    // Esta función filtraría los chats según el filtro seleccionado
    console.log(`Filtrando chats: ${filter}`);
    // Implementación del filtrado
}
