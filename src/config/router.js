import { createBrowserRouter } from "react-router-dom";
import Login from "@/routes/Login";
import Home from "@/routes/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
]);

export default router;
