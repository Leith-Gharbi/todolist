import logo from './logo.svg';
import './App.css';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import 'bootstrap/dist/css/bootstrap.css';
function App() {
  return (
    <div className="App m-5">
<TodoInput/>
<TodoList/>
    </div>
  );
}

export default App;


//npm i --save bootstrap
// npm i --save redux react-redux