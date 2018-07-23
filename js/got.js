function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function call() {
    if (this.readyState === 4 && this.status === 200) {
      callbackFunc(this);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // itt a json content, benne a data változóban
  var userDatas = JSON.parse(xhttp.responseText)[2].data;

  /*
      Pár sorral lejebb majd ezt olvashatod:
      IDE ÍRD A FÜGGVÉNYEKET!!!!!! NE EBBE AZ EGY SORBA HANEM INNEN LEFELÉ!

      Na azokat a függvényeket ITT HÍVD MEG!

      A userDatas NEM GLOBÁLIS változó, ne is tegyétek ki globálisra. Azaz TILOS!
      Ha valemelyik függvényeteknek kell, akkor paraméterként adjátok át.
    */
  deleteNotAliveCharacters(userDatas);
  orderCharactersToNameAsc(userDatas);
  showCharacters(userDatas);
  document.querySelector('#search-button').addEventListener('click', function event() {
    searchForCharacter(userDatas);
  });
}

// Írd be a json fileod nevét/útvonalát úgy, ahogy nálad van
getData('/json/characters.json', successAjax);

// Live servert használd mindig!!!!!
/* IDE ÍRD A FÜGGVÉNYEKET!!!!!! NE EBBE AZ EGY SORBA HANEM INNEN LEFELÉ! */

function deleteNotAliveCharacters(userDatas) {
  for (let i = 0; i < userDatas.length; i++) {
    if (userDatas[i].dead) {
      userDatas.splice(i, 1);
    }
  }
}
function orderCharactersToNameAsc(userDatas) {
  for (let i = 0; i < userDatas.length - 1; i++) {
    for (let j = i + 1; j < userDatas.length; j++) {
      if (userDatas[i].name.localeCompare(userDatas[j].name) > 0) {
        [userDatas[i], userDatas[j]] = [userDatas[j], userDatas[i]];
      }
    }
  }
}

function createCharacterDiv(container, divname) {
  var oneCharacterDiv = container.querySelector(`.${divname}`);
  if (!oneCharacterDiv) {
    oneCharacterDiv = document.createElement('div');
    oneCharacterDiv.className = divname;
    container.appendChild(oneCharacterDiv);
  }
  return oneCharacterDiv;
}

function createImage(target, alt) {
  let img = document.createElement('img');
  img.src = '/' + target;
  img.alt = alt;
  img.onerror = function imageError(e) {
    e.target.src = '/assets/noimage.png';
  };
  return img;
}

function getHouseIcon(house) {
  let houseDiv = document.createElement('div');
  houseDiv.className = 'one-character-div-house';
  if (house.length > 0) {
    houseDiv.appendChild(createImage(`assets/houses/${house}.png`, house));
  }
  return houseDiv;
}

function createCharacterNameDiv(name) {
  let nameDiv = document.createElement('div');
  nameDiv.className = 'one-character-div-name';
  nameDiv.innerHTML = name;
  return nameDiv;
}

function createCharacterBioDiv(bio) {
  let nameDiv = document.createElement('div');
  nameDiv.className = 'one-character-div-bio';
  nameDiv.innerHTML = bio;
  return nameDiv;
}

function showOneCharacter(character) {
  let container = document.querySelector('.one-character');
  let oneCharacterDiv = createCharacterDiv(container, 'one-character-div');
  oneCharacterDiv.innerHTML = '';

  oneCharacterDiv.appendChild(createImage(character.picture, character.name));
  oneCharacterDiv.appendChild(createCharacterNameDiv(character.name));
  oneCharacterDiv.appendChild(getHouseIcon(character.house));
  oneCharacterDiv.appendChild(createCharacterBioDiv(character.bio));

  container.appendChild(oneCharacterDiv);
}

function removeSelectedTags() {
  var characterDivs = document.querySelectorAll('.character-div');
  for (let i = 0; i < characterDivs.length; i++) {
    if (characterDivs[i].classList.contains('selected')) {
      characterDivs[i].classList.remove('selected');
    }
  }
}

function setCharacterClickEvent(characterDiv, character) {
  characterDiv.addEventListener('click', function clickEvent() {
    showOneCharacter(character);
    removeSelectedTags();
    characterDiv.classList.add('selected');
  });
}

function createCharacterHeading(name) {
  let nameHeading = document.createElement('h6');
  nameHeading.innerHTML = name;
  return nameHeading;
}

function showCharacters(userDatas) {
  let mainDiv = document.querySelector('.character-list');
  for (let i = 0; i < userDatas.length; i++) {
    let characterDiv = document.createElement('div');
    characterDiv.className = 'character-div';

    let characterImg =  createImage(userDatas[i].portrait, userDatas[i].name);
    characterDiv.appendChild(characterImg);
    characterDiv.appendChild(createCharacterHeading(userDatas[i].name));

    setCharacterClickEvent(characterDiv, userDatas[i]);

    mainDiv.appendChild(characterDiv);
  }
}

function showIfNotFound(found) {
  if (!found) {
    let container = document.querySelector('.one-character');
    let oneCharacterDiv = createCharacterDiv(container, 'one-character-div');
    oneCharacterDiv.innerHTML = 'Character not found';
    container.appendChild(oneCharacterDiv);
  }
}
function searchForCharacter(userDatas) {
  let searched = document.querySelector('#search-text').value.toLowerCase();
  let found = false;
  for (let i = 0; i < userDatas.length; i++) {
    if (userDatas[i].name.toLowerCase() === searched) {
      found = true;
      showOneCharacter(userDatas[i]);
    }
  }
  showIfNotFound(found);
}
