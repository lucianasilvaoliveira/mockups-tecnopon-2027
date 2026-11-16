/* Tecnopon: menu, mega menu, galeria e filtros. JS de página fica em funções isoladas aqui. */
(function () {
	var botao = document.querySelector('.menu-botao');
	var menu = document.getElementById('menu-principal');
	if (botao && menu) {
		botao.addEventListener('click', function () {
			var aberto = menu.classList.toggle('is-aberto');
			botao.setAttribute('aria-expanded', aberto);
		});
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
