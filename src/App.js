import React from 'react';
import Container from '@material-ui/core/Container'

import TopWords from './TopWords.js';

function App() {
  return (
    <div className="App">
      <Container fixed>
        <TopWords numberOfTopics={50}/>
      </Container>
    </div>
  );
}

export default App;
