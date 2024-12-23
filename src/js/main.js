'use strict';

/* Query selectors */
const searchBox = document.querySelector(".js_searchBox");
const searchBtn = document.querySelector(".js_searchBtn");
const cards = document.querySelector(".js_cards");
const cardsFavorites = document.querySelector(".js_cardsFavorites");
const cardsCharacteres = document.querySelector(".js_cardsCharacteres");

/* Objetos*/

let characters = [];
let favorites = [];


/* Event listeners */

searchBtn.addEventListener("click", () => {});
searchBox.addEventListener("click", () => {});
cardsCharacteres.addEventListener("click", handleFavourite);



/* Functions */

function renderOneCharacterCard(objCharacter) {
    return `<li class="cards__box">
            <img src="${objCharacter.imageUrl}" alt="character image ${objCharacter.name}"/>
            <p>${objCharacter.name}</p>
          </li>`;
    
};

function renderAllCharactersCards() {
    let html = "";
    for(const objCharacter of characters){
        html+= renderOneCharacterCard(objCharacter);
    }
    return cardsCharacteres.innerHTML=html;
};

const handleFavourite = (ev) => {
  console.log('favorite');
  console.log(ev.currentTarget);

  
  
};


/* API fetch */
fetch('https://api.disneyapi.dev/character?pageSize=50').
  then(response => response.json())
  .then((data)=> {
    characters=data.data;
    renderAllCharactersCards();
    console.table(characters);
  })
