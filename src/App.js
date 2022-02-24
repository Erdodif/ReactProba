import logo from './logo.svg';
import './App.scss';
import Folders from './Folders'

function App() {
  getFolders();
  let folders = new Folders();
  return (
    <div className="App">
      <p>Helló</p>
      {folders}
      <img src={logo} className="Logo" alt="React JS."/>
    </div>
  );
}

async function getFolders(){
  let text = await fetch('localhost').text;
  console.log(text);
  return text;
}

export default App;
