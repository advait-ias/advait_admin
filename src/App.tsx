import Home from "./pages/home/Home";
import Student from "./pages/student/Student";
import Students from "./pages/students/Students";
import Menu from "./components/menu/Menu";
import Login from "./pages/login/Login";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Courses from "./pages/courses/Courses";
import Tests from "./pages/tests/Tests";
import LiveClasses from "./pages/liveclasses/LiveClasses";

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
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/tests",
        element: <Tests />,
      },
      {
        path: "/liveclasses",
        element: <LiveClasses />,
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
