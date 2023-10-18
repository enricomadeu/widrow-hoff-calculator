import { useState } from "react";
import {
	Grid,
	Box,
	TextField,
	Select,
	MenuItem,
	Button,
	InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
	AddCircleOutline,
	RemoveCircleOutline,
	ModelTraining,
} from "@mui/icons-material";
import { treinamentoWidrowHoff } from "./utils/treinamento_widrow_hoff";
import "./App.css";
import { ExibirResultado } from "./components/ExibirResultado.component";

export function App() {
	const [taxaAprendizagem, setTaxaAprendizagem] = useState(0.1);
	const [interacoes, setInteracoes] = useState(10);
	const [valores, setValores] = useState([
		{ x1: 0, x2: 0, esperado: 1 },
		{ x1: 0, x2: 0, esperado: 1 },
	]);
	const [pesos, setPesos] = useState([0, 0]);
	const [resultado, setResultado] = useState([]);

	const themes = {
		darkTheme: createTheme({ palette: { mode: "dark" } }),
	};

	const boxConfig = {
		p: 2,
		borderRadius: 2,
		border: 1,
	};

	const adicionarTreino = () => {
		const newValor = Object.fromEntries(
			Object.entries(valores[0]).map(([key]) => {
				if (key === "esperado") {
					return [key, 1];
				} else {
					return [key, 0];
				}
			})
		);

		setValores([...valores, newValor]);
	};

	const removerTreino = (index) => {
		const newValores = [...valores];
		newValores.splice(index, 1);
		setValores(newValores);
	};

	const adicionarPeso = () => {
		const newValores = [...valores];
		newValores.forEach((valor) => {
			valor[`x${pesos.length + 1}`] = 0;
		});
		setValores(newValores);
		setPesos([...pesos, 0]);
	};

	const removerPeso = (index) => {
		const newPesos = [...pesos];
		newPesos.splice(index, 1);

		const newValores = [...valores];
		newValores.forEach((valor) => {
			delete valor[`x${index + 1}`];
		});
		setValores(newValores);
		setPesos(newPesos);
	};

	const treinar = () => {
		const entradas = valores
			// eslint-disable-next-line no-unused-vars
			.map(({ esperado, ...rest }) => rest)
			.map(Object.values);

		const metas = valores.map(({ esperado }) => esperado);

		const resultados = treinamentoWidrowHoff(
			entradas,
			metas,
			pesos,
			taxaAprendizagem,
			interacoes
		);

		setResultado(resultados);
	};

	return (
		<>
			<ThemeProvider theme={themes.darkTheme}>
				<h1>Widrow Hoff Calculator</h1>
				<Grid container spacing={2} rowSpacing={4}>
					<Grid item container spacing={2} xs={12}>
						<Grid item xs={6}>
							<Box sx={boxConfig}>
								<h2>Configurações</h2>
								<Grid container spacing={2}>
									<Grid item container spacing={2} xs={12}>
										<Grid item xs={6}>
											<TextField
												type="number"
												inputProps={{ min: 0, step: 0.01 }}
												label="Taxa de aprendizado"
												value={taxaAprendizagem}
												onChange={(event) =>
													setTaxaAprendizagem(+event.target.value)
												}
												fullWidth
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												type="number"
												inputProps={{ min: 0, step: 10 }}
												label="Épocas"
												value={interacoes}
												onChange={(event) => setInteracoes(+event.target.value)}
												fullWidth
											/>
										</Grid>
									</Grid>
									<Grid item container spacing={2} xs={12}>
										{pesos.map((valor, index) => {
											return (
												<Grid item xs={6} key={index}>
													<TextField
														type="number"
														inputProps={{ min: 0, step: 0.01 }}
														InputProps={{
															endAdornment: (
																<>
																	{index + 1 === pesos.length && index > 1 ? (
																		<InputAdornment position="end">
																			<RemoveCircleOutline
																				color="error"
																				onClick={() => removerPeso(index)}
																			/>
																		</InputAdornment>
																	) : null}
																</>
															),
														}}
														label={`W${index + 1} - X${index + 1}`}
														value={valor}
														onChange={(event) => {
															let newPesos = [...pesos];
															newPesos[index] = +event.target.value;
															setPesos(newPesos);
														}}
														fullWidth
													/>
												</Grid>
											);
										})}
									</Grid>
								</Grid>
							</Box>
						</Grid>
						<Grid item xs={6}>
							<Box sx={boxConfig}>
								<h2>Tabela de treinamento</h2>
								<Grid container spacing={2}>
									<Grid item container spacing={2} xs={12}>
										{pesos.map((valor, index) => {
											return (
												<Grid item xs key={index}>
													{`X${index + 1}`}
												</Grid>
											);
										})}
										<Grid item xs>
											Esperado
										</Grid>
										<Grid item xs={1}></Grid>
									</Grid>
									{valores.map((valor, indexValor) => {
										return (
											<Grid
												item
												container
												alignItems="center"
												spacing={2}
												xs={12}
												key={indexValor}
											>
												{pesos.map((peso, indexPeso) => {
													return (
														<Grid item xs key={indexPeso}>
															<TextField
																type="number"
																inputProps={{ min: 0, max: 1, step: 1 }}
																value={valor[`x${indexPeso + 1}`]}
																onChange={(event) => {
																	let newValores = [...valores];
																	newValores[indexValor][`x${indexPeso + 1}`] =
																		+event.target.value;
																	setValores(newValores);
																}}
																fullWidth
															/>
														</Grid>
													);
												})}
												<Grid item xs>
													<Select fullWidth defaultValue={valor.esperado}>
														<MenuItem value={-1}>-1</MenuItem>
														<MenuItem value={1}>1</MenuItem>
													</Select>
												</Grid>
												<Grid item xs={1}>
													{indexValor > 1 ? (
														<RemoveCircleOutline
															color="error"
															onClick={() => removerTreino(indexValor)}
														/>
													) : null}
												</Grid>
											</Grid>
										);
									})}

									<Grid item container justifyContent="space-between" xs={12}>
										<Grid item container spacing={1} xs={6}>
											<Grid item>
												<Button
													sx={{ gap: 0.5 }}
													variant="contained"
													onClick={adicionarTreino}
												>
													<AddCircleOutline />
													Treino
												</Button>
											</Grid>
											<Grid item>
												<Button
													sx={{ gap: 0.5 }}
													variant="outlined"
													onClick={adicionarPeso}
												>
													<AddCircleOutline />
													Parametro
												</Button>
											</Grid>
										</Grid>
										<Grid item>
											<Button
												sx={{ gap: 0.5 }}
												variant="contained"
												onClick={treinar}
											>
												<ModelTraining />
												Treinar
											</Button>
										</Grid>
									</Grid>
								</Grid>
							</Box>
						</Grid>
					</Grid>
					<Grid item xs={12}>
						{resultado.length > 0 ? (
							<ExibirResultado resultado={resultado} />
						) : null}
					</Grid>
				</Grid>
			</ThemeProvider>
		</>
	);
}
