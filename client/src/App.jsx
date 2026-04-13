//Paginas
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landingpage from './Pages/LandingPage/LandingPage';
import Login from './Pages/Login/Login';
import Layout from './Components/Layout/Layout';
import Reservapage from './Pages/ReservaPage/Reservapage';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landingpage />} />
          <Route path="login" element={<Login />} />
          <Route path="reservapage" element={<Reservapage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
