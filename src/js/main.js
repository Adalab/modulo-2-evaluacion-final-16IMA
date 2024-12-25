'use strict';

/* Query selectors */
const searchBox = document.querySelector(".js_searchBox");
const searchBtn = document.querySelector(".js_searchBtn");
const cards = document.querySelector(".js_cards");
const cardsFavorites = document.querySelector(".js_cardsFavorites");
const cardsCharacteres = document.querySelector(".js_cardsCharacteres");
cardsCharacteres.setAttribute("data-id"," ")
/* Objetos*/

let characters = [];
let favorites = [];



searchBtn.addEventListener("click", () => {
   
});





/* Functions */

/*Función renderiza una tarjeta */

function renderOneCharacterCard(objCharacter) {
    return `<li class="js_cardBox card__box" data-id=${objCharacter._id}>
            <img src="${objCharacter.imageUrl}" alt="character image ${objCharacter.name}"/>
            <p>${objCharacter.name}</p>
          </li>`;
    
};

/*Función renderiza todas las tarjetas*/

function renderAllCharactersCards() {
    let html = "";
    for(const objCharacter of characters){
        html+= renderOneCharacterCard(objCharacter);
    }
    cardsCharacteres.innerHTML=html;

/*Añade evento click a cada <li>*/

    const cardBox = document.querySelectorAll(".js_cardBox");

    for(const li of cardBox) {
        li.addEventListener("click", (ev) =>{
            ev.preventDefault();
            handleFavourite(ev);
            
            console.log(ev.currentTarget);

            /*Coge el atributo nuevo data-id como ancla para coger el objeto del array characters e incluirlo en el array favorites */

            const idCharacter = ev.currentTarget.getAttribute("data-id");
            console.log(parseInt(idCharacter));
            const character = characters.find((char) => char._id === parseInt(idCharacter));

            /*Establece una condición if para evitar duplicados en el array favorites */

            if (!favorites.some((char) => char._id === character._id)) {
                favorites.push(character);
                console.log(favorites);

                renderFavoritesCards();

                /*Incluye en el localStorage el array favorites*/

                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
            
        });
    }
};

/*Función renderiza todas las tarjetas de favoritos */

function renderFavoritesCards() {
    let html = "";
    for(const objCharacter of favorites){
        html+= renderOneCharacterCard(objCharacter);
    }
    cardsFavorites.innerHTML=html;
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
    const savedFavorites = JSON.parse(localStorage.getItem('favorites'));
    favorites = favorites.concat(savedFavorites);
    renderFavoritesCards();
        
  })
