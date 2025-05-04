import Home from "./pages/home/Home";
import Student from "./pages/student/Student";
import Students from "./pages/students/Students";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Drivers from "./pages/drivers/Drivers";
import Mechanics from "./pages/mechanics/Mechanics";
import Driver from "./pages/driver/Driver";
import Mechanic from "./pages/mechanic/Mechanic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

const queryClient = new QueryClient();

const Layout = () => {
  const isAuthenticated = !!localStorage.getItem("authToken");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="main">
      <Navbar />
      <div className="container">
        <div className="menuContainer">
          <Menu />
        </div>
        <div className="contentContainer">
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/students",
        element: <Students />,
      },
      {
        path: "/student/:id",
        element: <Student />,
      },
      {
        path: "/drivers",
        element: <Drivers />,
      },
      {
        path: "/driver/:id",
        element: <Driver />,
      },
      {
        path: "/mechanics",
        element: <Mechanics />,
      },
      {
        path: "/mechanic/:id",
        element: <Mechanic />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
