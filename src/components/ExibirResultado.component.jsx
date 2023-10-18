/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Paper, Grid } from "@mui/material";

export function ExibirResultado({ resultado }) {
	const [currentIteracao, setCurrentIteracao] = useState(0);

	const interacaoSemErros = resultado.find((r) => r.erroTotal === 0);

	const handleNext = (incremento) => {
		if (currentIteracao + incremento < resultado.length - 1) {
			setCurrentIteracao(currentIteracao + incremento);
		} else {
			setCurrentIteracao(resultado.length - 1);
		}
	};

	const handlePrev = (decremento) => {
		if (currentIteracao - decremento > 0) {
			setCurrentIteracao(currentIteracao - decremento);
		} else {
			setCurrentIteracao(0);
		}
	};

	return (
		<>
			<Grid container justifyContent="space-between">
				<Grid item>
					<h2>
						Iteração {currentIteracao + 1} - Erro total:{" "}
						{resultado[currentIteracao].erroTotal}
					</h2>
				</Grid>
				<Grid item>
					<h2>{interacaoSemErros?.interacao ?? null}</h2>
				</Grid>
			</Grid>
			<Grid container spacing={2}>
				{resultado[currentIteracao].resultadosInteracao.map((r, index) => (
					<Grid item xs={6} key={index}>
						<Paper
							elevation={3}
							style={{
								border: `1px solid ${r.correta ? "lightgreen" : "lightcoral"}`,
							}}
						>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<h3>Treino {index + 1}:</h3>
								</Grid>
								<Grid item xs={6}>
									<h3>Entradas: {r.entrada.join(", ")}</h3>
								</Grid>
								<Grid item xs={6}>
									<h3>Meta: {r.meta}</h3>
								</Grid>
								<Grid item xs={6}>
									<h3>Saída: {r.saida}</h3>
								</Grid>
								<Grid item xs={6}>
									<h3>Erro: {r.erro}</h3>
								</Grid>
								<Grid item xs={12}>
									<h3>Pesos atualizados: {r.pesos.join(", ")}</h3>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				))}
			</Grid>
			<Grid container justifyContent="center" spacing={1} marginTop={2}>
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						onClick={() => handlePrev(10)}
						disabled={currentIteracao - 10 < 0}
					>
						-10
					</Button>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						onClick={() => handlePrev(1)}
						disabled={currentIteracao === 0}
					>
						Anterior
					</Button>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						onClick={() => handleNext(1)}
						disabled={currentIteracao === resultado.length - 1}
					>
						Próxima
					</Button>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						onClick={() => handleNext(10)}
						disabled={currentIteracao + 10 > resultado.length - 1}
					>
						+10
					</Button>
				</Grid>
			</Grid>
		</>
	);
}
