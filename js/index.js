var X = 'fa fa-times';
var O = 'fa fa-circle-o';
var cpuIcon;
var playerIcon;
var cpuMove;
var liveBoard = [1, -1, -1, -1, 1, 1, 1, -1, -1];
var winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function renderBoard(board) {
  board.forEach(function(el, i) {
    var cellId = '#' + i.toString();
    if (el === -1) {
      $(cellId).addClass(playerIcon);
    } else if (el === 1) {
      $(cellId).addClass(cpuIcon);
    }
  });
}

function chooseMarker() {
  $('.modal-container').fadeIn(800);

  $('button').click(function() {
    var marker = $(this).id;
    playerIcon = (marker = 'X' ? X : O);
    cpuIcon = (marker = 'X' ? O : X);
 $('.cell').removeClass('fa fa-times fa-circle-o');
    $('.modal-container').fadeOut(800);
    setTimeout(function() { 
      $('.choose-marker').css('display','none');
      startNewGame();
    }, 800);
    $('button').off();
  });
}

function endGameMessage(){
  var result = checkVictory(liveBoard);
  $('.game-over h3').text(result === 'win' ? 'You lost :(' : "It's a draw!");
  
  $('.modal-container').fadeIn(800);
  $('.game-over').css('display','block');
 
  $('button').click(function() {
    $('.cell').removeClass('fa fa-times fa-circle-o');
    $('.modal-container').fadeOut(800);
  
    setTimeout(function() {
      $('.game-over').css('display', 'none');
      startNewGame();
    }, 800);
   $('button').off();
  });
}

function startNewGame() {
  liveBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  $('.cell').removeClass('fa fa-times fa-circle-o');
  renderBoard(liveBoard);
  playerTurn();
}

function playerTurn() {
  $('.cell:not(.fa)').hover(function() {
    $(this).addClass(playerIcon).css('cursor', 'pointer');
  }, function() {
    $(this).removeClass(playerIcon);
  });

  $('.cell:not(.fa)').click(function() {
    $(this).addClass(playerIcon).css('cursor', 'default');
    liveBoard[parseInt($(this).attr('id'))] = -1;
    renderBoard(liveBoard);
    
    if (checkVictory(liveBoard)) {    
      setTimeout(endGameMessage,(checkVictory(liveBoard) === 'win') ? 700 : 100);
    } else {
      setTimeout(aiTurn, 100);
    }
    $('.cell').off();
  });
}

function aiTurn() {
  miniMax(liveBoard, 'aiPlayer');
  liveBoard[cpuMove] = 1;
  renderBoard(liveBoard);
  if (checkVictory(liveBoard)) {
    setTimeout(endGameMessage, checkVictory(liveBoard) === 'win' ? 700 : 100);
  } else {
    playerTurn();
  }
}

function checkVictory(board) {
  var cellsInPlay = board.reduce(function(prev, cur) {
    return Math.abs(prev) + Math.abs(cur);
  });

  var outcome = winningLines.map(function(winLines) {
    return winLines.map(function(winLine) {
      return board[winLine];
    }).reduce(function(prev, cur) {
      return prev + cur;
    });
  }).filter(function(winLineTotal) {
    return Math.abs(winLineTotal) === 3;
  });

  if (outcome[0] === 3) {
    return 'win';
  } else if (outcome[0] === -3) {
    return 'lose';
  } else if (cellsInPlay === 9) {
    return 'draw';
  } else {
    return false;
  }
}

function availableMoves(board) {
  return board.map(function(el, i) {
    if (!el) {
      return i;
    }
  }).filter(function(e) {
    return (typeof e !== "undefined");
  });
}

function miniMax(state, player) {
  
  switch(checkVictory(state)) {
    case 'win':
      return 10;
      break;
    case 'lose':
      return -10;
      break;
    case 'draw':
      return 0;
      break;
  }
  
  var moves = [];
  var scores = [];

  availableMoves(state).forEach(function(cell) {
    state[cell] = (player === 'aiPlayer') ? 1 : -1;
    scores.push(miniMax(state, (player === 'aiPlayer') ? 'opponent' : 'aiPlayer'));
    moves.push(cell);
    state[cell] = 0;
  });

  if (player === 'aiPlayer') {
    cpuMove = moves[scores.indexOf(Math.max.apply(Math, scores))];
    return Math.max.apply(Math, scores);
  } else {
    cpuMove = moves[scores.indexOf(Math.min.apply(Math, scores))];
    return Math.min.apply(Math, scores);
  }
}

renderBoard(liveBoard);
chooseMarker();