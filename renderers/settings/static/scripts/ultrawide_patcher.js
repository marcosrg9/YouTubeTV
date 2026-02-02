/**
 * Establece estilos a toda la interfaz de YouTube Leanback para que se adapte algo mejor a pantallas panorámicas.
 * Dado que YouTube Leanback renderiza elementos HTML y los elimina cuando estos ya no se usan, hay que atender eventos de navegación,
 * como lo sería el click y las teclas arriba, abajo, izquierda y derecha.
 * Esto supondrá un impacto en el rendimiento que todavía deberá determinarse,
 * NOTA: esto es simplemente un parche, por ello, cuando la interfaz Leanback se actualice, este probablemente dejará de funcionar correctamente.
 */
const patch = () => {

    // Para volver a aplicar estilos una vez renderizado...
    document.onclick = () => {

    }

    document.querySelector('#container').style.width = '100%';
    document.querySelector('#container').style.height = '100%';
    document.querySelector('ytlr-logo-entity').style.left = 'calc(100vw - 200px)';

    
    // Feed
    document.querySelector('ytlr-tv-surface-content-renderer').style.width = '100%';
    
    // Define el ancho y alto de contenedores superiores en la jerarquía.
    document.querySelector('ytlr-search-container').style.width = '100%';
    document.querySelector('ytlr-search-container').style.height = '100%';

    document.querySelector('yt-unified-overlay-stage').style.width = '100%';
    document.querySelector('yt-unified-overlay-stage').style.height = '100%';

    // Define el ancho completo para cada fila de los resultados de búsqueda.
    document.querySelectorAll('yt-virtual-list').forEach(e => {
        e.style.width = '100%';

        e.firstChild.style.width = '100%';
        
        e.firstChild.childNodes.forEach(c => {
            c.style.width = '100%'
        })
    });

}