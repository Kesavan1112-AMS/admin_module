import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./routes/Routes";
import { Toaster } from "react-hot-toast";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import PowerCharts from "fusioncharts/fusioncharts.powercharts";
import Widgets from "fusioncharts/fusioncharts.widgets";
import ExcelExport from "fusioncharts/fusioncharts.excelexport";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";
import { KEY_CONFIG } from "./config/Key.config";
import { ErrorBoundary } from "./components/sharedComponents/ErrorBoundary";

ReactFC.fcRoot(
  FusionCharts,
  Charts,
  PowerCharts,
  Widgets,
  ExcelExport,
  FusionTheme
);

// Set license key if available
if (KEY_CONFIG.FUSIONCHARTS_LICENSE_KEY) {
  (FusionCharts as any).options.license({
    key: KEY_CONFIG.FUSIONCHARTS_LICENSE_KEY,
    creditLabel: false,
  });
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
