$(document).ready(function(){
  var gameKey;
  var phrase;
  var remainingGuesses;
  var state;
  
  startGame()
  $('#alphabet li').click(guess)

})

function startGame(){
  resetCanvas();
  var request = $.ajax({
    type:'POST',
    url: 'http://hangman.coursera.org/hangman/game',
    data: JSON.stringify({'email': 'galenscook@gmail.com'})
  })
  request.done(function(response){
    parseGameObject(response);
    updateGameboard(phrase, remainingGuesses)
  })
}

function parseGameObject(APIresponse){
  response = JSON.parse(APIresponse)
  gameKey = response['game_key']
  phrase = response['phrase']
  state = response['state']
  remainingGuesses = response['num_tries_left']
}

function updateGameboard(phrase, remainingGuesses){
  setTarget(phrase);
  updateGuesses(remainingGuesses);
}

function setTarget(phrase){
  var formattedPhrase = phrase.split('')
  formattedPhrase = formattedPhrase.map(function(character){
    if(character === ' '){
      character = '&nbsp;'
    }
    return character
  }).join(' ')
  $('#target').html(formattedPhrase);
}

function updateGuesses(remainingGuesses){
  if(state !== 'alive'){
    gameOver()
  } else {
  $('#lives span').html(remainingGuesses);
  }
}

function guess(event){
  if ($(this).attr('class') === 'clicked'){
    return
  }
  $(this).addClass('clicked')
  var letter = $(this)[0].innerText
  var request = $.ajax({
    url: 'http://hangman.coursera.org/hangman/game/'+gameKey,
    type: 'POST',
    data: JSON.stringify({'guess': letter})
  })
  request.done(function(response){
    parseGameObject(response);
    updateGameboard(phrase, remainingGuesses)
    updateHangman()
  })
}

function gameOver(){
  var response = window.confirm("Womp, womp.  You lost.  Would you like to play again?")
  if(response === true){
    $('#alphabet li').removeClass('clicked');
    startGame();
  }
}

// Canvas

function updateHangman(){
  if (remainingGuesses === '5'){
    return
  }
  var order = [leftLeg, rightArm, leftArm,  torso,  head]
  order[parseInt(remainingGuesses)]()
}

function draw($pathFromx, $pathFromy, $pathTox, $pathToy) {
    var canvas = document.getElementById("figure");
    var context = canvas.getContext("2d");
    context.beginPath();
    context.moveTo($pathFromx, $pathFromy);
    context.lineTo($pathTox, $pathToy);
    context.stroke(); 
}

function gallow() {
  draw(0, 140, 150, 140);
  draw (20, 10, 20, 140);
  draw (20, 10, 80, 10);
  draw (80, 10, 80, 20);
}


function head(){
  var canvas = document.getElementById("figure");
  var context = canvas.getContext("2d");
  context.beginPath();
  context.arc(80, 32, 14, 0, Math.PI*2, true);
  context.stroke();
}

function torso(){
  draw(80, 44, 80, 90)
}

function rightArm(){
  draw (80, 50, 110, 60);
}

function leftArm(){
  draw (80, 50, 50, 60);
}

function rightLeg(){
  draw (80, 90, 100, 120);
}

function leftLeg(){
  draw (80, 90, 60, 120);
}

function resetCanvas(){
  var canvas = document.getElementById("figure");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  gallow();
}
