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

function showCharacters(userDatas) {
  let mainDiv = document.querySelector('.character-list');
  for (let i = 0; i < userDatas.length; i++) {
    let characterDiv = document.createElement('div');
    characterDiv.className = 'character-div';

    let characterImg = document.createElement('img');
    characterImg.src = '/' + userDatas[i].portrait;
    characterImg.alt = userDatas[i].name;
    characterImg.onerror = function onerror(e) {
      e.target.src = '/assets/noimage.png';
    };
    characterDiv.appendChild(characterImg);
    characterDiv.innerHTML = `<img src="/${userDatas[i].portrait}" alt=""><h6>${userDatas[i].name}</h6>`;
    mainDiv.appendChild(characterDiv);
  }
}
