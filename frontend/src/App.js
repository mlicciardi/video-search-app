import VideoUpload from './VideoUpload';
import './App.css';
import SearchBar from './SearchBar';
import { useState } from 'react';
import SearchResults from './SearchResults';

function App() {
  const [results, setResults] = useState();

  const onSearch = () => {
    setResults(results);
  }

  return (
    <div className="App">
      <VideoUpload />
      <SearchBar onSearch={(results) => onSearch(results)} />
      <SearchResults results={results} />
    </div>
  );
}

export default App;
