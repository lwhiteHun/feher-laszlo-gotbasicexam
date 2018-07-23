function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
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
  console.log(userDatas);
  orderCharactersToNameAsc(userDatas);
  console.log(userDatas);
  showCharacters(userDatas);
  document.querySelector('#search-button').addEventListener('click', function () {
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
  console.log(target);
  let img = document.createElement('img');
  img.src = '/' + target;
  img.alt = alt;
  img.onerror = function (e) {
    e.target.src = '/assets/noimage.png';
  };
  console.log(img);
  return img;
}

function getHouseIcon(house) {
  let result = '<div class="one-character-div-house"></div>';
  if (house !== '') {
    /* result= `
      <div class="one-character-div-house">${createImage('assets/houses/' + house + '.png', house)}</div>`;*/
    result = `<div class="one-character-div-house"><img src="/assets/houses/${house}.png"></div>`;
  }
  return result;
}

function showOneCharacter(character) {
  let container = document.querySelector('.one-character');
  let oneCharacterDiv = createCharacterDiv(container, 'one-character-div');
  oneCharacterDiv.innerHTML = '';
  let img = createImage(character.picture, character.name);

  oneCharacterDiv.appendChild(img);
  oneCharacterDiv.innerHTML += `
  <div class="one-character-div-name">${character.name}</div>`;
  oneCharacterDiv.innerHTML +=  getHouseIcon(character.house);

  oneCharacterDiv.innerHTML += `<div>${character.bio}</div>`;


  container.appendChild(oneCharacterDiv);
}

function showCharacters(userDatas) {
  let mainDiv = document.querySelector('.character-list');
  for (let i = 0; i < userDatas.length; i++) {
    let characterDiv = document.createElement('div');
    characterDiv.className = 'character-div';
    /*
    let characterImg = document.createElement('img');
    characterImg.src = '/' + userDatas[i].portrait;
    characterImg.alt = userDatas[i].name;
    characterImg.onerror = function onerror(e) {
      e.target.src = '/assets/noimage.png';
    };
    characterDiv.appendChild(characterImg);
    */
    characterDiv.innerHTML = `<img src="/${userDatas[i].portrait}" alt=""><h6>${userDatas[i].name}</h6>`;
    characterDiv.addEventListener('click', function () {
      showOneCharacter(userDatas[i]);
    });
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
