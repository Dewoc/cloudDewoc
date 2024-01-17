import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login/Login";
import DashboardLayout from "./Dashboard/Layout";
import { getLocalStorage } from "./shared";
import ViewController from "./Dashboard/ViewController";
import BotInputs from "./Dashboard/bots/input/page";

// import { getLocalStorage } from "./shared";

// function PrivateRoute({ element, ...props }: { element: JSX.Element } & RouteProps){
//   const token = (getLocalStorage("access_token") as { itemData: { token: string } }).itemData.token;

//   const Private = () => {
//     if(!token) redirect("/login");

//     return element;
//   }
//   return <Route {...props} element={<Private />} />
// }

const Protected = ({ children }: { children: JSX.Element }) => {
  const isLoggedIn = !!getLocalStorage<string>("access_token");

  if (!isLoggedIn) {
    return <Navigate to="/noaccess" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/bots/input" element={
          <Protected>
            <DashboardLayout
              children={() => <BotInputs />}
            />

          </Protected>
        } />
        <Route path="/dashboard" element={
          <Protected>
            <DashboardLayout
              children={(currentView: number) => <ViewController currentView={currentView} />}
            />
          </Protected>
        } />

        <Route path="*" element={
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            LA RUTA A LA QUE SE QUIERE ACCEDER NO EXISTE
          </div>
        } />
        <Route path="/noaccess" element={
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            NO TIENE LAS CREDENCIALES ADECUADAS PARA LA RUTA SOLICITADA
          </div>} />
      </Routes>
    </BrowserRouter >
  )
}

export default App
