export function treinamentoWidrowHoff(
	entradas,
	metas,
	pesos,
	taxaAprendizado,
	maxIteracoes
) {
	const numCaracteristicas = entradas[0].length;
	let pesosAtuais = [...pesos];
	const iteracoes = [];

	for (let interacao = 0; interacao < maxIteracoes; interacao++) {
		let erroTotal = 0;
		const interacaoAtual = {
			interacao: interacao + 1,
			resultadosInteracao: [],
		};

		for (let exemplo = 0; exemplo < entradas.length; exemplo++) {
			const entrada = entradas[exemplo];
			const meta = metas[exemplo];

			let saida = 0;
			for (let i = 0; i < numCaracteristicas; i++) {
				saida += pesosAtuais[i] * entrada[i];
			}

			const erro = meta - saida;
			const saidaCorreta = erro === 0;

			for (let i = 0; i < numCaracteristicas; i++) {
				pesosAtuais[i] += taxaAprendizado * erro * entrada[i];
			}

			erroTotal += erro ** 2;

			const resultadoInteracao = {
				entrada: entrada,
				meta: meta,
				saida: saida,
				erro: erro,
				pesos: [...pesosAtuais],
				correta: saidaCorreta,
			};

			interacaoAtual.resultadosInteracao.push(resultadoInteracao);
		}

		interacaoAtual.erroTotal = erroTotal;
		iteracoes.push(interacaoAtual);
	}

	return iteracoes;
}
