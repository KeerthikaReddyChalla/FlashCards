import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ Question: '', Answer: '' });
  const [editingCard, setEditingCard] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [flipped, setFlipped] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;

  useEffect(() => {
    axios.get('http://localhost:5000/cards')
      .then(response => {
        setCards(response.data);
        setFlipped(new Array(response.data.length).fill(false));
      })
      .catch(error => {
        console.error('There was an error fetching the cards!', error);
      });
  }, []);

  const handleAddCard = () => {
    axios.post('http://localhost:5000/cards', newCard)
      .then(response => {
        setCards([...cards, { ...newCard }]); 
        setNewCard({ Question: '', Answer: '' });
        setShowAddForm(false);
      })
      .catch(error => {
        console.error('There was an error adding the card!', error);
      });
  };

  const handleDeleteCard = (question) => {
    axios.delete(`http://localhost:5000/cards/${encodeURIComponent(question)}`)
      .then(() => {
        setCards(cards.filter(card => card.Question !== question));
      })
      .catch(error => {
        console.error('There was an error deleting the card!', error);
      });
  };

  const handleEditCard = () => {
    axios.put(`http://localhost:5000/cards/${encodeURIComponent(editingCard.Question)}`, editingCard)
      .then(() => {
        setCards(cards.map(card => (card.Question === editingCard.Question ? editingCard : card)));
        setEditingCard(null);
      })
      .catch(error => {
        console.error('There was an error updating the card!', error);
      });
  };

  const handleFlip = (index) => {
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    setFlipped(newFlipped);
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && (currentPage * cardsPerPage) < cards.length) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const cardsToDisplay = cards.slice(startIndex, endIndex);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="card-container">
        {cardsToDisplay.map((card, index) => (
          <div
            key={card.Question} 
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
            <div className="card-actions">
              <button className="delete-button" onClick={(e) => {
                e.stopPropagation();
                handleDeleteCard(card.Question);
              }}>Delete</button>
              <button className="edit-button" onClick={(e) => {
                e.stopPropagation();
                setEditingCard(card);
              }}>Edit</button>
            </div>
            {editingCard && editingCard.Question === card.Question && (
              <div className="edit-form">
                <input
                  type="text"
                  value={editingCard.Question}
                  onChange={e => setEditingCard({ ...editingCard, Question: e.target.value })}
                />
                <input
                  type="text"
                  value={editingCard.Answer}
                  onChange={e => setEditingCard({ ...editingCard, Answer: e.target.value })}
                />
                <button onClick={handleEditCard}>Save Changes</button>
                <button onClick={() => setEditingCard(null)}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="pagination-button"
          onClick={() => handlePageChange('next')}
          disabled={endIndex >= cards.length}
        >
          Next
        </button>
      </div>
      <div className="add-card">
        {!showAddForm ? (
          <button className="add-card-button" onClick={() => setShowAddForm(true)}>Add New Card</button>
        ) : (
          <div className="add-card-form">
            <h2>Add New Card</h2>
            <input
              type="text"
              placeholder="Question"
              value={newCard.Question}
              onChange={e => setNewCard({ ...newCard, Question: e.target.value })}
            />
            <input
              type="text"
              placeholder="Answer"
              value={newCard.Answer}
              onChange={e => setNewCard({ ...newCard, Answer: e.target.value })}
            />
            <button onClick={handleAddCard}>Add Card</button>
            <button onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
