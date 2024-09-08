// Array para almacenar los profesionales en localStorage
let profesionales = JSON.parse(localStorage.getItem('profesionales')) || [];

// Función para mostrar la vista previa de la imagen
document.getElementById('foto').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const fileType = file.type;
        const fileSize = file.size;

        // Validar tipo y tamaño de archivo
        if (!fileType.startsWith('image/')) {
            alert('Por favor, sube un archivo de imagen válido');
            return;
        }
        if (fileSize > 2 * 1024 * 1024) { // 2 MB
            alert('La imagen no debe superar los 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('imagenPrevia');
            img.src = e.target.result;
            img.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

// Función para mostrar/ocultar contraseñas
function togglePasswordVisibility(id) {
    const input = document.getElementById(id);
    const button = input.nextElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
    button.textContent = input.type === 'password' ? 'Mostrar' : 'Ocultar';
}

// Función para validar el formulario en tiempo real
function validateField(id, validationFunction) {
    const field = document.getElementById(id);
    const feedback = document.getElementById(`${id}Feedback`);
    field.addEventListener('input', () => {
        const error = validationFunction(field.value.trim());
        feedback.textContent = error || '';
        field.style.borderColor = error ? 'red' : '';
    });
}

// Validaciones
function validateNombre(nombre) {
    if (!nombre) return 'Es obligatorio';
    if (nombre.split(' ').length < 2) return 'Incompleto';
    return '';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'El email es obligatorio';
    if (!emailRegex.test(email)) return 'Email inválido';
    return '';
}

function validateDni(dni) {
    if (!dni) return 'El DNI es obligatorio';
    if (dni.length < 7 || dni.length > 8 || isNaN(dni)) return 'DNI inválido';
    return '';
}

function validateContraseña(contraseña) {
    const contraseñaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!contraseña) return 'La contraseña es obligatoria';
    if (!contraseñaRegex.test(contraseña)) return 'Minimo 8 caracteres, una mayúscula, minúscula y un número';
    return '';
}

function validateConfirmarContraseña(contraseña, confirmarContraseña) {
    if (contraseña !== confirmarContraseña) return 'Las contraseñas no coinciden';
    return '';
}

// Agregar validaciones en tiempo real
validateField('nombre', validateNombre);
validateField('email', validateEmail);
validateField('dni', validateDni);
validateField('contraseña', validateContraseña);
document.getElementById('confirmarContraseña').addEventListener('input', function() {
    const contraseña = document.getElementById('contraseña').value.trim();
    const confirmarContraseña = document.getElementById('confirmarContraseña').value.trim();
    const error = validateConfirmarContraseña(contraseña, confirmarContraseña);
    document.getElementById('confirmarContraseñaFeedback').textContent = error || '';
    this.style.borderColor = error ? 'red' : '';
});

// Función para agregar un nuevo campo de experiencia
document.getElementById('agregarExperiencia').addEventListener('click', function() {
    const container = document.getElementById('experienciaItems');
    const index = container.children.length;
    
    const div = document.createElement('div');
    div.classList.add('experiencia-item');
    div.innerHTML = `
        <label for="empresa${index}">Empresa:</label>
        <input type="text" id="empresa${index}" name="experiencia[${index}][empresa]" placeholder="Nombre de la Empresa" required>
        <label for="años${index}">Años:</label>
        <input type="number" id="años${index}" name="experiencia[${index}][años]" placeholder="Años" required>
        <label for="puesto${index}">Puesto:</label>
        <input type="text" id="puesto${index}" name="experiencia[${index}][puesto]" placeholder="Puesto" required>
        <button type="button" onclick="removeExperience(this)">Eliminar</button>
        <br>
    `;
    container.appendChild(div);
});

// Función para eliminar un campo de experiencia
function removeExperience(button) {
    const container = document.getElementById('experienciaItems');
    container.removeChild(button.parentElement);
}

// Función para registrar un nuevo profesional
// Función para registrar un nuevo profesional
document.getElementById('registroForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const dni = document.getElementById('dni').value;
  const contraseña = document.getElementById('contraseña').value;
  const confirmarContraseña = document.getElementById('confirmarContraseña').value;

  // Validaciones de ejemplo
  if (contraseña !== confirmarContraseña) {
      alert('Las contraseñas no coinciden');
      return;
  }
  if (!nombre || !email || !dni || !contraseña) {
      alert('Por favor, completa todos los campos del formulario');
      return;
  }

  // Verificar si el email o DNI ya están registrados
  const emailExistente = profesionales.find(profesional => profesional.email === email);
  const dniExistente = profesionales.find(profesional => profesional.dni === dni);

  if (emailExistente) {
      alert('Este email ya está registrado');
      return;
  }
  if (dniExistente) {
      alert('Este DNI ya está registrado');
      return;
  }

  // Obtener experiencia laboral del formulario (si la hay)
  const experienciaItems = Array.from(document.querySelectorAll('#experienciaItems > div'));
  const experiencia = experienciaItems.length > 0 ? experienciaItems.map(div => {
      return {
          empresa: div.querySelector('input[name$="[empresa]"]').value,
          años: parseInt(div.querySelector('input[name$="[años]"]').value),
          puesto: div.querySelector('input[name$="[puesto]"]').value
      };
  }) : [];

  // Crear nuevo profesional
  const nuevoProfesional = {
      nombre,
      email,
      dni,
      contraseña,
      experiencia, // Puede ser un array vacío si no hay experiencia
      puntos: 0
  };

  profesionales.push(nuevoProfesional);
  localStorage.setItem('profesionales', JSON.stringify(profesionales));

  alert('Profesional registrado exitosamente');

  // Vaciar el formulario después del registro exitoso
  document.getElementById('registroForm').reset();

  // También ocultar la imagen de vista previa si es necesario
  document.getElementById('imagenPrevia').style.display = 'none';
});
