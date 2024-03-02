import './App.css';
import { Header } from './components/Header';
import { ShoppingList } from './components/ShoppingList';

function App() {
  return (
    <div className=''>
      <Header title="📔 Phils Liste" />
      <ShoppingList storageName="main" itemStorageName="main-items" />
    </div>
  );
}

export default App;
