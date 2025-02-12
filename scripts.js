// Descargar Reel
async function getReelData() {
  await fetchData('reelUrl', 'reel');
}

// Descargar Estado
async function getStatusData() {
  await fetchData('statusUrl', 'status');
}

// Descargar Videos de YouTube
async function getYouTubeData() {
  await fetchData('youtubeUrl', 'youtube');
}


// Descargar Short
async function getShortData() {
  await fetchData('shortUrl', 'short');
}

// Descargar Videos de TikTok
async function getTikTokData() {
  await fetchData('tiktokUrl', 'tiktok');
}


// Función genérica para manejar descargas
async function fetchData(inputId, prefix) {
  const videoUrl = document.getElementById(inputId).value.trim();
  const loading = document.getElementById(`${prefix}Loading`);
  const videoContainer = document.getElementById(`${prefix}VideoContainer`);

  const videoQuality = document.getElementById(`${prefix}VideoQuality`);
  const downloadLink = document.getElementById(`${prefix}DownloadLink`);
  const error = document.getElementById(`${prefix}Error`);

  // Validación de entrada
  if (!videoUrl) {
    showError(error, loading, "Por favor ingresa una URL válida.");
    return;
  }

  try {
    // Mostrar estado de carga
    loading.classList.remove('d-none');
    videoContainer.classList.add('d-none');
    error.classList.add('d-none');

    // Realizar la solicitud
    const response = await fetch(
      `https://social-media-video-downloader.p.rapidapi.com/smvd/get/all?url=${encodeURIComponent(videoUrl)}&filename=${prefix}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'd6eefda435msh8ae60d04d6b9b22p172e56jsn5a84a74c03bd',
          'X-RapidAPI-Host': 'social-media-video-downloader.p.rapidapi.com'
        }
      }
    );

    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);

    const data = await response.json();

    // Verificar datos devueltos
    if (!data.links || !data.links.length) {
      throw new Error("No se encontraron videos descargables para esta URL.");
    }

    // Obtener el título truncado a las 10 primeras letras
    const truncatedTitle = data.title ? data.title.substring(0, 30) : "video";

    // Actualizar la calidad y el enlace de descarga

    videoQuality.textContent = truncatedTitle;


    // Actualizar el enlace de descarga
    if (prefix == 'short' || prefix == 'youtube') {
      downloadLink.href = data.links[8]?.link || "#";
    }
    
    else if (prefix == 'status') {
      console.log('data: ', data);
      downloadLink.href = data.links[2]?.link || "#";
    }
    else {
      downloadLink.href = data.links[1]?.link || "#";
    }

    // Actualizar el nombre del archivo
    downloadLink.download = `${prefix}_${truncatedTitle}.mp4`;
    // Mostrar el contenedor de video
    videoContainer.classList.remove('d-none');
  } catch (err) {
    // Mostrar error en la interfaz
    showError(error, loading, `Error: ${err.message}`);
  } finally {
    // Ocultar el estado de carga
    loading.classList.add('d-none');
  }
}

// Función para manejar errores y mostrarlos
function showError(errorElement, loadingElement, message) {
  errorElement.textContent = message;
  errorElement.classList.remove('d-none');
  loadingElement.classList.add('d-none');
}

