'use strict';

/* Query selectors */
const searchBox = document.querySelector(".js_searchBox");
const searchBtn = document.querySelector(".js_searchBtn");
const cards = document.querySelector(".js_cards");
const cardsFavorites = document.querySelector(".js_cardsFavorites");
const cardsCharacteres = document.querySelector(".js_cardsCharacteres");
const cardsBox1 = document.querySelector(".js_cardsBox1");
const cleanBtn = document.querySelector(".js_cardsCleanBtn")

/* Objetos*/

let characters = [];
let favorites = [];

/* Eventos */

//Evento botón de búsqueda que hace fetch tomando el témino que se incluya en la barra de búsqueda.
searchBtn.addEventListener("click", () => {
    const searchTerm = searchBox.value.trim().toLowerCase();
  
    if (searchTerm === "") {
      fetchAllCharacters();
    } else {
      fetchSearchedCharacters(searchTerm);
    }
  });

//Evento barra de búsqueda que hace fetch de todo el JSON si la barra está vacía.  
searchBox.addEventListener("input", () => {
  if (searchBox.value.trim() === "") {
    fetchAllCharacters();
  }
});

/*Evento botón de borrado que elimina el onjeto del localstorage en el que almacenamos favoritos, 
renderiza de nuevo el array vacío y elimina el sombreado de tarjetas characters.*/
cleanBtn.addEventListener("click", () => {
  event.preventDefault();
  localStorage.removeItem("favorites");
  getFavoritesLocalstorage();
  changeClassForcharacters();
  
  });

/* Functions */

/*Función renderiza una tarjeta */

function renderOneCharacterCard(objCharacter) {
  const placeholderImage = "https://placehold.co/210x295/ffffff/555555/?text=Disney";
    
  return `<li class="js_cardBox cards__box" data-id="${objCharacter._id}">
            <img src="${objCharacter.imageUrl || placeholderImage}" 
             alt="character image ${objCharacter.name || "Disney character"}" class="cards__boxImg"/>
            <p class="cards__boxTxt">${objCharacter.name || "Disney character"}</p>
          </li>`;
};

/*Función renderiza todas las tarjetas e incorpora en cada elemento <li> el evento click */

function renderAllCharactersCards(arrayOfCharacter) {
    let html = "";
    for(const objCharacter of arrayOfCharacter){
        html+= renderOneCharacterCard(objCharacter);
    }
    cardsCharacteres.innerHTML=html;
    attachClickEventsToCards();
};

/*Añade evento click a cada <li> y almacena el obj seleccionado en la array favorites a través del _id. 
incorpora la clase que resalta la tarjeta*/

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

function attachClickEventsToEraserCards() {
  const cardsEraser = document.querySelectorAll(".js_cardsEraser");
  /*Añade evento click a cada <span>*/
  for (const eraser of cardsEraser) {
    eraser.addEventListener("click", (ev) => {
    ev.preventDefault();


      /*Coge el atributo nuevo data-id como ancla para coger el objeto del array favorites y eliminarlo del array favorites */
      const idCharacter = ev.currentTarget.getAttribute("data-id");
      const index = favorites.findIndex((char) => char._id === parseInt(idCharacter));

      /*Si el índice es distinto de -1, significa que el objeto se encontró en el array favorites y lo eliminamos */
      if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavoritesCards();
      }
    });
  }
}

/*Función renderiza todas las tarjetas de favoritos */

function renderFavoritesCards() {
  
/*Con un bucle iteramos por cada objeto de favoritos y pintamos una tarjeta */    
    let html = "";
    for(const objCharacter of favorites){
        
        html+= renderOneCharacterCard(objCharacter);
    }
    cardsFavorites.innerHTML=html;
//Cambiamos las clases de favoritos y aplicamos evento click de borrado a cada tarjeta.     
    changeClassForFavorites();
  
    attachClickEventsToEraserCards();
    
};


/*Función añade fondo a la tarjeta favorita */

const handleFavourite = (ev) => {
  ev.currentTarget.classList.add('cards__favorite');
};

/*Cambia con un bucle la clase del li para que no le afecte attachClickEventsToCards e incluimos con el DOM el input que nos permite 
eliminar cada tarjeta favorita por separado*/

function changeClassForFavorites() {
  for (const child of cardsFavorites.children) {
    child.classList.replace("js_cardBox", "js_cardBoxFavorite");

  }
  const cardBoxesFavorites = document.querySelectorAll(".js_cardBoxFavorite");
  for (const cardBoxFavorite of cardBoxesFavorites) {
    for (const child of cardBoxFavorite.children) {
      const id = cardBoxFavorite.getAttribute("data-id");
      const span = document.createElement("span");
      const text = document.createTextNode("✘");
      span.classList.add("js_cardsEraser", "cards__eraser");
      span.setAttribute("data-id",id)
      span.appendChild(text);
      child.appendChild(span);
    }
  }
  
};

/* cambia con un bucle la clase de cada una de las tarjetas para quitar el 
resaltado favorito de las tarjetas de charaters a través del DOM */ 
function changeClassForcharacters() {
  for (const child of cardsCharacteres.children) {
    child.classList.remove("cards__favorite");
  }
};

/*Función que se ejecuta cuando se carga la página, hace fetch de todo el JSON y renderiza las tarjetas de characters */
function fetchAllCharacters(){
    fetch('https://api.disneyapi.dev/character?pageSize=50').
    then(response => response.json())
    .then((data)=> {
        characters=data.data;
        renderAllCharactersCards(characters);
        
    });
};
        
/*Función que se ejecuta cuando se carga la página, hace get de toda la información guardada en localStorage
y renderiza las tarjetas de favorites. Si no hay nada en el localStorage, inicia de nuevo el array favorites vacío*/    
function getFavoritesLocalstorage() {
  const savedFavorites = JSON.parse(localStorage.getItem('favorites'));

  if (Array.isArray(savedFavorites)) {
    favorites = savedFavorites;
  } else {
    favorites = []; 
  }

  renderFavoritesCards();
}

/*Función que se ejecuta cuando se hace click en un botón de búsqueda, hace fetch de los personajes que coinciden con el término de búsqueda. 
Si no hay coincidencias, renderiza todas las tarjetas de characters.*/
function fetchSearchedCharacters(searchTerm) {
    fetch("https://api.disneyapi.dev/character?pageSize=50")
      .then((response) => response.json())
      .then((data) => {
          const filteredCharacters = data.data.filter((char) =>
          char.name.toLowerCase().includes(searchTerm));
          
        renderAllCharactersCards(filteredCharacters);
    })
      
  }

//Inicializa la página cargando las tarjetas de characters y favorites.
fetchAllCharacters();
getFavoritesLocalstorage();