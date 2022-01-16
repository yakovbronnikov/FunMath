if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => navigator.serviceWorker.ready.then((worker) => {
      worker.sync.register('syncdata');
    }))
    .catch((err) => console.log(err));
};


// Audio settings

function audioActions(audio, action){
  if(action == 'play') {
    audio.play()
  } else if(action == 'pause') {
    audio.pause()
  } else if(action == 'load') {
    audio.load()
    audio.play()
  }
}

let pause = document.getElementById('pause')
let gameDialog = document.getElementById('my_dialog')
let myResult = 0
let scoreCount = document.getElementById('score_count')
let taskCount = document.getElementById('task_count')
let dialogTime = document.getElementById('dialog_time')
let userRecord = document.getElementById('user_record')

let mainAudio = document.getElementById('level_main')
let dialogAudio = document.getElementById('dialog_audio')
let numpadAudio = document.getElementById('numpad_audio')
let clearAudio = document.getElementById('clear_audio')
let errorAudio = document.getElementById('error_audio')
let successAudio = document.getElementById('success_audio')
let endAudio = document.getElementById('end_audio')

let levelFrom = 0
let levelTo = 0

mainAudio.volume = .1
dialogAudio.volume = .2
numpadAudio.volume = .2
clearAudio.volume = .2
errorAudio.volume = .15
successAudio.volume = .2
endAudio.volume = .2

function levelChoice(from, to) {
  levelFrom = from
  levelTo = to
  return levelFrom, levelTo
}

function storageRecordCheck() {
  if(Number(window.localStorage.getItem('userRecordStorage')) == 0){
    return userRecord.innerText
  } else {
    userRecord.innerText = window.localStorage.getItem('userRecordStorage')
    return userRecord.innerText
  }
}


function recordCheck() {
  let userRecordString = storageRecordCheck()
  let scoreCountString = scoreCount.innerText
  let usesrRating = document.getElementById('rating')
  if(Number(userRecordString) < Number(scoreCountString)) {
    userRecord.innerText = scoreCountString
    usesrRating.innerText = '🔥🔥🔥'
    window.localStorage.setItem('userRecordStorage', scoreCountString);
  } else {
    usesrRating.innerText = '👍👍👍'
  }
}




function pauseState() {
  if(gameDialog.open == false){
    audioActions(dialogAudio, 'play')
    pause.checked = false
    gameDialog.showModal()
    audioActions(mainAudio, 'pause')
  }
}


let myTimer = setInterval(
  function myTimerFunc(){
    let timeValue = Number(document.getElementById('time_count').innerText)
    if(timeValue > 0 && pause.checked == true){
      document.getElementById('time_count').innerText = timeValue - 1
    } else {
      if(timeValue == 0 && pause.checked == true){
        recordCheck()
        audioActions(endAudio, 'play')
        dialogAction('end')
        pauseState()
      } else if(timeValue > 0 && timeValue < 60){
        dialogAction('pause')
      }
    }
  },
  1000
)

window.addEventListener('blur', function(){
  pauseState()
})



function continueGame(){
  audioActions(dialogAudio, 'play')
  pause.checked = true
  gameDialog.close()
  audioActions(mainAudio, 'play')
}

function restartGame(){
  continueGame()
  solutionClear()
  taskRandom()
  document.getElementById('time_count').innerText = 60
  scoreCount.innerText = 0
  taskCount.innerText = 0
  audioActions(mainAudio, 'load')
}


function dialogAction(action){
  let dialogPause = document.getElementById('dialog_pause')
  let dialogEnd = document.getElementById('dialog_end')
  let dialogStart = document.getElementById('dialog_start')
  if (action == 'start'){
    dialogPause.style.display = 'none'
    dialogEnd.style.display = 'none'
    dialogStart.style.display = ''
  } else if(action == 'pause'){
    dialogPause.style.display = ''
    dialogEnd.style.display = 'none'
    dialogStart.style.display = 'none'
  } else if(action == 'end'){
    dialogPause.style.display = 'none'
    dialogEnd.style.display = ''
    dialogStart.style.display = 'none'
  }
}

