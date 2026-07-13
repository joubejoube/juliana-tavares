// Efeitos do site · Juliana Tavares
// 1. Números animados na faixa · 2. Revelação no scroll · 3. Barra de progresso nos cases

(function () {
  // Respeita quem prefere menos movimento: nada de animação pra essas pessoas
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. NÚMEROS ANIMADOS (faixa verde da home) ---------- */
  function animaNumeros() {
    var itens = document.querySelectorAll('.faixa-item strong');
    if (!itens.length) return;

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var el = entrada.target;
        observador.unobserve(el);

        var original = el.textContent;
        var partes = original.match(/^(\d+)(.*)$/);
        if (!partes) return; // sem número no começo, deixa como tá

        var alvo = parseInt(partes[1], 10);
        var sufixo = partes[2];
        var duracao = 1200;
        var inicio = null;

        function passo(agora) {
          if (!inicio) inicio = agora;
          var progresso = Math.min((agora - inicio) / duracao, 1);
          var suave = 1 - Math.pow(1 - progresso, 3); // ease-out
          el.textContent = Math.round(alvo * suave) + sufixo;
          if (progresso < 1) requestAnimationFrame(passo);
          else el.textContent = original;
        }
        requestAnimationFrame(passo);
      });
    }, { threshold: 0.6 });

    itens.forEach(function (el) { observador.observe(el); });
  }

  /* ---------- 2. REVELAÇÃO NO SCROLL ---------- */
  function revelaNoScroll() {
    var alvos = document.querySelectorAll(
      '.projeto, .case-secao, .ciclo-item, .resultado, .sobre-grid, .sec-titulo, .sec-sub'
    );
    if (!alvos.length) return;

    alvos.forEach(function (el) { el.classList.add('reveal'); });

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    alvos.forEach(function (el) { observador.observe(el); });
  }

  /* ---------- 3. BARRA DE PROGRESSO DE LEITURA (páginas de case) ---------- */
  function barraDeProgresso() {
    if (!document.querySelector('.case-corpo')) return; // só nos cases

    var barra = document.createElement('div');
    barra.className = 'barra-leitura';
    barra.setAttribute('aria-hidden', 'true');
    document.body.appendChild(barra);

    function atualiza() {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      var pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      barra.style.width = pct + '%';
    }
    window.addEventListener('scroll', atualiza, { passive: true });
    atualiza();
  }

  if (reduzido) {
    // Sem animações, mas a barra de progresso é informativa e pode ficar
    barraDeProgresso();
    return;
  }

  animaNumeros();
  revelaNoScroll();
  barraDeProgresso();
})();
