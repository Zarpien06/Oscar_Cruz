document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  const container = document.getElementById('container');
  const registerSection = document.querySelector('.register-container');
  const loginSection = document.querySelector('.login-container');
  const registerButton = document.getElementById("register");
  const loginButton = document.getElementById("login");

  // Ocultar loader
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 500);
  }, 1500);

  // Comprobar si hay mensajes flash para mostrar (de Flask)
  const urlParams = new URLSearchParams(window.location.search);
  const flashMessage = urlParams.get('message');
  const flashType = urlParams.get('type');
  
  if (flashMessage) {
    showAlert(flashMessage, flashType || 'info');
  }

  // Crear y mostrar alertas bonitas
  function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert ${type}`;
    
    // Iconos para diferentes tipos de alerta
    const icons = {
      'success': '<i class="fas fa-check-circle"></i>',
      'error': '<i class="fas fa-exclamation-circle"></i>',
      'warning': '<i class="fas fa-exclamation-triangle"></i>',
      'info': '<i class="fas fa-info-circle"></i>'
    };
    
    alertDiv.innerHTML = `
      ${icons[type] || icons.info}
      <span>${message}</span>
      <button class="close-btn"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Animación de entrada
    setTimeout(() => {
      alertDiv.style.transform = 'translateX(0)';
      alertDiv.style.opacity = '1';
    }, 10);
    
    // Cerrar alerta al hacer clic en botón de cierre
    const closeBtn = alertDiv.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      closeAlert(alertDiv);
    });
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      closeAlert(alertDiv);
    }, 5000);
  }
  
  function closeAlert(alertDiv) {
    alertDiv.style.transform = 'translateX(100%)';
    alertDiv.style.opacity = '0';
    setTimeout(() => {
      alertDiv.remove();
    }, 300);
  }

  // Ajustar vista móvil
  function checkMobileView() {
    const isMobile = window.innerWidth <= 768;
    const current = window.location.pathname.includes('register') ? 'register' : 'login';
    if (isMobile) {
      loginSection.classList.toggle('hidden', current !== 'login');
      loginSection.classList.toggle('visible', current === 'login');
      registerSection.classList.toggle('hidden', current !== 'register');
      registerSection.classList.toggle('visible', current === 'register');
    } else {
      loginSection.classList.remove('hidden', 'visible');
      registerSection.classList.remove('hidden', 'visible');
    }
  }

  checkMobileView();
  window.addEventListener('resize', checkMobileView);

  // Cambiar entre formularios
  registerButton.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      loginSection.classList.add('hidden');
      registerSection.classList.remove('hidden');
      history.pushState(null, null, '/auth/register');
    } else {
      container.classList.add("right-panel-active");
    }
  });

  loginButton.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      registerSection.classList.add('hidden');
      loginSection.classList.remove('hidden');
      history.pushState(null, null, '/auth/login');
    } else {
      container.classList.remove("right-panel-active");
    }
  });

  // Validaciones
  function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = formControl.className.includes('form-control2') ? 'form-control2 error' : 'form-control error';
    formControl.querySelector('small').innerText = message;
  }

  function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = formControl.className.includes('form-control2') ? 'form-control2 success' : 'form-control success';
    formControl.querySelector('small').innerText = '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
  }

  function validatePhone(phone) {
    return /^[0-9]{10}$/.test(phone);
  }

  function checkRequired(inputs) {
    return inputs.every(input => {
      if (input.value.trim() === '') {
        showError(input, 'Este campo es obligatorio');
        return false;
      }
      showSuccess(input);
      return true;
    });
  }

  // Actualizar placeholder del tipo de documento
  const idTypeSelect = document.getElementById('id-type');
  if (idTypeSelect) {
    idTypeSelect.addEventListener('change', () => {
      const idType = idTypeSelect.value;
      const idNumberInput = document.getElementById('id-number');
      const placeholders = {
        cc: 'Número de Cédula de Ciudadanía',
        ti: 'Número de Tarjeta de Identidad',
        ce: 'Número de Cédula de Extranjería',
        pp: 'Número de Pasaporte'
      };
      idNumberInput.placeholder = placeholders[idType] || 'Número de Identificación';
    });
  }

  // Registro
  const registerForm = document.querySelector('.register-container form');
  if (registerForm) {
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const idType = document.getElementById('id-type');
    const idNumber = document.getElementById('id-number');
    const password = document.getElementById('password');

    // Validaciones en tiempo real
    email?.addEventListener("input", () => validateEmail(email.value) ? showSuccess(email) : showError(email, "Correo inválido"));
    phone?.addEventListener("input", () => validatePhone(phone.value) ? showSuccess(phone) : showError(phone, "Teléfono inválido"));
    username?.addEventListener("input", () => username.value.length >= 4 ? showSuccess(username) : showError(username, "Mínimo 4 caracteres"));
    password?.addEventListener("input", () => password.value.length >= 6 ? showSuccess(password) : showError(password, "Mínimo 6 caracteres"));

    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const inputs = [username, email, phone, idType, idNumber, password];
      if (checkRequired(inputs)) {
        // Guardar el correo para autollenarlo en el formulario de login
        localStorage.setItem('registeredEmail', email.value);
        
        // Enviar el formulario
        registerForm.submit();
        
        // Mostrar alerta de registro exitoso
        showAlert('¡Registro exitoso! Por favor inicia sesión con tus nuevas credenciales.', 'success');
        
        // Cambiar al formulario de login después de un breve retraso
        setTimeout(() => {
          container.classList.remove("right-panel-active");
          
          // Auto-llenar el correo en el formulario de login
          const loginEmail = document.querySelector('.email-2');
          if (loginEmail) {
            loginEmail.value = email.value;
          }
          
          registerForm.reset();
        }, 1000);
      }
    });
  }

  // Login
  const loginForm = document.querySelector('.login-container form');
  if (loginForm) {
    const loginEmail = document.querySelector('.email-2');
    const loginPassword = document.querySelector('.password-2');

    // Auto-llenar el correo si viene de registro
    const registeredEmail = localStorage.getItem('registeredEmail');
    if (registeredEmail && loginEmail) {
      loginEmail.value = registeredEmail;
      localStorage.removeItem('registeredEmail'); // Limpiar después de usar
    }

    loginEmail?.addEventListener("input", () => validateEmail(loginEmail.value) ? showSuccess(loginEmail) : showError(loginEmail, "Correo inválido"));
    loginPassword?.addEventListener("input", () => loginPassword.value.length >= 4 ? showSuccess(loginPassword) : showError(loginPassword, "Mínimo 4 caracteres"));

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      if (checkRequired([loginEmail, loginPassword])) {
        // Mostrar el loader durante el inicio de sesión
        loader.style.display = 'flex';
        loader.style.opacity = '1';
        loader.querySelector('.loading-text').textContent = 'Iniciando sesión...';
        
        // Enviar el formulario normalmente (Flask se encargará de la redirección)
        loginForm.submit();
      }
    });
  }
});