import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import Contact from "./pages/Contact";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/despre", element: <About /> },
  // route updated to match Links used in the app
  { path: "/despre-noi", element: <About /> },
  { path: "/produse", element: <Products /> },
  { path: "/contact", element: <Contact /> },
]);

export default router;
