import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { Footer } from "./components/Footer";
import { getData } from "./lib/loadData";
import { CityPage } from "./pages/CityPage";

const { config } = getData();
const basename = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <div className="flex min-h-screen flex-col bg-zinc-50 text-ink">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to={`/${config.defaultCity}`} replace />} />
            <Route path="/:citySlug" element={<CityPage />} />
            <Route path="*" element={<Navigate to={`/${config.defaultCity}`} replace />} />
          </Routes>
        </main>
        <Footer config={config} />
      </div>
    </BrowserRouter>
  );
}
