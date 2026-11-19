/* Opção 4: menu de produtos (clique) e menu do celular com véu e fundo travado. */
(function () {
	var raiz = document.documentElement, cabeca = document.querySelector('.cabeca');
	var botao = document.querySelector('.menu-bt'), item = document.querySelector('.nav__item');
	var gatilho = item && item.querySelector('.nav__link');
	if (!cabeca || !botao) return;
	var veu = document.createElement('div');
	veu.className = 'veu';
	document.body.appendChild(veu);
	var estreito = window.matchMedia('(max-width:1280px)');

	function mega(abrir) {
		if (!item) return;
		item.classList.toggle('is-aberto', abrir);
		gatilho.setAttribute('aria-expanded', abrir ? 'true' : 'false');
	}
	var rolagem = 0;
	function menu(abrir) {
		var estava = raiz.classList.contains('menu-aberto');
		if (abrir && !estava) rolagem = window.scrollY;
		raiz.style.setProperty('--menu-topo', Math.round(cabeca.getBoundingClientRect().bottom) + 'px');
		raiz.classList.toggle('menu-aberto', abrir);
		// Só esconde a rolagem quando a barra não ocupa largura; senão o layout mudaria de tamanho.
		raiz.classList.toggle('menu-trava', abrir && window.innerWidth - raiz.clientWidth === 0);
		botao.setAttribute('aria-expanded', abrir ? 'true' : 'false');
		botao.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
		if (!abrir) mega(false);
		if (!abrir && estava && Math.abs(window.scrollY - rolagem) > 1) window.scrollTo({ top: rolagem, behavior: 'instant' });
	}
	var painel = document.getElementById('menu');
	function segura(e) { if (raiz.classList.contains('menu-aberto') && !painel.contains(e.target)) e.preventDefault(); }
	document.addEventListener('wheel', segura, { passive: false });
	document.addEventListener('touchmove', segura, { passive: false });
	if (gatilho) gatilho.addEventListener('click', function () { mega(!item.classList.contains('is-aberto')); });
	botao.addEventListener('click', function () { menu(!raiz.classList.contains('menu-aberto')); });
	veu.addEventListener('click', function () { menu(false); });
	document.addEventListener('keydown', function (e) {
		if (e.key !== 'Escape') return;
		if (raiz.classList.contains('menu-aberto')) { menu(false); botao.focus({ preventScroll: true }); }
		else if (item && item.classList.contains('is-aberto')) { mega(false); gatilho.focus(); }
	});
	document.addEventListener('click', function (e) {
		if (!estreito.matches && item && !item.contains(e.target)) mega(false);
	});
	estreito.addEventListener('change', function () { menu(false); });
})();
