import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [concertData, setConcertData] = useState([]);
  const [randomConcert, setRandomConcert] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    fetchConcertData();
  }, []);

  useEffect(() => {
    if (randomConcert) {
      fetchImageUrls(randomConcert['Wikipedia Link']);
    }
  }, [randomConcert]);

  const fetchConcertData = async () => {
    try {
      const response = await fetch('tiny_desk_concerts_updated.json');
      const data = await response.json();
      setConcertData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchImageUrls = async (wikipediaLink) => {
    try {
      const response = await fetch(`http://localhost:8080/${wikipediaLink}`);
      const html = await response.text();

      // Cria um elemento HTML temporário para analisar o HTML retornado
      const tempElement = document.createElement('div');
      tempElement.innerHTML = html;

      // Procura as tags de imagem dentro do HTML analisado
      const imageElements = tempElement.querySelectorAll('.infobox-image img');
      if (imageElements.length > 0) {
        const urls = Array.from(imageElements).map((element) => {
          const imageUrl = element.getAttribute('src');
          return `https:${imageUrl}`; // Adiciona o prefixo 'https:' ao URL da imagem
        });
        setImageUrls(urls);
      } else {
        setImageUrls([]); // Limpa as imagens quando não há nenhuma disponível
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRandomImageUrl = () => {
    if (imageUrls.length > 0) {
      const randomIndex = Math.floor(Math.random() * imageUrls.length);
      return imageUrls[randomIndex];
    }
    return null;
  };

  const handleClickRandomize = () => {
    const randomIndex = Math.floor(Math.random() * concertData.length);
    setRandomConcert(concertData[randomIndex]);
  };

  const renderImage = () => {
    const imageUrl = getRandomImageUrl();

    if (imageUrl) {
      return <img src={imageUrl} alt="Artist" className="concert-image" />;
    }

    return null;
  };

  const renderConcertInfo = () => {
    if (randomConcert) {
      return (
        <div className="concert-info">
          <h2>{randomConcert.Artist}</h2>
          <p>Date: {randomConcert.Date}</p>
          <p>
            <a href={randomConcert['Wikipedia Link']} target="_blank" rel="noopener noreferrer">
              Wikipedia Link
            </a>
          </p>
          <p>
            <a href={randomConcert['NPR Article']} target="_blank" rel="noopener noreferrer">
              Play on NPR
            </a>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Tiny Desk Concert Randomizer</h1>
      <button className="randomize-button" onClick={handleClickRandomize}>
        Randomize
      </button>
      <div className="concert-container">
        {renderImage()}
        {renderConcertInfo()}
      </div>
    </div>
  );
}

export default App;
