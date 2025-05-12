// Extraer los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const secret = urlParams.get('secret');
const expire = urlParams.get('expire');

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
        // Intentar verificar el email
        await account.updateVerification(userId, secret);
        statusDiv.textContent = '¡Email verificado con éxito!';
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 3000);
        
    } catch (e) {
        console.error('Error de verificación:', e);
        if (e.message.includes('could not be found')) {
            statusDiv.textContent = 'Error: El enlace de verificación no es válido o ha expirado. Por favor, solicita un nuevo enlace de verificación.';
        } else {
            statusDiv.textContent = 'Error al verificar: ' + (e.message || e);
        }
    }

    try {
        await account.deleteSessions();
    } catch (e) {
        console.error('Error al cerrar sesiones:', e);
    }
}