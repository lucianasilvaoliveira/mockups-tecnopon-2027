/* Configurador da mesa dosadora: etapas, validação leve e resumo que vai na mensagem do pedido de projeto. */
(function () {
	var f = document.querySelector('[data-mig-conf]');
	if (!f) return;
	var etapas = Array.prototype.slice.call(f.querySelectorAll('.mig-etapa'));
	var passos = document.querySelectorAll('[data-mig-passos] li');
	var bAv = f.querySelector('[data-avancar]'), bVo = f.querySelector('[data-voltar]'), bEn = f.querySelector('[data-enviar]');
	var resumo = f.querySelector('[data-mig-resumo]');
	var msg = f.querySelector('[name="mensagem"]');
	var atual = 0, enviando = false;
	document.documentElement.classList.add('mig-js');

	function valor(n) { var e = f.querySelector('[name="' + n + '"]:checked'); return e ? e.value : ''; }
	function texto(n) { var e = f.querySelector('[name="' + n + '"]'); return e ? e.value.trim() : ''; }
	function lista() {
		var r = [];
		var add = function (rot, v) { if (v) r.push([rot, v]); };
		add('Aplicação', valor('cfg_segmento'));
		add('Consistência do produto', valor('cfg_consistencia'));
		add('Recipiente', texto('cfg_recipiente'));
		add('Produtividade desejada', texto('cfg_produtividade'));
		add('Canais', valor('cfg_canais'));
		var rec = Array.prototype.map.call(f.querySelectorAll('[name="cfg_recursos[]"]:checked'), function (c) { return c.value; });
		add('Recursos', rec.join(', '));
		add('Mesa de referência', texto('cfg_referencia'));
		add('Nome do projeto', texto('cfg_projeto'));
		return r;
	}
	function desenharResumo() {
		resumo.innerHTML = '';
		var l = lista();
		if (!l.length) { var li = document.createElement('li'); li.textContent = 'Você não escolheu nenhuma opção, nossa equipe vai ajudar a definir.'; resumo.appendChild(li); return; }
		l.forEach(function (i) {
			var li = document.createElement('li'), b = document.createElement('strong');
			b.textContent = i[0] + ': '; li.appendChild(b); li.appendChild(document.createTextNode(i[1])); resumo.appendChild(li);
		});
	}
	function erro(e, t) { var p = etapas[e].querySelector('[data-erro]'); if (!p) return; p.hidden = !t; p.textContent = t || ''; }

	function ir(n) {
		atual = n;
		etapas.forEach(function (e, i) { e.hidden = i !== n; e.classList.toggle('is-atual', i === n); });
		passos.forEach(function (p, i) {
			p.classList.toggle('is-atual', i === n); p.classList.toggle('is-feito', i < n);
			if (i === n) p.setAttribute('aria-current', 'step'); else p.removeAttribute('aria-current');
		});
		bVo.hidden = n === 0; bAv.hidden = n === etapas.length - 1; bEn.hidden = n !== etapas.length - 1;
		if (n === etapas.length - 1) desenharResumo();
		var lg = etapas[n].querySelector('legend'); if (lg) { lg.setAttribute('tabindex', '-1'); lg.focus({ preventScroll: true }); }
		var topo = f.closest('.mig-cartao-conf'); if (topo) topo.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
	bAv.addEventListener('click', function () {
		if (atual === 0 && !valor('cfg_segmento')) { erro(0, 'Escolha o que você vai envasar para continuar.'); return; }
		erro(0, ''); ir(atual + 1);
	});
	bVo.addEventListener('click', function () { ir(atual - 1); });
	passos.forEach(function (p, i) { p.addEventListener('click', function () { if (i < atual) ir(i); }); });

	f.addEventListener('submit', function (ev) {
		if (atual < etapas.length - 1) { ev.preventDefault(); bAv.click(); return; }
		var nome = f.querySelector('[name="nome"]'), em = f.querySelector('[name="email"]');
		if (!nome.value.trim() || !em.value.trim() || !em.checkValidity()) {
			ev.preventDefault();
			erro(3, 'Informe seu nome e um e-mail válido para podermos responder.');
			(!nome.value.trim() ? nome : em).focus();
			return;
		}
		if (enviando) return;
		enviando = true;
		var linhas = ['Configurador da mesa dosadora:'];
		lista().forEach(function (i) { linhas.push('- ' + i[0] + ': ' + i[1]); });
		var extra = msg.value.trim();
		msg.value = linhas.join('\n') + (extra ? '\n\nMais características informadas pelo cliente:\n' + extra : '');
	});
})();
