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

/* Eventos */

searchBtn.addEventListener("click", () => {
    const searchTerm = searchBox.value.trim().toLowerCase();
  
    if (searchTerm === "") {
      fetchAllCharacters();
    } else {
      fetchSearchedCharacters(searchTerm);
    }
  });



  searchBox.addEventListener("input", () => {
    if (searchBox.value.trim() === "") {
      fetchAllCharacters();
    }
  });


/* Functions */

/*Función renderiza una tarjeta */

function renderOneCharacterCard(objCharacter) {
  const placeholderImage = "https://via.placeholder.com/210x295/ffffff/555555/?text=Disney";
  
  return `<li class="js_cardBox card__box" data-id=${objCharacter._id}>
            <img 
              src="${objCharacter.imageUrl || placeholderImage}" 
              alt="character image ${objCharacter.name}" 
              onerror="console.error('Imagen no encontrada:', this.src); this.src='${placeholderImage}'"
            />
            <p>${objCharacter.name}</p>
          </li>`;
};

/*Función renderiza todas las tarjetas*/

function renderAllCharactersCards(arrayOfCharacter) {
    let html = "";
    for(const objCharacter of arrayOfCharacter){
        html+= renderOneCharacterCard(objCharacter);
    }
    cardsCharacteres.innerHTML=html;
    attachClickEventsToCards();
};

/*Añade evento click a cada <li>*/

function attachClickEventsToCards() {
    const cardBox = document.querySelectorAll(".js_cardBox");

    for(const li of cardBox) {
        li.addEventListener("click", (ev) =>{
            ev.preventDefault();
            handleFavourite(ev);

            /*Coge el atributo nuevo data-id como ancla para coger el objeto del array characters e incluirlo en el array favorites */

            const idCharacter = ev.currentTarget.getAttribute("data-id");
            const character = characters.find((char) => char._id === parseInt(idCharacter));

            /*Establece una condición if para evitar duplicados en el array favorites */

            if (!favorites.some((char) => char._id === character._id)) {
                favorites.push(character);
                renderFavoritesCards();

                /*Incluye en el localStorage el array favorites*/

                localStorage.setItem('favorites', JSON.stringify(favorites));
            };
            
        });
    };
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


function fetchAllCharacters(){
    fetch('https://api.disneyapi.dev/character?pageSize=50').
    then(response => response.json())
    .then((data)=> {
        characters=data.data;
        renderAllCharactersCards(characters);
    });
};
        
    
function getFavoritesLocalstorage(){
    const savedFavorites = JSON.parse(localStorage.getItem('favorites'));
    favorites = favorites.concat(savedFavorites);
    renderFavoritesCards();
};

function fetchSearchedCharacters(searchTerm) {
    fetch("https://api.disneyapi.dev/character?pageSize=50")
      .then((response) => response.json())
      .then((data) => {
          const filteredCharacters = data.data.filter((char) =>
          char.name.toLowerCase().includes(searchTerm));
        renderAllCharactersCards(filteredCharacters);
    })
      .catch((error) =>
        console.error("Error al buscar personajes con término:", error)
      );
  }

fetchAllCharacters();
getFavoritesLocalstorage();