// Numpad settings

let numpadKeys = document.querySelectorAll('.numpad_key')

for (let i = 0; i < numpadKeys.length; i++) {
  let key = numpadKeys[i];
  key.addEventListener('mousedown', numpadKeyPress);
  key.addEventListener('mouseup', numpadKeyUp);
}

function numpadKeyPress(event) {this.classList.add('numpad_key_pressed')}
function numpadKeyUp(event) {this.classList.remove('numpad_key_pressed')}

function numpadKeyClick(number){
  let input = document.getElementById('solution')
  if (number != 10){
    numpadAudio.src = "audio/numpad_audio_"+randomNumber(1, 4)+".mp3"
    audioActions(numpadAudio, 'play')
    input.value += String(number)
  } else {
    audioActions(clearAudio, 'play')
    solutionClear()
  }
}


document.addEventListener('keydown', keyPress)

function keyPress(event) {
  let key = event.key
  if (key >= '0' && key <= '9'){
    numpadKeyClick(key)
  } else if(key == 'Backspace'){
    solutionClear()
  } else if(key == 'Enter'){
    resultCheck()
  } else if(key == 'Escape' && pause.checked == false){
    continueGame()
  }
}


// Task create


function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



function levelMath(x, y , z , operator, operator2) {
  let task = ''
  if(operator2 < '') {
    task = x + operator + y
  } else {
    task = x + operator + y + operator2 + z
  }
  let result = eval(task)
  document.getElementById('task').value = task
  return result
}


function taskRandom(){
  const operators = [' + ',' - ',' * ',' / ', 'complex']
  let operator = operators[randomNumber(levelFrom, levelTo)]
  let x = ''
  let y = ''
  let z = ''
  let operator2 = ''
  if (operator == ' + ') {
    x = randomNumber(2, 100)
    y = randomNumber(2, 100)
  } else if (operator == ' - ') {
    x = randomNumber(2, 100)
    y = randomNumber(2, x)
  } else if (operator == ' * ') {
    x = randomNumber(2, 30)
    y = randomNumber(2, 10)
  } else if (operator == ' / '){
    x = randomNumber(2, 30)
    y = randomNumber(2, 10)
    x = x * y
  } else {
    operator = operators[randomNumber(0, 1)]
    operator2 = operators[randomNumber(0, 2)]
    x = randomNumber(10, 60)
    y = randomNumber(2, 10)
    z = randomNumber(2, 6)
  }
  myResult = levelMath(x,y,z,operator, operator2)
  return myResult
}


// Checking result

function resultCheck() {
  let userResult = document.getElementById('solution').value
  let container = document.getElementById('level_container')
  taskCount.innerText = Number(taskCount.innerText) + 1
  setTimeout(() => {container.classList.remove('level_failure_animation')}, 300)
  if (userResult == myResult) {
    audioActions(successAudio, 'play')
    scoreCount.innerText = Number(scoreCount.innerText)  + 1
    taskRandom()
    solutionClear()
    addReaction('👍')
  } else {
    audioActions(errorAudio, 'play')
    container.classList.add('level_failure_animation')
    taskRandom()
    solutionClear()
    addReaction('🥴')
  }
}

function solutionClear() {
  document.getElementById('solution').type = 'number'
  document.getElementById('solution').value = ''
}



// Reactions!!!


function resultReaction(reaction){
  reaction.style.transform =
    "translateY(-"+ String(randomNumber(40, 300)) +"px)" +
    "scale(" + String(randomNumber(1, 3)) + "." + String(randomNumber(1, 100)) +")"
  reaction.style.opacity = "1"
  setTimeout(() => {
    reaction.style.opacity = "0"
  }, 400)
  setTimeout(() => {
    reaction.style.transform = "none"
  }, 900)
}

function addReaction(emoji){
  let reactions = document.querySelectorAll(".reaction")
  for (let i = 0; i < reactions.length; i++) {
    const reaction = reactions[i]
    reaction.innerText = emoji
    resultReaction(reaction)
  }
}



// Call basic functions

dialogAction('start')
pauseState()
