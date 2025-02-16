import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { BrowserRouter, Routes, Route } from "react-router";
import { FilmPage } from "./pages/FilmPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import { ActorPage } from "./pages/ActorPage.jsx";
import FilmsPage from "./pages/FilmsPage.jsx";

import { ErrorBoundary } from "react-error-boundary";

const logError = (error, info) => {
  // Do something with the error, e.g. log to an external API
  console.log(error);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary
      onError={logError}
      fallback={<div>Something went wrong :(</div>}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            {/* main pages */}
            <Route index element={<LandingPage />}></Route>
            <Route index path="/films" element={<FilmsPage />}></Route>
            {/* sub pages */}
            <Route
              index
              path="/film/title/:title"
              element={<FilmPage />}
            ></Route>
            <Route index path="/actor/id/:id" element={<ActorPage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
