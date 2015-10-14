$(document).ready(function() {

//\\ VARIABLES //\\

// Make a temporary deck from which to draw
var cardDeck = masterDeck.map(function(card) {
	return card;
});

// Make an array of spaces for the gameboard
var gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// Make var for player one and player two
var player1 = { 
	'name': 'Player 1',
	'hand': [],
	'points': 5,
};

var player2 = {
	'name': 'Player 2',
	'hand': [],
	'points': 5,
};

// Make var for current player
var currentPlayer = null;

// Make var for inactive player
var inactivePlayer = null;

// Make var for turn number
var turnCount = 0;

// Prompt players for name and store in variable
// player1.name = prompt('What is your name?');
// player2.name = prompt('What is your name?');

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
var printNames = function() {
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
};

// Update div to show turn and set current player to even or odd player
var printTurn = function() {
	if (turnCount == 0) {
		currentPlayer = evenPlayer;
		inactivePlayer = oddPlayer;
		console.log(evenPlayer.name + " goes first.");
		$('#turn-count').html(evenPlayer.name + " goes first.");
	} else if (turnCount % 2 == 0) {
		currentPlayer = evenPlayer;
		inactivePlayer = oddPlayer;
		console.log(evenPlayer.name + "'s Turn");
		$('#turn-count').html(evenPlayer.name + "'s Turn");
	} else {
		currentPlayer = oddPlayer;
		inactivePlayer = evenPlayer;
		console.log(oddPlayer.name + "'s Turn");
		$('#turn-count').html(oddPlayer.name + "'s Turn");
	};
};

// Print points to bottom of hand div
var printPoints = function() {
	$('#p1-points').html(player1.points);
	$('#p2-points').html(player2.points);
};

// Deal function draws 5 cards from the deck at random for each player, and pushes them to player's hand array
var dealHand = function(player) {
	player.hand = []; // empty current hand
	for (var i = 0; i < 5; i++) {
		var randomIndex = Math.floor((Math.random() * cardDeck.length));
		player.hand.push(cardDeck.splice(randomIndex, 1)[0]);
	};
	console.log(player);
};

// Assign colors to each player's cards
var assignColor = function(player, color) {
	player.hand.forEach(function(card) {
		card["color"] = color;
	});
};

// Print player's hand array objects to divs in UI
var printCards = function() {
	// for player 1
	player1.hand.forEach(function(card, index) {
		$('#p1-hand').append('<div class="card draggable p1" data-name="' + card.name + '" id="' + index + '">' + card.name + '</div>');
	});
	// for player 2
	player2.hand.forEach(function(card, index) {
		$('#p2-hand').append('<div class="card draggable p2" data-name="' + card.name + '" id="' + index + '">' + card.name + '</div>');
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
		$('#p1-hand .draggable').draggable("enable");
		$('#p2-hand .draggable').draggable("disable");
	} else if (currentPlayer == player2) {
		$('#p2-hand .draggable').draggable("enable");
		$('#p1-hand .draggable').draggable("disable");
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
			// Make draggable undraggable and space undroppable
			$(this).droppable("destroy"); // revent this space from ever being droppable again
			ui.draggable.draggable("destroy"); // prevent this card from ever being draggable again
			ui.draggable.removeClass("draggable"); // remove draggable class, so to prevent jquery error when it attempts to re-enable
			
			// Set card object to game array index 
			var cardID = parseInt(ui.draggable.attr('id'));
			var spaceID = parseInt($(this).attr('id'));
			var currentCard = gameBoard[spaceID] = currentPlayer.hand[cardID];
			console.log(gameBoard);


			// compare card's top value to card above it's bottom value
			var adjacentCard = gameBoard[spaceID-3];
			if (spaceID > 2 && (typeof adjacentCard == 'object')) {
			 	if (currentCard.top > adjacentCard.bottom) {
					console.log(currentCard.top + ' has a higher rank than ' + adjacentCard.bottom);
					if (currentCard.color !== adjacentCard.color) {
					currentPlayer.points++;
					inactivePlayer.points--;
					};
					adjacentCard.color = currentCard.color;
					$('div [data-name="' + adjacentCard.name + '"]').css("background-color", adjacentCard.color);
				} else if (currentCard.top < adjacentCard.bottom) {
					console.log(currentCard.top + ' has a lower rank than ' + adjacentCard.bottom);
				} else { 
					console.log(currentCard.top + ' has the same rank as ' + adjacentCard.bottom);
				};
			};

			// compare card's bottom value to card below it's top value
			adjacentCard = gameBoard[spaceID+3];
			if (spaceID < 6  && (typeof adjacentCard == 'object')) {
				if (currentCard.bottom > adjacentCard.top) {
					console.log(currentCard.bottom + ' has a higher rank than ' + adjacentCard.top);
					if (currentCard.color !== adjacentCard.color) {
					currentPlayer.points++;
					inactivePlayer.points--;
					};
					adjacentCard.color = currentCard.color;
					$('div [data-name="' + adjacentCard.name + '"]').css("background-color", adjacentCard.color);
				} else if (currentCard.bottom < adjacentCard.top) {
					console.log(currentCard.bottom + ' has a lower rank than ' + adjacentCard.top);
				} else {
					console.log(currentCard.bottom + ' has the same rank as ' + adjacentCard.top);
				};
			};

			// compare card's right value to card after it's left value
			adjacentCard = gameBoard[spaceID+1];
			if (spaceID % 3 !== 2 && (typeof adjacentCard == 'object')) {
			 	if (currentCard.right > adjacentCard.left) {
					console.log(currentCard.right + ' has a higher rank than ' + adjacentCard.left);
					if (currentCard.color !== adjacentCard.color) {
					currentPlayer.points++;
					inactivePlayer.points--;
					};
					adjacentCard.color = currentCard.color;
					$('div [data-name="' + adjacentCard.name + '"]').css("background-color", adjacentCard.color);
				} else if (currentCard.right < adjacentCard.left) {
					console.log(currentCard.right + ' has a lower rank than ' + adjacentCard.left);
				};
			};

			// compare card's left value to card to the before it's right value
			adjacentCard = gameBoard[spaceID-1];
			if (spaceID % 3 !== 0 && (typeof adjacentCard == 'object')) {
			 	if (currentCard.left > adjacentCard.right) {
					console.log(currentCard.left + ' has a higher rank than ' + adjacentCard.right);
					if (currentCard.color !== adjacentCard.color) {
					currentPlayer.points++;
					inactivePlayer.points--;
					};
					adjacentCard.color = currentCard.color;
					$('div [data-name="' + adjacentCard.name + '"]').css("background-color", adjacentCard.color);
				} else if (currentCard.left < adjacentCard.right) {
					console.log(currentCard.left + ' has a lower rank than ' + adjacentCard.right);
				};
			};

			// Update turn and call related functions
			turnCount++;
			printTurn();
			printPoints();
			restrictPlayer();

			// After all cards have been played, determine Winner
			if (turnCount == gameBoard.length) {
				// clear turn indicator
				$('#turn-count').html('The game is over.');
				// check points to determine winner and alert winner
				if (player1.points > player2.points) {
					$('#extra').html(player1.name.toString() + ' wins.');
				} else if (player2.points > player1.points) {
					$('#extra').html(player2.name.toString() + ' wins.');
				} else {
					$('#extra').html('Draw.');
				};
			};
		} // ! do not put semicolon here, because jquery
	});
};

// Make a function to reset items at end of game
function reset() {
	cardDeck = masterDeck.map(function(card) {
	return card;
	}); // repopulate card deck
	$('.card').remove(); // take cards from previous game off the board
	gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // reset board array
	turnCount = 0; // reset turn count
	player1.points = 5; // reset points
	player2.points = 5;
};

//\\ UI STUFF //\\

// Make button for deal and to call relevant functions
$('#deal-button').on('click', function(){
	reset(); // reset all values to default
	dealHand(player1);
	dealHand(player2);
	assignColor(player1, "blue");
	assignColor(player2, "red");
	determineFirstPlayer();
	printTurn();
	printNames();
	printPoints();
	printCards();
	makeDraggable();
	makeSpaces();
	makeDroppable();
	restrictPlayer();
	$('.space').droppable("enable"); // fixes disable override from previous game (must come after makespaces)
});

// Make button for clear board and relevant functions
$('#clear-button').on('click', function(){
	$('.card').remove();
	$('#game-board').html('');
});

}); // End document ready function

