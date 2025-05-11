// Extraer los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const secret = urlParams.get('secret');

// User ID
const userIdRow = document.getElementById('userIdRow');
if (userId) {
    const btn = document.createElement('button');
    btn.className = 'copy-button';
    btn.textContent = 'Copiar User ID';
    btn.onclick = function() {
        navigator.clipboard.writeText(userId).then(() => {
            alert('Copiado al portapapeles');
        });
    };
    userIdRow.appendChild(btn);
} else {
    const span = document.createElement('span');
    span.className = 'no-disponible';
    span.textContent = 'No disponible';
    userIdRow.appendChild(span);
}

// Secret
const secretRow = document.getElementById('secretRow');
if (secret) {
    const btn = document.createElement('button');
    btn.className = 'copy-button';
    btn.textContent = 'Copiar Secret';
    btn.onclick = function() {
        navigator.clipboard.writeText(secret).then(() => {
            alert('Copiado al portapapeles');
        });
    };
    secretRow.appendChild(btn);
} else {
    const span = document.createElement('span');
    span.className = 'no-disponible';
    span.textContent = 'No disponible';
    secretRow.appendChild(span);
}

// Verificación directa con Appwrite
async function verifyEmail() {
    if (!userId || !secret) {
        alert('Faltan datos para la verificación.');
        return;
    }

    // Verificar que la configuración de Appwrite esté disponible
    if (!window.APPWRITE_CONFIG || !window.APPWRITE_CONFIG.endpoint || !window.APPWRITE_CONFIG.projectId) {
        alert('Error: La configuración de Appwrite no está disponible. Por favor, verifica que el archivo config.js esté correctamente configurado.');
        return;
    }

    const statusDiv = document.getElementById('status');
    statusDiv.textContent = 'Verificando...';

    // Usar la configuración del archivo config.js
    const endpoint = window.APPWRITE_CONFIG.endpoint;
    const projectId = window.APPWRITE_CONFIG.projectId;

    const client = new Appwrite.Client();
    client
        .setEndpoint(endpoint)
        .setProject(projectId);

    const account = new Appwrite.Account(client);

    try {
        await account.updateVerification(userId, secret);
        statusDiv.textContent = '¡Email verificado con éxito!';
        
    } catch (e) {
        statusDiv.textContent = 'Error al verificar: ' + (e.message || e);
    }

    await account.deleteSessions();
} 