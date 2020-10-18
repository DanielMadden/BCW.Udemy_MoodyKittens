/**
 * Stores the list of kittens
 * @type {Kitten[]}
 */
let kittens = [];
let usedNames = [];
let loveDirection = .45;
/**
 * Called when submitting the new Kitten Form
 * This method will pull data from the form
 * use the provided function to give the data an id
 * you can use robohash for images
 * https://robohash.org/<INSERTCATNAMEHERE>?set=set4
 * then add that data to the kittens list.
 * Then reset the form
 */
function addKitten(event) {
  event.preventDefault()
  let name = event.target.name.value
  let nameCheck = usedNames.find(usedNames => usedNames == name)

  if (name == "") {
    //@ts-ignore
    document.getElementById("add-kitten-form").reset();
    alert("You didn't put a name. Make your cats feel special!")
  } else {
    if (!nameCheck) {
      let newKitten = {
        id: generateId(),
        name: name,
        mood: "tolerant",
        love: 5
      }

      usedNames.push(name)
      kittens.push(newKitten)
      console.log(newKitten)

      //@ts-ignore
      document.getElementById("add-kitten-form").reset();

      saveKittens()
      drawKittens()
      playSound("happy")
    } else {
      //@ts-ignore
      document.getElementById("add-kitten-form").reset();
      alert("You have already used this name. Make your cats feel special!")
    }
  }



}

/**
 * Converts the kittens array to a JSON string then
 * Saves the string to localstorage at the key kittens
 */
function saveKittens() {
  window.localStorage.setItem("kittens", JSON.stringify(kittens))
  window.localStorage.setItem("usedNames", JSON.stringify(usedNames))
}

/**
 * Attempts to retrieve the kittens string from localstorage
 * then parses the JSON string into an array. Finally sets
 * the kittens array to the retrieved array
 */
function loadKittens() {
  kittens = JSON.parse(window.localStorage.getItem("kittens"))
  if (kittens == null) {
    kittens = []
  }
  usedNames = JSON.parse(window.localStorage.getItem("usedNames"))
  if (usedNames == null) {
    usedNames = []
  }
}

/**
 * Draw all of the kittens to the kittens element
 */
function drawKittens() {
  let template = ""

  kittens.forEach(function (kitten) {

    template +=
      `
        <div class="kitten-kard">
          <div id="kitten-${kitten.id}" class="kitten ${kitten.mood}">
            <img class="kitten-image" src="https://robohash.org/${kitten.name}.png?set=set4">
            <div class="kitten-stats mt-1">
              <span class="kitten-stat">
                <b>Name: </b>
                <span id="name-${kitten.id}">${kitten.name}</span>
              </span>
              </br>
              <span class="kitten-stat">
                <b>Mood: </b>
                <span id="mood-${kitten.id}">${kitten.mood}</span>
              </span>
              </br>
              <span class="kitten-stat">
                <b>Love: </b>
                <span id="love-${kitten.id}">${kitten.love}</span>
              </span>
            </div>
            <div class="kitten-buttons mt-1">
              <button class="danger" onclick="pet('${kitten.id}')">Pet</button>
              <button onclick="catnip('${kitten.id}')">Catnip</button>
            </div>
          </div>
        </div>
      `

  })

  document.getElementById("kittens").innerHTML = template;
  console.log(kittens)

}

/**
 * Find the kitten in the array by its id
 * @param {string} id
 * @return {Kitten}
 */
function findKittenById(id) {
  // I wanted to learn how this worked rather have you do it for me
  return kittens.find(function (k) {
    return k.id == id;
  })
  // console.log(kittens.find(k => k.id == id))
}

/**
 * Find the kitten in the array of kittens
 * Generate a random Number
 * if the number is greater than .7
 * increase the kittens affection
 * otherwise decrease the affection
 * save the kittens
 * @param {string} id
 */
function pet(id) {
  let kitten = findKittenById(id)

  if (Math.random() < loveDirection) {
    kitten.love++
    playSound("happy")
  } else {
    kitten.love--
    playSound("mad")
  }

  if (kitten.love < 4) {
    loveDirection = .35
  } else if (kitten.love == 4) {
    loveDirection = .4
  } else if (kitten.love == 5) {
    loveDirection = .5
  } else if (kitten.love == 6) {
    loveDirection = .6
  } else {
    loveDirection = .65
  }

  document.getElementById("love-" + id).innerHTML = (kitten.love).toString()
  setKittenMood(kitten)

  console.log(kitten)
  console.log("chance of positive response: " + Math.floor(loveDirection * 100) + "%")
}

function playSound(mood) {

  var chance = Math.floor(Math.random() * Math.round(3)) + 1;

  //@ts-ignore
  document.getElementById(mood + chance).play()

}

/**
 * Find the kitten in the array of kittens
 * Set the kitten's mood to tolerant
 * Set the kitten's affection to 5
 * save the kittens
 * @param {string} id
 */
function catnip(id) {
  let kitten = findKittenById(id)
  kitten.love = 5
  loveDirection = .5
  document.getElementById("love-" + id).innerHTML = "5"
  setKittenMood(kitten)
  playSound("happy")
  console.log("chance of positive response: " + loveDirection * 100 + "%")
}

/**
 * Sets the kittens mood based on its affection
 * Happy > 6, Tolerant <= 5, Angry <= 3, Gone <= 0
 * @param {Kitten} kitten
 */
function setKittenMood(kitten) {
  if (kitten.love > 5) {
    kitten.mood = "happy"
  } else if (kitten.love > 3) {
    kitten.mood = "tolerant"
  } else if (kitten.love > 0) {
    kitten.mood = "angry"
  } else {
    kitten.mood = "gone"
  }

  document.getElementById("mood-" + kitten.id).innerHTML = (kitten.mood).toString()
  document.getElementById("kitten-" + kitten.id).className = "kitten " + (kitten.mood).toString()
  saveKittens()
}

function getStarted() {
  document.getElementById("welcome").remove();
  loadKittens()
  drawKittens();
}

/**
 * Defines the Properties of a Kitten
 * @typedef {{id: string, name: string, mood: string, love: number}} Kitten
 */

/**
 * Used to generate a random string id for mocked
 * database generated Id
 * @returns {string}
 */
function generateId() {
  return (
    Math.floor(Math.random() * 10000000) +
    "-" +
    Math.floor(Math.random() * 10000000)
  );
}

function deleteKittens() {
  window.localStorage.removeItem("kittens")
  window.localStorage.removeItem("usedNames")
  getStarted()
}

if (window.localStorage.getItem("kittens")) {
  document.getElementById("reset-game").classList.remove("hidden")
}