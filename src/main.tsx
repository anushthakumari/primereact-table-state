import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrimeReactProvider } from "primereact/api";

import App from "./App.tsx";
import Loader from "./components/Loader.tsx";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<PrimeReactProvider>
			<App />
			<Loader />
		</PrimeReactProvider>
	</StrictMode>
);
