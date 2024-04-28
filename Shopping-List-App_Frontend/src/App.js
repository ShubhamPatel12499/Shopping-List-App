import './App.css';
import ShoppingList from './Pages/ShoppingList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
     <ShoppingList />
     <ToastContainer />
    </div>
  );
}

export default App;
