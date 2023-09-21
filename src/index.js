
document.addEventListener("DOMContentLoaded", () => {

//global variables
const dogBar = document.querySelector('#dog-bar');
const dogSummary = document.querySelector('#dog-summary-container')
const dogImg = document.createElement('img')
const dogName = document.createElement('h2')
const goodDogButton = document.createElement('button')
const filterButton = document.querySelector('#good-dog-filter')

// let goodDogStatus;
let currentDog;
let dogArray;

//function to add dogs to the dogbar
const appendDog = (dog) => {
  const dogSpan = document.createElement('span')
  dogSpan.innerText = dog.name
  currentDog = dog;

//event listener on clicking the dog
  dogSpan.addEventListener('click', () => {
  dogImg.src = dog.image
  dogName.innerText = dog.name
  goodDogButton.innerText = dog.isGoodDog

  //update for clicked dog
  currentDog = dog
  //run goodDogToggle function
  currentDog.isGoodDog ? (goodDogButton.innerText = "Good Dog!") : (goodDogButton.innerText = "Bad Dog!")
  })

  dogBar.appendChild(dogSpan)
  dogSummary.append(dogImg, dogName, goodDogButton)
}

//fetch dog info
const loadDogs = () => {
  fetch('http://localhost:3000/pups')
  .then(resp => resp.json())
  .then(dogObj => {
    dogArray = dogObj
    dogObj.forEach((dog) => appendDog(dog))})
  .catch(error => alert(error))
}

//test function
const goodDogToggle = () => {
  if (currentDog.isGoodDog) {
  goodDogButton.innerText = "Bad Dog!"
  currentDog.isGoodDog = false
  }
  else {
    goodDogButton.innerText = "Good Dog!"
    currentDog.isGoodDog = true
  }
}

//event listener on clicking is Good Dog
const loadGoodDogStatus = () => {
  goodDogButton.addEventListener('click', () => {
    goodDogToggle(); //optimistic //when you run it before the patch, it is optimistic
    fetch(`http://localhost:3000/pups/${currentDog.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        isGoodDog: currentDog.isGoodDog
      })
    })
    .then(resp => resp.json())
    .then(data => { //run here for pessimistic
      console.log(data)
      console.log(dogArray)
    })
    .catch(error => alert(error))
  })
}

//function to clear the dog span
const clearBar = () => {
  let child = dogBar.lastElementChild
  while (child) {
    dogBar.removeChild(child)
    child = dogBar.lastElementChild
  }
}
//function to toggle display of dogs
const toggleDogDisplay = () => {
  let newArray = dogArray.filter((dog) => {
    return dog.isGoodDog === true})
    newArray.forEach((dog) => appendDog(dog))
  }


//function filtering dogs
const filterDogs = () => {
  filterButton.addEventListener('click', () => {
    if (filterButton.innerText === "Filter good dogs: OFF") {
      filterButton.innerText = "Filter good dogs: ON"
      clearBar()
      toggleDogDisplay();
    }
    else {
      filterButton.innerText = "Filter good dogs: OFF";
      clearBar();
      dogArray.forEach((dog) => appendDog(dog))
    }
  })
}

//call functions
loadDogs();
loadGoodDogStatus();
filterDogs();
})
