import { StrictMode } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { createTheme } from "@mui/material";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/global.scss";

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#E16627',
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider theme={customTheme}>
      <App />
    </AppProvider>
  </StrictMode>
);
