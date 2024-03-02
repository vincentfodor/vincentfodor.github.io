import { useEffect, useState } from 'react';
import './App.css';
import { Header } from './components/Header';
import { ShoppingList } from './components/ShoppingList';

function App() {
  const [username, setUsername] = useState(localStorage.getItem("username"))

  useEffect(() => {
    if (!username) {
      promptUsername();
    }
  }, []);

  const promptUsername = () => {
    const newUsername = prompt("sag mir dein name", "Phil");

    if(!newUsername) {
      return promptUsername();
    }

    setUsername(newUsername);

    localStorage.setItem("username", newUsername);
  }

  const renderTitle = username?.endsWith("s") ? `📔 ${username}' Liste` : `📔 ${username}s Liste`

  return (
    <div className=''>
      <Header title={renderTitle} />
      <ShoppingList storageName="main" itemStorageName="main-items" />
    </div>
  );
}

export default App;
