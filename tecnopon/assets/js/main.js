/* Tecnopon: menu, mega menu, galeria e filtros. JS de página fica em funções isoladas aqui. */
(function () {
	var botao = document.querySelector('.menu-botao');
	var menu = document.getElementById('menu-principal');
	if (botao && menu) {
		/* Menu do celular: painel fixo sob o cabeçalho, véu escuro e página travada atrás. */
		var cabeca = document.querySelector('.cabeca');
		var veu = document.createElement('div');
		veu.className = 'menu-veu';
		veu.setAttribute('aria-hidden', 'true');
		document.body.appendChild(veu);
		var celular = window.matchMedia('(max-width: 899px)');
		var rolagem = 0;

		var abrir = function () {
			rolagem = window.scrollY;
			var r = cabeca.getBoundingClientRect();
			document.documentElement.style.setProperty('--cabeca-topo', Math.max(0, r.top) + 'px');
			document.documentElement.style.setProperty('--menu-topo', Math.max(0, r.bottom) + 'px');
			/* Trava que funciona no iOS: o body vira fixo na posição atual e volta ao mesmo ponto ao fechar. */
			document.body.style.top = -rolagem + 'px';
			document.documentElement.classList.add('menu-aberto');
			menu.classList.add('is-aberto');
			botao.setAttribute('aria-expanded', 'true');
			botao.setAttribute('aria-label', 'Fechar menu');
			var primeiro = menu.querySelector('a, button');
			if (primeiro) primeiro.focus({ preventScroll: true });
		};
		var fechar = function (devolverFoco) {
			if (!menu.classList.contains('is-aberto')) return;
			menu.classList.remove('is-aberto');
			document.documentElement.classList.remove('menu-aberto');
			document.body.style.top = '';
			window.scrollTo({ top: rolagem, behavior: 'instant' });
			botao.setAttribute('aria-expanded', 'false');
			botao.setAttribute('aria-label', 'Abrir menu');
			if (devolverFoco) botao.focus({ preventScroll: true });
		};
		botao.addEventListener('click', function () {
			menu.classList.contains('is-aberto') ? fechar(false) : abrir();
		});
		veu.addEventListener('click', function () { fechar(false); });
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && menu.classList.contains('is-aberto')) fechar(true);
		});
		/* Mantém o foco do teclado dentro do menu aberto (botão + itens). */
		document.addEventListener('focusin', function (e) {
			if (menu.classList.contains('is-aberto') && !menu.contains(e.target) && e.target !== botao) {
				var primeiro = menu.querySelector('a, button');
				if (primeiro) primeiro.focus({ preventScroll: true });
			}
		});
		var aoMudar = function (m) { if (!m.matches) fechar(false); };
		celular.addEventListener ? celular.addEventListener('change', aoMudar) : celular.addListener(aoMudar);
	}
	document.querySelectorAll('.menu__item--mega > .menu__link').forEach(function (b) {
		b.addEventListener('click', function () {
			var li = b.parentElement, aberto = li.classList.toggle('is-aberto');
			b.setAttribute('aria-expanded', aberto);
		});
	});
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') document.querySelectorAll('.menu__item--mega.is-aberto').forEach(function (li) {
			li.classList.remove('is-aberto'); li.querySelector('.menu__link').setAttribute('aria-expanded', false);
		});
	});

	/* Galeria: [data-galeria] com .galeria__principal img e botões [data-grande] */
	document.querySelectorAll('[data-galeria]').forEach(function (g) {
		var principal = g.querySelector('.galeria__principal img');
		g.querySelectorAll('[data-grande]').forEach(function (t) {
			t.addEventListener('click', function () {
				if (!principal) return;
				principal.src = t.dataset.grande; principal.removeAttribute('srcset');
				g.querySelectorAll('[data-grande]').forEach(function (x) { x.setAttribute('aria-current', x === t); });
			});
		});
	});

	/* Formulários que se enviam sozinhos ao mudar (filtros) */
	document.querySelectorAll('form[data-auto]').forEach(function (f) {
		f.addEventListener('change', function () { f.submit(); });
	});
})();
