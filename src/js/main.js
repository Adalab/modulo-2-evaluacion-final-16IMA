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




/* Functions */

/*Función renderiza una tarjeta */

function renderOneCharacterCard(objCharacter) {
    return `<li class="js_cardBox card__box">
            <img src="${objCharacter.imageUrl}" alt="character image ${objCharacter.name}"/>
            <p>${objCharacter.name}</p>
          </li>`;
    
};

/*Función renderiza todas las tarjetas y aplica envento click a cada una */

function renderAllCharactersCards() {
    let html = "";
    for(const objCharacter of characters){
        html+= renderOneCharacterCard(objCharacter);
    }
    cardsCharacteres.innerHTML=html;

    const cardBox = document.querySelectorAll(".js_cardBox");

    for(const li of cardBox) {
        li.addEventListener("click", (ev) =>{
            handleFavourite(ev);
            
        });
    }
    
};

/*Función añade fondo a la tarjeta favorita */

const handleFavourite = (ev) => {
  console.log('favorite');
  console.log(ev.currentTarget);

  ev.currentTarget.classList.toggle('favourite');


};


/* API fetch */
fetch('https://api.disneyapi.dev/character?pageSize=50').
  then(response => response.json())
  .then((data)=> {
    characters=data.data;
    renderAllCharactersCards();
    console.table(characters);
        
  })
