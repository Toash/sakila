import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ErrorBoundary } from "react-error-boundary";
import { Typography } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router";
import { FilmPage } from "./pages/FilmPage.jsx";
import Top5FilmPage from "./pages/Top5FilmPage.jsx";

function Fallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong :(</p>
      {/* what */}
      {console.log(error.message)}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={Fallback}
      onReset={(details) => {
        // Reset the state of your app so the error doesn't happen again
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Top5FilmPage />}></Route>
            <Route
              index
              path="/film/title/:title"
              element={<FilmPage />}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
