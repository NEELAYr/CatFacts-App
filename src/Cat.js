import React, { useState, useEffect, useCallback } from "react";
import "./cat.css";

const Cat = () => {
  const [catFact, setCatFact] = useState("");
  const [catImageURL, setCatImageURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [pause, setPause] = useState(false);
  const [timer, setTimer] = useState(15);

  const fetchCatFact = useCallback(() => {
    return fetch("https://catfact.ninja/fact/")
      .then(response => response.json())
      .then(data => setCatFact(data.fact));
  }, []);

  const fetchCatImage = useCallback(() => {
    return fetch("https://api.thecatapi.com/v1/images/search")
      .then((response) => response.json())
      .then((data) => setCatImageURL(data[0].url));
  }, []);

  const fetchCatData = useCallback(() => {
    setLoading(true);
    setTimer(15);

    Promise.all([fetchCatFact(), fetchCatImage()]).then(() => {
      setLoading(false);
    });
  }, [fetchCatFact, fetchCatImage]);

  useEffect(() => {
    fetchCatData();
  }, [fetchCatData]);

  useEffect(() => {
    let intervalId;
    if (!pause) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            fetchCatData();
            return 15;

          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [pause, fetchCatData]);

  const handlePauseButton = () => {
    setPause((prevPause) => !prevPause);
  };

  if (loading) {
    return <p>Loading a cute cat and a cat fact......</p>;
  }

  return (
    <div className="cat-container">
      <h3>Get a random cat fact every 5 seconds!</h3>
      <div className="timer">Next fact in: {timer}s</div>
      <div>
        <img src={catImageURL} alt="Cat" />
        <p>{catFact}</p>
        <button onClick={handlePauseButton}>{pause ? "CONTINUE" : "PAUSE"}</button>
      </div>
    </div>
  );
};

export default Cat;