import { useState } from 'react';
import './App.css';

const App = () => {
  const [value, setValue] = useState ('');
  const [error, setError] = useState ('');
  const [chatHistory, setChatHistory] = useState ([]);
  const [response, setResponse] = useState (''); // State to hold the response

  const surpriseOptions = [
    'Who won the latest Nobel Peace Prize?',
    'Where does pizza come from?',
    'How do you make a BLT sandwich?',
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor (Math.random () * surpriseOptions.length)];
    setValue (randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError ('Error! Please ask a question!');
      return;
    }

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify ({
          history: chatHistory,
          message: value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await fetch ('http://localhost:8000/geimini', options);
      if (!response.ok) {
        throw new Error ('Network response was not ok');
      }

      const data = await response.text (); // Assuming the backend will return plain text
      console.log (data); // Log the response for debugging
      setChatHistory (oldChatHistory => [
        ...oldChatHistory,
        {
          role: 'user',
          parts: value,
        },
        {
          role: 'model',
          parts: data, // Ensure the response is correctly assigned
        },
      ]);
      setValue ('');
    } catch (error) {
      console.error (error);
      setError ('Something went wrong! Please try again later.');
    }
  };

  const clear = () =>{
    setValue("")
    setError("")
    setChatHistory([])
  }
  
  return (
    <div className="app">
      <p>
        What do you want to know?
        <button
          className="surprise"
          onClick={surprise}
          disabled={!chatHistory.length}
        >
          Surprise me
        </button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="When is Christmas...?"
          onChange={e => setValue (e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map ((chatItem, _index) => (
          <div key={_index}>
            <p className="answer">
              {chatItem.role}:{chatItem.parts}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
