// Carga highlight.js dinámicamente y aplica resaltado a los bloques de código de detalle de proyecto
(function() {
  function loadScript(src, cb) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }
  function loadCSS(href) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }
  function highlightDetailBlocks() {
    if (window.hljs) {
      document.querySelectorAll('.project-detail-code').forEach(function(block) {
        block.classList.add('hljs');
        window.hljs.highlightElement(block);
      });
    }
  }
  // Cargar highlight.js desde CDN
  loadCSS('https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/atom-one-dark.min.css');
  loadScript('https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/highlight.min.js', function() {
    // Registrar lenguajes comunes
    loadScript('https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/languages/cpp.min.js', function() {
      window.hljs.registerLanguage('cpp', window.hljs.getLanguage('cpp'));
      highlightDetailBlocks();
    });
    loadScript('https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/languages/javascript.min.js', function() {
      window.hljs.registerLanguage('javascript', window.hljs.getLanguage('javascript'));
      highlightDetailBlocks();
    });
    loadScript('https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/languages/java.min.js', function() {
      window.hljs.registerLanguage('java', window.hljs.getLanguage('java'));
      highlightDetailBlocks();
    });
    highlightDetailBlocks();
  });
  // Reaplicar highlight al renderizar detalle
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(highlightDetailBlocks, 400);
  });
  window.renderProjectDetail = (function(orig){
    return function(title) {
      orig(title);
      setTimeout(highlightDetailBlocks, 100);
    };
  })(window.renderProjectDetail);
})();
