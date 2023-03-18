import { WORDS } from "./words.js"
import { GUESSES } from "./guesses.js"

let guessesRemaining = 6;
let currentGuess = [];
let nextLetter = 0;

//localStorage.initTracking = ""
//localStorage.word = ""

let date = new Date().getDate()
let month = new Date().getMonth()
let rightGuessString = WORDS[(date * 99 + month * 9999 + 1000) % WORDS.length]

if (localStorage.word == rightGuessString) {
  for (let i = 0; i < localStorage.guesses.length; i++){
    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    switch (localStorage.guesses[i]) {
      case '1': //green tile
        box.classList.add("green")
        nextLetter++
        break
      case '2': //yellow tile
        box.classList.add("yellow")
        nextLetter++
        break
      case '3': //red tile
        box.classList.add("red")
        nextLetter++
        break
      case '4': //green dot
        row.children[5].classList.add("correct")
        nextLetter = 0
        end()
        break
      case '5': //red dot
        row.children[5].classList.add("wrong")
        guessesRemaining--
        nextLetter = 0
        break
      case '0': //no dot
        guessesRemaining--
        nextLetter = 0
        break
      default: //letter
        box.textContent = localStorage.guesses[i]
    }
  }
  if (guessesRemaining == 0) {
    end(1)
  }
} else {
  localStorage.word = rightGuessString
  localStorage.guesses = ""
}
update()

if (!localStorage.initTracking) {
  localStorage.initTracking = "1"
  localStorage.first = "0"
  localStorage.second = "0"
  localStorage.third = "0"
  localStorage.fourth = "0"
  localStorage.fifth = "0"
  localStorage.sixth = "0"
  localStorage.streak = "0"
  localStorage.losses = "0"
}

function end(lose) {
  if (lose) {
    document.getElementById("win").children[0].textContent = "You've lost!"
  } else {
    guessesRemaining = -1
  }
  document.getElementById("win").children[1].textContent = "The word was " + rightGuessString + "."
  document.getElementById("win").style.display = "block"
  document.getElementById("end").style.display = "block"
  document.getElementById("instructions").style.display = "none"
  document.getElementById("ui").style.display = "block"
  update()
}

function update() {
  let first = Number(localStorage.first)
  let second = Number(localStorage.second)
  let third = Number(localStorage.third)
  let fourth = Number(localStorage.fourth)
  let fifth = Number(localStorage.fifth)
  let sixth = Number(localStorage.sixth)
  let streak = Number(localStorage.streak)
  let losses = Number(localStorage.losses)
  
  let dist = document.getElementById("distribution")
  let stats = document.getElementById("stats")
  let wins = (first + second + third + fourth + fifth + sixth)
  let guesses = first + second * 2 + third * 3 + fourth * 4 + fifth * 5 + sixth * 6
  
  dist.children[1].textContent = "1: " + first
  dist.children[2].textContent = "2: " + second
  dist.children[3].textContent = "3: " + third
  dist.children[4].textContent = "4: " + fourth
  dist.children[5].textContent = "5: " + fifth
  dist.children[6].textContent = "6: " + sixth
  
  stats.children[1].textContent = "Plays: " + (wins + losses)
  stats.children[2].textContent = "Wins: " + wins
  stats.children[3].textContent = "Losses: " + losses
  stats.children[4].textContent = "Win streak: " + streak
  stats.children[5].textContent = "Win rate: " + Math.round(wins / (wins + losses) * 1000) / 10 + "%"
  if (wins) {
    stats.children[6].textContent = "Guesses / win: " + Math.round(guesses / wins * 10) / 10
  } else {
    stats.children[6].textContent = "Guesses / win: 0"
  }

  setInterval(function () {
    let second = twoDigit(60 - new Date().getSeconds())
    let minute = twoDigit(60 - new Date().getMinutes() - (new Date().getSeconds() > 0))
    let hour = twoDigit(24 - new Date().getHours() - (new Date().getMinutes() > 0))
    document.getElementById("countdown").innerHTML = "Next Attractle in: " + hour + ":" + minute + ":" + second
  }, 1000)
}

function twoDigit(n) {
  if (n == 60) {
    return "00"
  }
  if (n < 10) {
    return '0' + n
  }
  return n
}

document.getElementById("copy").onclick = function() {
  let result = "Daily Attractle " + twoDigit(date) + "/" + twoDigit(month + 1) + "\n\n"
  for (let i = 0; i < localStorage.guesses.length; i++) {
    switch (localStorage.guesses[i]) {
      case '1':
        result += "🟩"
        break
      case '2':
        result += "🟨"
        break
      case '3':
        result += "🔴"
        break
      case '4':
        result += " 🟢\n"
        break
      case '5':
        result += " 🔴\n"
        break
      case '0':
        result += "\n"
    }
  }
  result += "\nPlay here: https://attractle.m1miketro.repl.co/"
  navigator.clipboard.writeText(result)
}

