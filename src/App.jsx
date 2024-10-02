import { useState } from 'react';
import './App.css';

function App() {
  const [error, setError] = useState('Something is wrong');
  return (
    <div className="app">
      <p>
        What do you want to know?
        <button className="surprise">Surprise me</button>
      </p>
      <section className="input-container">
        <input value={''} placeholder="When is Christmas...?" onChange={''} />
        {!error && <button className>Ask me</button>}
        {error && <button>Ask me</button>}
      </section>
      <div className="search-result">
        <div key={''}>
          <p className="answer"></p>
        </div>
      </div>
    </div>
  );
}

export default App;
