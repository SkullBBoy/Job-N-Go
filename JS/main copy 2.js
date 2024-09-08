document.getElementById('registroForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Obtener los valores del formulario
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const dni = document.getElementById('dni').value;
  const contraseña = document.getElementById('contraseña').value;
  const confirmarContraseña = document.getElementById('confirmarContraseña').value;
  const profesion = document.getElementById('profesion').value;
  const habilidades = document.getElementById('habilidades').value.split(',').map(hab => hab.trim());
  const tipoUsuario = document.querySelector('input[name="tipoUsuario"]:checked').value;
  const fotoInput = document.getElementById('foto').files[0];

  // Verificar que las contraseñas coincidan
  if (contraseña !== confirmarContraseña) {
    alert('Las contraseñas no coinciden. Por favor, intenta de nuevo.');
    return;
  }

  // Leer la imagen como base64
  const reader = new FileReader();
  reader.readAsDataURL(fotoInput);
  reader.onload = function() {
    const fotoBase64 = reader.result;

    // Incrementar el contador del ID
    let ultimoId = localStorage.getItem('ultimoId') ? parseInt(localStorage.getItem('ultimoId')) : 0;
    ultimoId += 1;

    // Crear un nuevo usuario con la contraseña y demás datos
    const nuevoUsuario = {
      id: ultimoId,
      nombre,
      email,
      dni,
      contraseña,  // Almacenar la contraseña (en un caso real se debe encriptar)
      profesion,
      habilidades,
      tipoUsuario,
      foto: fotoBase64
    };

    // Guardar el nuevo ID en localStorage
    localStorage.setItem('ultimoId', ultimoId);

    // Guardar el nuevo usuario en localStorage
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Registro exitoso');
    window.location.href = 'index.html';  // Redirigir a la página inicial
  };

  reader.onerror = function() {
    console.error('Error al leer la imagen');
  };
});

const fotoInput = document.getElementById('foto');
const imagenPrevia = document.getElementById('imagenPrevia');

// Escuchar el evento de cambio en el input de la imagen
fotoInput.addEventListener('change', function(event) {
  const file = event.target.files[0];  // Obtener el archivo subido

  if (file) {
    const reader = new FileReader();  // Crear un lector de archivos
    reader.onload = function(e) {
      // Establecer la imagen previa y mostrarla
      imagenPrevia.src = e.target.result;
      imagenPrevia.style.display = 'block';  // Mostrar la imagen
    };
    reader.readAsDataURL(file);  // Leer el archivo como URL
  }
});