document.addEventListener('click', function(e) {
  if (e.target == document.getElementById('ui') || e.target.className == "close") {
    document.getElementById('ui').style.display = "none"
  }
  if (e.target == document.getElementById('info')) {
    document.getElementById('instructions').style.display = "block"
    document.getElementById('end').style.display = "none"
    document.getElementById('ui').style.display = "block"
  }
  if (e.target == document.getElementById('stat')) {
    document.getElementById('instructions').style.display = "none"
    document.getElementById('end').style.display = "block"
    document.getElementById('ui').style.display = "block"
  }
})

function deleteLetter() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
  let box = row.children[nextLetter - 1]
  box.textContent = ""
  box.classList.remove("filled-box")
  currentGuess.pop()
  nextLetter -= 1
}

function checkGuess() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
  let guessString = ''
  let rightGuess = Array.from(rightGuessString)
  let count = 0

  for (const val of currentGuess) {
    guessString += val
  }

  if (guessString.length != 5 || !GUESSES.includes(guessString)) {
    for (let i = 0; i < 5; i++) {
      animateCSS(row.children[i], "headShake")
    }
    return
  }

  for (let i = 0; i < 5; i++) {
    let box = row.children[i]
    let guessPos = currentGuess[i].charCodeAt(0)
    let ansPos = rightGuess[i].charCodeAt(0)
    let color = ""
    
    if (ansPos > guessPos + 3 || ansPos < guessPos - 3) {
      color = "red"
    } else if (ansPos > guessPos + 1 || ansPos < guessPos - 1) {
      color = "yellow"
    } else {
      color = "green"
      count++
    }
    let delay = 150 * i
    setTimeout(() => {
    	animateCSS(box, "bounce")
      box.classList.add(color)
    }, delay)
    localStorage.guesses += currentGuess[i]
    switch (color) {
      case "green":
        localStorage.guesses += "1"
        break
      case "yellow":
        localStorage.guesses += "2"
        break
      case "red":
        localStorage.guesses += "3"
        break
    }
  }
  
  if (count == 5) {
    if (guessString == rightGuessString) {
      switch (guessesRemaining) {
        case 6:
          localStorage.first = Number(localStorage.first) + 1
          break
        case 5:
          localStorage.second = Number(localStorage.second) + 1
          break
        case 4:
          localStorage.third = Number(localStorage.third) + 1
          break
        case 3:
          localStorage.fourth = Number(localStorage.fourth) + 1
          break
        case 2:
          localStorage.fifth = Number(localStorage.fifth) + 1
          break
        case 1:
          localStorage.sixth = Number(localStorage.sixth) + 1
          break
      }
      guessesRemaining = 0
      localStorage.streak = Number(localStorage.streak) + 1
      setTimeout(function() {
        row.children[5].classList.add("correct")
        localStorage.guesses += "4"
        end()
      }, 800)
      return
    } else {
      guessesRemaining -= 1
      currentGuess = []
      nextLetter = 0
      setTimeout(function() {
        row.children[5].classList.add("wrong")
        localStorage.guesses += "5"
      }, 800)
    }
  } else {
    guessesRemaining -= 1
    currentGuess = []
    nextLetter = 0
    setTimeout(function() {
      localStorage.guesses += "0"
    }, 800)
  }

  if (guessesRemaining == 0) {
    localStorage.losses = Number(localStorage.losses) + 1
    localStorage.streak = 0
    setTimeout(function() {
      end(1)
    }, 800)
  }
}

function insertLetter(pressedKey) {
  if (nextLetter === 5) {
    return
  }
  pressedKey = pressedKey.toLowerCase()

  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
  let box = row.children[nextLetter]
  animateCSS(box, "pulse")
  box.textContent = pressedKey
  box.classList.add("filled-box")
  currentGuess.push(pressedKey)
  nextLetter += 1
}

document.addEventListener("keyup", (e) => {

  if (guessesRemaining === 0) {
    return
  }

  let pressedKey = String(e.key)
  if (pressedKey === "Backspace" && nextLetter !== 0) {
    deleteLetter()
    return
  }

  if (pressedKey === "Enter") {
    checkGuess()
    return
  }

  let found = pressedKey.match(/[a-z]/gi)
  if (!found || found.length > 1) {
    return
  } else {
    insertLetter(pressedKey)
  }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});