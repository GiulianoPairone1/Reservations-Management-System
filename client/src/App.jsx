//Paginas
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landingpage from './Pages/LandingPage/LandingPage';
import Login from './Pages/Login/Login';
import Layout from './Components/Layout/Layout';
import Reservapage from './Pages/ReservaPage/Reservapage';
import PerfilPage from './Pages/PerfilPage/Perfilpage';
import Dashboardprofesional from './Pages/Dashboardprofesional/Dashboardprofesional';
import Dashboardmanager from './Pages/Dashboardmanager/Dashboardmanager';
import Crateuserclient from './Pages/CreateUserClient/CreateUserClient';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landingpage />} />
          <Route path="login" element={<Login />} />
          <Route path="reservapage" element={<Reservapage />} />
          <Route path="perfilpage" element={<PerfilPage />} />
          <Route path="dashboardprofesional" element={<Dashboardprofesional />} />
          <Route path="dashboardmanager" element={<Dashboardmanager />} />
          <Route path="createuserclient" element={<Crateuserclient />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
