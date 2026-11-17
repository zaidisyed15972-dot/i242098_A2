import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VisitProvider } from "./context/VisitContext.jsx";
import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import ItineraryPage from "./pages/ItineraryPage.jsx";

export default function App() {
  return (
    <VisitProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/exhibitions" element={<CatalogPage />} />
          <Route path="/exhibitions/:id" element={<DetailPage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route
            path="*"
            element={
              <main className="container page-content">
                <div className="state-box">
                  <h1>404 &mdash; Page Not Found</h1>
                  <p>The page you requested does not exist.</p>
                </div>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </VisitProvider>
  );
}