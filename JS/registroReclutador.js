// Función para inicializar el estado de la sesión
function inicializarSesion() {
    // Verificar si la clave 'sesionIniciada' ya existe en localStorage
    const sesion = JSON.parse(localStorage.getItem('sesionIniciada'));
    
    if (sesion && sesion.estado === 'si') {
        // Si la sesión está iniciada, redirigir a la página correspondiente
        window.location.href = 'ofertasLaborales.html'; // Cambia 'paginaPrincipal.html' por la URL correcta
    } else if (!sesion) {
        // Si no existe, establecer la clave con el valor 'no' y el DNI vacío
        const nuevaSesion = {
            estado: 'no',  // No hay sesión iniciada
            dni: ''        // DNI vacío
        };
        localStorage.setItem('sesionIniciada', JSON.stringify(nuevaSesion));
    }
}

// Ejecutar la función cuando el contenido del documento esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarSesion);





// Cargar los arrays desde localStorage
let reclutadores = JSON.parse(localStorage.getItem('reclutadores')) || [];
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
    if (dni.length !== 8 || isNaN(dni)) return 'El DNI debe tener exactamente 8 dígitos';
    return '';
}


function validateEmpresa(empresa) {
    if (!empresa) return 'La empresa es obligatoria';
    if (empresa.length < 3) return '(mínimo 3 caracteres)';
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
validateField('empresa', validateEmpresa);
validateField('contraseña', validateContraseña);
document.getElementById('confirmarContraseña').addEventListener('input', function() {
    const contraseña = document.getElementById('contraseña').value.trim();
    const confirmarContraseña = document.getElementById('confirmarContraseña').value.trim();
    const error = validateConfirmarContraseña(contraseña, confirmarContraseña);
    document.getElementById('confirmarContraseñaFeedback').textContent = error || '';
    this.style.borderColor = error ? 'red' : '';
});

// Función para registrar un nuevo reclutador
document.getElementById('registroForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const dni = document.getElementById('dni').value;
  const empresa = document.getElementById('empresa').value;
  const contraseña = document.getElementById('contraseña').value;
  const confirmarContraseña = document.getElementById('confirmarContraseña').value;

  // Validaciones de ejemplo
  if (contraseña !== confirmarContraseña) {
      alert('Las contraseñas no coinciden');
      return;
  }
  if (!nombre || !email || !dni || !empresa || !contraseña) {
      alert('Por favor, completa todos los campos del formulario');
      return;
  }

  // Verificar si el email o DNI ya están registrados en ambos arrays
  const emailExistente = [...reclutadores, ...profesionales].find(user => user.email === email);
  const dniExistente = [...reclutadores, ...profesionales].find(user => user.dni === dni);

  if (emailExistente) {
      alert('Este email ya está registrado');
      return;
  }
  if (dniExistente) {
      alert('Este DNI ya está registrado');
      return;
  }

  // Crear nuevo reclutador
  const nuevoReclutador = {
      nombre,
      email,
      dni,
      empresa,
      contraseña
  };

  reclutadores.push(nuevoReclutador);
  localStorage.setItem('reclutadores', JSON.stringify(reclutadores));

  alert('Reclutador registrado exitosamente');

  // Vaciar el formulario después del registro exitoso
  document.getElementById('registroForm').reset();

  // También ocultar la imagen de vista previa si es necesario
  document.getElementById('imagenPrevia').style.display = 'none';

  // Redireccionar a otra página (por ejemplo, la página de inicio o perfil)
  window.location.href = 'login.html'; // Cambia 'login.html' por la URL a la que desees redirigir
});
