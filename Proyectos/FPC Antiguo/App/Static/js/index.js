function subscribe(event) {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail').value.trim();
    if (!email) {
      alert('Por favor, ingresa un correo electrónico válido.');
      return false;
    }
    alert(`¡Gracias por suscribirte, ${email}!`);
    document.getElementById('newsletterEmail').value = '';
    return false;
  }
  
  function enviarMensaje(event) {
    event.preventDefault();
    const nombre = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('message').value.trim();
  
    if (!nombre || !email || !mensaje) {
      alert('Por favor, completa todos los campos.');
      return false;
    }
  
    alert(`Gracias por tu mensaje, ${nombre}. Te responderemos pronto.`);
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
    return false;
  }
  


  document.addEventListener('DOMContentLoaded', function () {
    new bootstrap.Carousel(document.querySelector('#hero-carousel'), {
      interval: 6000,
      ride: 'carousel',
      pause: false,
      wrap: true
    });
  });


  function enviarMensaje(event) {
    event.preventDefault();
  
    Swal.fire({
      icon: 'success',
      title: '¡Mensaje enviado!',
      text: 'Tu mensaje ha sido enviado, por favor inicia sesión para continuar.',
      confirmButtonText: 'Iniciar sesión',
      confirmButtonColor: '#003366',
      background: '#f0f0f0',
      customClass: {
        popup: 'rounded-4 shadow-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/app/templates/login.html"; // Asegúrate que esta ruta sea correcta
      }
    });
  }
  





document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("contador");
  const target = 137;
  let hasAnimated = false;

  function animateCounter() {
    const duration = 2000; // Duración en milisegundos
    const frameRate = 60; // Frames por segundo
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.floor(progress * target);
      el.textContent = current;

      if (frame >= totalFrames) {
        el.textContent = target + "+";
        clearInterval(counter);
      }
    }, 1000 / frameRate);
  }

  // Observer para detectar cuándo entra en pantalla
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        animateCounter();
        hasAnimated = true;
      }
    });
  }, {
    threshold: 0.6 // Ajusta cuánto tiene que estar visible el contador para empezar la animación
  });

  observer.observe(el);
});




  document.addEventListener("DOMContentLoaded", function () {
    const banner = document.querySelector(".cta-banner");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          banner.classList.add("show");
        }
      });
    }, {
      threshold: 0.5 // Se activa cuando al menos el 50% del banner es visible
    });

    observer.observe(banner);
  });


// Función para cambiar la imagen al pasar el mouse sobre la imagen
const imagenes = document.querySelectorAll('.solucion-card');

imagenes.forEach(imagen => {
  imagen.addEventListener('mouseenter', () => {
    const imgs = imagen.querySelectorAll('.solucion-img');
    imgs.forEach(img => img.classList.remove('active'));
    imagen.querySelector('.solucion-img:nth-child(2)').classList.add('active');
  });
  
  imagen.addEventListener('mouseleave', () => {
    const imgs = imagen.querySelectorAll('.solucion-img');
    imgs.forEach(img => img.classList.remove('active'));
    imagen.querySelector('.solucion-img:first-child').classList.add('active');
  });
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



