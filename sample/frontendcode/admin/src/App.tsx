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

ReactFC.fcRoot(
  FusionCharts,
  Charts,
  PowerCharts,
  Widgets,
  ExcelExport,
  FusionTheme
);
const licenseKey = KEY_CONFIG.FUSIONCHARTS_LICENSE_KEY;
FusionCharts.options.license({
  key: licenseKey,
  creditLabel: false,
});

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
