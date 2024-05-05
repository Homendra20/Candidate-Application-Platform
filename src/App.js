
import './App.css';
import Dashboard from './component/Dashboard';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <Router>
    <Routes>
    <Route exact path="/" element={ <Dashboard/>}  />
    
    </Routes>
    
    </Router>
   
    </div>
  );
}

export default App;
