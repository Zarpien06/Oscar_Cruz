document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("chat-form");
    const input = document.getElementById("message-input");
    const messages = document.getElementById("messages");
  
    function appendMessage(text, type) {
      const div = document.createElement("div");
      div.classList.add("message", type);
      div.innerText = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }
  
    function handleAutoReply(text) {
        const replies = {
          "hola": "¡Hola! ¿En qué puedo ayudarte hoy?",
          "estado": "Tu vehículo está en proceso de pintura.",
          "gracias": "¡Con gusto! 😊",
          "listo": "El vehículo estará listo pronto.",
          "¿cómo estás?": "¡Estoy bien, gracias! 😊 ¿Cómo te encuentras tú?",
          "qué tal": "Todo bien por aquí, ¿y tú qué tal?",
          "cuanto falta para que este listo?": "Faltan aproximadamente 2 días más para que el vehículo esté listo.",
          "que pasa con mi coche?": "Tu coche está en revisión de motor y será reparado pronto.",
          "puedo ver el progreso?": "Claro, te enviaré una foto del avance por el chat.",
          "puedo llamar al mecanico?": "Por el momento, los mecánicos están ocupados, pero te avisaré cuando sea posible.",
          "cuanto cuesta la reparación?": "El costo total será estimado una vez que terminemos la evaluación completa.",
          "que servicio esta haciendo mi coche?": "Actualmente, tu coche está en proceso de revisión y reparación del sistema de frenos.",
          "hay algun problema con mi coche?": "Sí, parece haber un problema con los frenos, pero no te preocupes, lo estamos solucionando.",
          "cuando puedo recoger mi coche?": "Puedes recoger tu coche dentro de 2 días, te avisaré cuando esté listo.",
          "donde está mi coche?": "Tu coche está en el taller, en la sección de revisión de motores.",
          "tienen repuestos?": "Sí, tenemos todos los repuestos necesarios para la reparación de tu vehículo.",
          "puedo cancelar la cita?": "Puedes cancelar la cita si lo deseas, solo avísanos con antelación.",
          "dónde se encuentra el taller?": "Nuestro taller está ubicado en la calle 123, en la zona industrial.",
          "puedo pagar con tarjeta?": "Sí, aceptamos pagos con tarjeta de crédito y débito.",
          "cuál es el horario de atencion?": "Nuestro horario es de lunes a viernes, de 9:00 AM a 6:00 PM.",
          "tienen algun descuento?": "Ofrecemos descuentos especiales en servicios de mantenimiento si es la primera vez que nos visitas.",
          "qué garantía tiene la reparacion?": "Las reparaciones tienen una garantía de 6 meses.",
          "puedo obtener un presupuesto?": "Sí, podemos ofrecerte un presupuesto después de revisar tu vehículo.",
          "esta mi coche listo?": "Aún estamos trabajando en él, pero estará listo muy pronto.",
          "puedo cambiar la cita?": "Sí, podemos cambiar la cita si lo necesitas, solo avísanos con tiempo.",
          "cuando revisaran mi coche?": "Tu coche está en espera para revisión, te avisaremos en cuanto sea su turno.",
          "cuanto tiempo tomara la reparacion?": "Dependiendo de la complejidad, la reparación puede tomar entre 1 y 3 días.",
          "puedo hacer un pago parcial?": "Sí, ofrecemos pagos parciales, pero el saldo total debe pagarse al recoger el coche.",
          "como puedo agendar una cita?": "Puedes agendar una cita llamando al número de nuestro taller o a través del chat.",
          "cual es el proceso para hacer el servicio?": "Primero, revisamos tu coche, luego te damos un presupuesto y, si estás de acuerdo, comenzamos la reparación.",
          "puedo esperar en el taller?": "Sí, tenemos una sala de espera cómoda para nuestros clientes.",
          "qué reparaciones hacen?": "Realizamos todo tipo de reparaciones de vehículos, incluyendo frenos, motor, suspensión, y más.",
          "puedo dejar mi coche hoy?": "Claro, puedes dejarlo hoy, pero te recomendamos hacer una cita previa.",
          "tienen servicio a domicilio?": "Sí, ofrecemos servicio a domicilio para recoger y entregar tu coche."
        };
        
        const reply = replies[text.toLowerCase()];
        if (reply) {
          setTimeout(() => appendMessage(reply, "received"), 1000);
        }
      }
      
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = input.value.trim();
      if (!message) return;
      appendMessage(message, "sent");
      input.value = "";
      handleAutoReply(message);
    });
  
    // Mostrar archivo al seleccionar
    document.getElementById("image-input").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = "150px";
        img.style.borderRadius = "10px";
        const div = document.createElement("div");
        div.classList.add("message", "sent");
        div.appendChild(img);
        messages.appendChild(div);
      }
    });
  
    document.getElementById("pdf-input").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.innerText = "📄 Ver archivo PDF";
        link.target = "_blank";
        const div = document.createElement("div");
        div.classList.add("message", "sent");
        div.appendChild(link);
        messages.appendChild(div);
      }
    });
  
    document.getElementById("audio-input").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = URL.createObjectURL(file);
        const div = document.createElement("div");
        div.classList.add("message", "sent");
        div.appendChild(audio);
        messages.appendChild(div);
      }
    });
  });
  