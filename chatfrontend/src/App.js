import { Route } from "react-router-dom";
import "./App.css";
import ChatPage from "./components/ChatPage";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Home} exact />
      <Route path="/chatsPage" component={ChatPage} exact />
    </div>
  );
}

export default App;
