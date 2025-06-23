// Selección de elementos
const addToCart = document.querySelectorAll('[data-btn-action="add-btn-cart"]');
const closeModal = document.querySelector('.jsModalClose');
const modal = document.getElementById('jsModalCarrito');
const cartItemsContainer = document.getElementById('cartItems');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('totalCart');
const mainContent = document.getElementById('mainContent'); // Contenedor principal

let cart = JSON.parse(localStorage.getItem('cart')) || []; // Cargar el carrito desde localStorage

// Función para actualizar el carrito en el modal
function updateCart() {
    cartItemsContainer.innerHTML = ''; // Limpiar la lista de productos
    let subtotal = 0;
    cart.forEach((item, index) => {
        const productElement = document.createElement('div');
        productElement.classList.add('modal__item');
        productElement.innerHTML = `
            <div class="modal__thumb">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="modal__text-product">
                <p>${item.name}</p>
                <p><strong>$${parseFloat(item.price.replace(/\./g, '')).toLocaleString('es-CO')}</strong></p>
                <button class="remove-btn" data-index="${index}">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(productElement);
        subtotal += parseFloat(item.price.replace(/\./g, ''));
    });

    // Actualizar subtotal y total
    subtotalElement.textContent = `$${subtotal.toLocaleString('es-CO')}`;
    totalElement.textContent = `Total: $${subtotal.toLocaleString('es-CO')}`;

    // Agregar funcionalidad de eliminar
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            cart.splice(index, 1); // Eliminar producto del carrito
            updateLocalStorage(); // Guardar cambios en localStorage
            updateCart(); // Actualizar el carrito en la interfaz
        });
    });
}

// Agregar productos al carrito
addToCart.forEach(btn => {
    btn.addEventListener('click', (event) => {
        const productElement = event.target.closest('.product-grid__item');
        const productName = productElement.getAttribute('data-name');
        const productPrice = productElement.getAttribute('data-price');
        const productImage = productElement.querySelector('img').src;

        const product = {
            name: productName,
            price: productPrice,
            image: productImage
        };

        // Agregar producto al carrito
        cart.push(product);
        updateLocalStorage(); // Guardar cambios en localStorage
        updateCart(); // Actualizar el carrito en la interfaz
        modal.classList.add('active'); // Abrir modal
        mainContent.classList.add('content-shift'); // Desplazar el contenido
    });
});

// Cerrar el modal
closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    mainContent.classList.remove('content-shift'); // Volver el contenido a su lugar
});

// Cerrar el modal haciendo clic fuera del contenido
window.onclick = (event) => {
    if (event.target === modal) {
        modal.classList.remove('active');
        mainContent.classList.remove('content-shift'); // Volver el contenido a su lugar
    }
};

// Función para actualizar el carrito en localStorage
function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Obtener el servicio seleccionado del localStorage
const selectedService = localStorage.getItem("selectedService");
if (selectedService) {
    document.getElementById('carrito').innerHTML = `Servicio seleccionado: ${selectedService}`;
} else {
    document.getElementById('carrito').innerHTML = "No se ha seleccionado un servicio.";
}

// Cargar el carrito al iniciar la página (recargar carrito desde localStorage)
document.addEventListener("DOMContentLoaded", function() {
    updateCart(); // Actualizar el carrito al cargar la página
});

const serviceSelector = document.getElementById('serviceSelector');
const selectedServicesContainer = document.getElementById('selectedServices');
const selectedServices = new Set();

serviceSelector.addEventListener('change', () => {
    const value = serviceSelector.value;
    if (value && !selectedServices.has(value)) {
        selectedServices.add(value);

        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.textContent = value;

        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.textContent = '×';

        closeBtn.addEventListener('click', () => {
            selectedServices.delete(value);
            chip.remove();
        });

        chip.appendChild(closeBtn);
        selectedServicesContainer.appendChild(chip);
    }

    serviceSelector.value = ''; // reset para seguir eligiendo
});
