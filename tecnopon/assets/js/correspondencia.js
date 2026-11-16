/* Busca e filtro da tabela de correspondência entre modelos. */
(function () {
	var raiz = document.querySelector('[data-mig-correspondencia]');
	if (!raiz) return;
	var q = raiz.querySelector('[data-mig-q]');
	var contagem = raiz.querySelector('[data-mig-contagem]');
	var linhas = Array.prototype.slice.call(document.querySelectorAll('[data-mig-corpo] tr'));
	var vazio = document.querySelector('[data-mig-vazio]');
	var tabela = document.querySelector('.mig-tabela');
	var total = linhas.length;
	var norm = function (s) { return (s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); };

	function filtrar() {
		var t = norm(q.value);
		var c = (raiz.querySelector('input[name="mig-canais"]:checked') || {}).value || '';
		var n = 0;
		linhas.forEach(function (l) {
			var ok = (!t || l.dataset.busca.indexOf(t) !== -1) && (!c || l.dataset.canais === c);
			l.hidden = !ok;
			if (ok) n++;
		});
		contagem.textContent = 'Mostrando ' + n + ' de ' + total + ' modelos';
		if (vazio) vazio.hidden = n !== 0;
		if (tabela) tabela.hidden = n === 0;
	}

	q.addEventListener('input', filtrar);
	raiz.querySelectorAll('input[name="mig-canais"]').forEach(function (r) { r.addEventListener('change', filtrar); });
	var m = /[?&]q=([^&]+)/.exec(location.search);
	if (m) { q.value = decodeURIComponent(m[1].replace(/\+/g, ' ')); }
	filtrar();
})();
