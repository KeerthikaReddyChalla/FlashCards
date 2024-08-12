import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CardStyle.css';

const CardComponent = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const cardsPerPage = 3;

  useEffect(() => {
    axios.get('http://localhost:5000/cards')
      .then(response => {
        setCards(response.data);
        setFlipped(new Array(response.data.length).fill(false));
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const handleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * cardsPerPage < cards.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = currentPage * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentCards = cards.slice(startIndex, endIndex);

  return (
    <div>
      <h1>Home</h1>
    <div className="card-container">
      
      {currentCards.map((card, index) => (
        <div
          key={card.id}
          className={`card ${flipped[startIndex + index] ? 'flipped' : ''}`}
          onClick={() => handleFlip(startIndex + index)}
        >
          <div className="card-inner">
            <div className="card-front">
              <h2>{card.Question}</h2>
            </div>
            <div className="card-back">
              <h2>{card.Answer}</h2>
            </div>
          </div>
        </div>
      ))}
      <div className="pagination-controls">
        <button className="pagination-button" onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous
        </button>
        <button className="pagination-button" onClick={handleNextPage} disabled={(currentPage + 1) * cardsPerPage >= cards.length}>
          Next
        </button>
      </div>
    </div>
    </div>
  );
};

export default CardComponent;
