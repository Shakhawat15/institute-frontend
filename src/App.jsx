import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import the Pages
import { getToken } from "./helper/SessionHelper";

// Import Backend Pages
import LoginPage from "./pages/Backend/Login/LoginPage";
import DashboardPage from "./pages/Backend/Dashboard/DashboardPage";
import InstitutePage from "./pages/Backend/Institute/InstitutePage";

// Import Frontend Pages
import HomePage from "./pages/Frontend/Home/HomePage";

function App() {
  if (getToken()) {
    return (
      <Fragment>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/dashboard" element={<DashboardPage />} />
            <Route exact path="/institute" element={<InstitutePage />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<HomePage />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default App;
