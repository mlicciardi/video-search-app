import React from 'react';

const SearchResults = ({ results }) => {
  return (
    <div>
      {results ? results.map((result, index) => (
        <div key={index}>
          <p>Timestamp: {result.timestamp}</p>
          <img src={result.frameUrl} alt="Video frame" />
        </div>
      )) : null}
    </div>
  );
};

export default SearchResults;
