// Timer and raund settings
let pause = document.getElementById('pause')
let gameDialog = document.getElementById('my_dialog')
let myResult = 0
let scoreCount = document.getElementById('score_count')
let taskCount = document.getElementById('task_count')


function pauseState() {
  if(gameDialog.open == false){
    pause.checked = false
    gameDialog.showModal()
  }
}


let myTimer = setInterval(
  function myTimerFunc(){
    let timeValue = Number(document.getElementById('time_count').innerText)
    let dialogTime = document.getElementById('dialog_time')
    dialogTime.innerText = timeValue
    if(timeValue > 0 && pause.checked == true){
      document.getElementById('time_count').innerText = timeValue - 1
    } else {
      let dialogTitle = document.getElementById('dialog_title')
      let continueButton = document.getElementById('continue_button')
      if(timeValue == 0 && pause.checked == true){
        dialogTitle.innerText = "Time's up!"
        continueButton.style.display = 'none'
        dialogTime.parentElement.style.display = 'none'
        resultCheck()
        pauseState()
      } else if(timeValue > 0){
        dialogTitle.innerText = 'Game paused...'
        continueButton.style.display = ''
        dialogTime.parentElement.style.display = ''
      }
    }
  },
  1000
)


function continueGame(){
  pause.checked = true
  gameDialog.close()
}

function restartGame(){
  continueGame()
  solutionClear()
  taskRandom()
  document.getElementById('time_count').innerText = 60
  scoreCount.innerText = 0
  taskCount.innerText = 0
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
  if (number != 'C'){
    input.value += String(number)
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



function levelMath(x,y,operator) {
  const task = x + operator + y
  let result = eval(task)
  document.getElementById('task').value = task
  return result
}


function taskRandom(){
  const operators = [' + ',' - ',' * ',' / ']
  let operator = operators[randomNumber(0,3)]
  let x = ''
  let y = ''
  if (operator == ' + ') {
    x = randomNumber(1, 100)
    y = randomNumber(1, 100)
  } else if (operator == ' - ') {
    x = randomNumber(1, 100)
    y = randomNumber(1, x)
  } else if (operator == ' * ') {
    x = randomNumber(1, 30)
    y = randomNumber(1, 10)
  } else {
    x = randomNumber(1, 10)
    y = randomNumber(1, 10)
    x = x * y
  }
  myResult = levelMath(x,y,operator)
  return myResult
}

taskRandom()


// Checking result

function resultCheck() {
  let userResult = document.getElementById('solution').value
  taskCount.innerText = Number(taskCount.innerText) + 1
  if (userResult == myResult) {
    scoreCount.innerText = Number(scoreCount.innerText)  + 1
    taskRandom()
    solutionClear()
    resultAnimation(true)
  } else {
    taskRandom()
    solutionClear()
    resultAnimation(false)
  }
}

function solutionClear() {
  document.getElementById('solution').type = 'number'
  document.getElementById('solution').value = ''
}

function resultAnimation(result) {
  let container = document.getElementById('level_container')
  if(result == true){
    container.classList.add('level_success_animation')
  } else {
    container.classList.add('level_failure_animation')
  }
  setTimeout(() => {
    container.classList.remove('level_success_animation')
    container.classList.remove('level_failure_animation')
  }, 1000)
}
