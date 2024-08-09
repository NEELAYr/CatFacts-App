import { Component } from "react";
import "./App.css"
import Cat from "./Cat";

class App extends Component {
  render() {
    return (
      <>
        <div className="catApp">
          <div className="title">
            <h1>CatFacts</h1>
          </div>
          <Cat />
        </div>
      </>
    );
  } 
}

export default App;
