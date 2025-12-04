import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { EditWheel } from './pages/EditWheel';
import { SpinWheel } from './pages/SpinWheel';
import { Templates } from './pages/Templates';
import { ColorPicker } from './pages/ColorPicker';
import { Settings } from './pages/Settings';
import { Statistics } from './pages/Statistics';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<EditWheel />} />
        <Route path="/spin/:id" element={<SpinWheel />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/color/:wheelId/:segmentId" element={<ColorPicker />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stats/:id" element={<Statistics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
