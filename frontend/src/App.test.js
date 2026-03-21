import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// smoke test that the shell renders and we can see the core UI
it("renders the application shell and shows the search control", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // the header search input placeholder should be present by default
  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();

  // make sure the navigation bar is rendered (banner role)
  expect(screen.getByRole("banner")).toBeInTheDocument();
});
