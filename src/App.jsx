import { useState } from 'react';
import './App.css';

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  
  const surpriseOptions = [
    'Who won the latest Novel Peace Prize?',
    'Where does pizza come from?',
    'Who do you make a BLT sandwitch?'
  ]
  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue)
  }
  const getResponse = async() => {
    if(!value){
      setError("error! Please ask a question!")
      return
    }
    try{
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message:value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:3000/gemini', options)
      const data = await response.text()
      console.log(data);

    }catch (error) {
      console.error(error)
      setError("Something went wrong! Please try again later.")
    }
  }
  return (
    <div className="app">
      <p>
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me</button>
      </p>
      <div className="input-container">
        <input value={value} placeholder="When is Christmas...?" onChange={(e)=> setValue(e.target.value)} />
        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        <div key={""}>
          <p className="answer"></p>
        </div>
      </div>
    </div>
  );
}

export default App;
