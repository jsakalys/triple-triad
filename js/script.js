$(document).ready(function() {

//\\ VARIABLES //\\

// Make an array of spaces for the gameboard
var gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// Make var for player one and player two
var player1 = { 
	'name': 'Player 1',
	'deck': cardDeck.slice(),
	'hand': []
};

var player2 = {
	'name': 'Player 2',
	'deck': cardDeck.slice(),
	'hand': []
};

// Make var for current player
var currentPlayer = null;

// Make var for turn number
var turnCount = 0;

// Make var for cards played
var cardsPlayed = 0;

// Make var for p1 points and p2 points
// Each player starts with 5 points
var p1Points = 5;
var p2Points = 5;

// Prompt players for name and store in variable
//var player1.name = prompt('What is your name?');
//var player2.name = prompt('What is your name?');

//\\ FUNCTIONS //\\

// These functions will come in handy
function isEven(value) {
    if (value % 2 == 0) {
       	return true;
    } else {
        return false;
	};
};

function isOdd(value) {
	if (value % 1 == 0) {
		return true;
	} else {
		return false;
	};
};

// Update document to reflect player names
var updateNames = function() {
	$('#p1-name').html(player1.name);
	$('#p2-name').html(player2.name);
};

// Determine who goes first
var determineFirstPlayer = function() {
	var coinToss = Math.random();
	if (coinToss > .5) {
		evenPlayer = player1;
		oddPlayer = player2;
	} else {
		evenPlayer = player2;
		oddPlayer = player1;
	};
	console.log(evenPlayer.name + ' goes first.');
};

// Print points to bottom of hand div
var printPoints = function() {
	$('#p1-points').html(p1Points);
	$('#p2-points').html(p2Points);
};

// Update div to show turn
var displayTurn = function() {
	if (turnCount % 2 == 0) {
		currentPlayer = evenPlayer;
		$('#turn-count').html(evenPlayer.name + "'s Turn");
	} else {
		currentPlayer = oddPlayer;
		$('#turn-count').html(oddPlayer.name + "'s Turn");
	};
};

// Deal function draws 5 cards from the deck at random for each player, and pushes them to player's hand array
var dealHand = function(player) {
	player.hand = []; // empty current hand
	player.deck = cardDeck.slice(); // replenish deck
	for (var i = 0; i < 5; i++) {
		var randomIndex = Math.floor((Math.random() * player.deck.length));
		player.hand.push(player.deck[randomIndex]);
		player.deck.splice(randomIndex, 1);
	};
	console.log('Player hand: ' + player.hand);
};

// Print player's hand array objects to divs in UI
var printCards = function() {
	// for player 1
	player1.hand.forEach(function(card, index) {
		$('#p1-hand').append('<div class="card p1" id="' + index + '">' + card.name + '</div>');
	});
	// for player 2
	player2.hand.forEach(function(card, index) {
		$('#p2-hand').append('<div class="card p2" id="' + index + '">' + card.name + '</div>');
	});
};

// Make cards draggable
var makeDraggable = function() {
	$('.card').draggable({
		containment: '#main',
		revert: 'invalid',
		snap: ".space",
		snapMode: "inner",
		snapTolerance: 65
	});
};

// Restrict movement of non-designated player
var restrictPlayer = function() {
	if (currentPlayer == player1) {
		$('#p1-hand .p1').draggable("enable");
		$('#p2-hand .p2').draggable("disable");
	} else if (currentPlayer == player2) {
		$('#p2-hand .p2').draggable("enable");
		$('#p1-hand .p1').draggable("disable");
	};
};

// Inside gameboard div, map a div for each space with unique id
var makeSpaces = function() {
	for (var i = 0; i < gameBoard.length; i++) {
	$('#game-board').append('<div class="space" id="' + i + '">' + i + '</div>')
	};
};

// Make spaces droppable
var makeDroppable = function() {
	$('.space').droppable({
		accept: ".card",
		hoverClass: "space-hover",
		tolerance: "intersect",
		// When a card is dropped, move card object into gameboard array at appropriate index
		drop: function(event, ui) {
			var cardID = ui.draggable.attr('id');
			var spaceID = $(this).attr('id');
			// Set card object to game array index
			if (currentPlayer == player1) {
				gameBoard[spaceID] = player1.hand[cardID];
			} else if (currentPlayer == player2) {
				gameBoard[spaceID] = player2.hand[cardID];
			};
			// Make draggable undraggable and space undroppable
			$(this).droppable("disable");
			ui.draggable.draggable("disable");
			console.log('Gameboard: ' + gameBoard);
			turnCount++;
			displayTurn();
			restrictPlayer();
			// After all cards have been played, determine Winner
			if (turnCount == gameBoard.length) {
				console.log('The game is over.')
				// clear turn indicator
				$('#turn-count').html('');
				// check points to determine winner and alert winner
			};
		} // ! do not put semicolon here, because jquery
	});
};

//\\ UI STUFF //\\

// Make button for deal and relevant functions
$('#deal-button').on('click', function(){
	$('.card').remove();
	updateNames();
	dealHand(player1);
	dealHand(player2);
	printPoints();
	printCards();
	makeDraggable();
	makeSpaces();
	makeDroppable();
	determineFirstPlayer();
	displayTurn();
	restrictPlayer();
});

// Make button for clear board and relevant functions
$('#clear-button').on('click', function(){
	$('.card').remove();
	$('#game-board').html('');
});


}); // End document ready function

