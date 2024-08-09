import { Component } from "react";
import "./cat.css"

class Cat extends Component {

  constructor() {
    super();
    this.state = {
        catFact: "",
        catImageURL: "",
        loading: true,
        pause: false,
        timer: 10
    }
    this.intervalId = null;
  }

  fetchCatFact = () => {
    fetch("https://catfact.ninja/fact/")
    .then(response => response.json())
    .then(data => this.setState({catFact: data.fact, loading: false}));
  }

   fetchCatImage = () => {
    fetch("https://api.thecatapi.com/v1/images/search")
      .then((response) => response.json())
      .then((data) => {this.setState({ catImageURL: data[0].url })
      });
    };

   fetchCatData = () => {
        this.setState({ loading: true, timer: 10 });
        Promise.all([this.fetchCatFact(), this.fetchCatImage()]).then(() => {
            this.setState({loading: false});
        });
    };

    componentDidMount() {
        this.fetchCatData();
        this.intervalId = setInterval(() => {
            this.setState((prevState) => ({
                timer: prevState.timer > 0 ? prevState.timer - 1 : 10
            }), () => {
                if (this.state.timer === 10) {
                    this.fetchCatData();
                }
            })
        }, 1000);
    }

    componentWillUnmount() {
        if (this.intervalId) clearInterval(this.intervalId);
    }

    handlePauseButton = () => {
        this.setState(prevState => ({ pause: !prevState.pause }), () => {
          if (this.state.pause) {
            clearInterval(this.intervalId);
          } else {
            this.intervalId = setInterval(() => {
              this.setState(prevState => ({
                timer: prevState.timer > 0 ? prevState.timer - 1 : 10
              }), () => {
                if (this.state.timer === 10) {
                  this.fetchCatData();
                }
              });
            }, 1000);
          }
        });
      }

  render() {
    console.log(this.state.catFact, this.state.catImageURL)

    if (this.state.loading) {
        return (
            <p>Loading a cute cat and a cat fact......</p> 
        );
    }

    return (
      <>
        <div className="cat-container">
            <h3>Get a random cat fact every 10 seconds!</h3>
            <div className="timer">Next fact in: {this.state.timer}s</div>
            <div>
                <img src={this.state.catImageURL} alt="Cat" />
                <p>{this.state.catFact}</p>
                <button onClick={this.handlePauseButton}>{this.state.pause ? "CONTINUE" : "PAUSE"}</button>
            </div>
        </div>
      </>
    );
  } 
}

export default Cat;
