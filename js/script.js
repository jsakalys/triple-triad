//\\ GLOBAL VARIABLES //\\

// Make a temporary deck from which to draw
var cardDeck = masterDeck.map(function(card) {
	return card;
});

// Make an array of spaces for the gameboard
var gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// Make an object for player one and player two
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
var getNames = function() {
	swal({
		title: "Player 1",
		text: "Please enter your name:",
		type: "input",
		showCancelButton: true,
		closeOnConfirm: false,
		animation: "slide-from-top",
		inputPlaceholder: "Name"
	},
		function(inputValue) {
			if (inputValue === false) return false;
			if (inputValue === "") {
				swal.showInputError("You need to write something!");
				return false
			}
			player1.name = inputValue;

			// Player 2 name prompt
			swal({
				title: "Player 2",
				text: "Please enter your name:",
				type: "input",
				showCancelButton: true,
				closeOnConfirm: true,
				animation: "slide-from-top",
				inputPlaceholder: "Name"
			},
				function(inputValue){
					if (inputValue === false) return false;
					if (inputValue === "") {
						swal.showInputError("You need to write something!");
						return false
					}
					player2.name = inputValue;
					printNames();
			});
	});
};

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
	$('#p1-points').html('Points: ' + player1.points);
	$('#p2-points').html('Points: ' + player2.points);
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
		$('#p1-hand').append('<div class="card draggable p1" data-name="' + card.name + '" id="' + index + '"><div class="card-front">' + card.top + '<br>' + card.left + ' ' + card.right + '<br>' + card.bottom + '</div><div class="card-back">' + card.top + '<br>' + card.left + ' ' + card.right + '<br>' + card.bottom + '</div></div>');
	});
	// for player 2
	player2.hand.forEach(function(card, index) {
		$('#p2-hand').append('<div class="card draggable p2" data-name="' + card.name + '" id="' + index + '"><div class="card-front">' + card.top + '<br>' + card.left + ' ' + card.right + '<br>' + card.bottom + '</div><div class="card-back">' + card.top + '<br>' + card.left + ' ' + card.right + '<br>' + card.bottom + '</div></div>');
	});
};

// Display a chain animation when new card divs are dealt
var animateCards = function() {
	var dealDuration = 300;
	$('div.card:nth-child(5)').animate({ "top": "0px" }, {duration:dealDuration, complete: function() {
		$('div.card:nth-child(4)').animate({ "top": "0px" }, {duration:dealDuration, complete: function() {
			$('div.card:nth-child(3)').animate({ "top": "0px" }, {duration:dealDuration, complete: function() {
				$('div.card:nth-child(2)').animate({ "top": "0px" }, {duration:dealDuration, complete: function() {
					$('div.card:nth-child(1)').animate({ "top": "0px" }, {duration:dealDuration, complete: function() {
					}});
				}});
			}});
		}});
	}});
};

// Make cards draggable
var makeDraggable = function() {
	$('.card').draggable({
		containment: '#main',
		revert: 'invalid',
		snap: ".space",
		snapMode: "inner",
		snapTolerance: 65,
		zIndex: 100
	});
};

// Initialize jquery flippable for all card divs
var makeFlippable = function() {
	$(".card").flip({
  		axis: 'y',
  		trigger: 'manual'
	});
	$('div .p2').flip('toggle'); // flip player 2's cards over
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
	$('#game-board').append('<div class="space" id="' + i + '"></div>')
	};
};

// Make spaces droppable and execute check on drop
var makeDroppable = function() {
	$('.space').droppable({
		accept: ".card",
		tolerance: "intersect",
		// When a card is dropped, move card object into gameboard array at appropriate index
		drop: function(event, ui) {
			// Make draggable undraggable and space undroppable
			$(this).droppable("destroy"); // Prevent this space from ever being droppable again
			ui.draggable.draggable("destroy"); // Prevent this card from ever being draggable again
			ui.draggable.removeClass("draggable"); // remove draggable class, so to prevent jquery error when it attempts to re-enable
			
			// Set card object to game array index 
			var cardID = parseInt(ui.draggable.attr('id'));
			var spaceID = parseInt($(this).attr('id'));
			var currentCard = gameBoard[spaceID] = currentPlayer.hand[cardID];
			console.log(gameBoard);

			// Make a function to compare dropped card to adjacent card
			var compareCards = function(currentDirection, adjacentDirection) {
				if (currentCard[currentDirection] > adjacentCard[adjacentDirection]) {
					if (currentCard.color !== adjacentCard.color) {
						console.log(currentCard[currentDirection] + ' has a higher rank than ' + adjacentCard[adjacentDirection]);
						currentPlayer.points++;
						inactivePlayer.points--;
						adjacentCard.color = currentCard.color;
						$('div [data-name="' + adjacentCard.name.toString() + '"]').flip('toggle');
					};
				} else if (currentCard[currentDirection] < adjacentCard[adjacentDirection]) {
						console.log(currentCard[currentDirection] + ' has a lower rank than ' + adjacentCard[adjacentDirection]);
				} else { 
						console.log(currentCard[currentDirection] + ' has the same rank as ' + adjacentCard[adjacentDirection]);
				};
			};

			// Compare card's top value to card above it's bottom value
			var adjacentCard = gameBoard[spaceID-3];
			if (spaceID > 2 && (typeof adjacentCard == 'object')) {
				compareCards("top", "bottom");
			};

			// Compare card's bottom value to card below it's top value
			adjacentCard = gameBoard[spaceID+3];
			if (spaceID < 6  && (typeof adjacentCard == 'object')) {
				compareCards("bottom", "top")
			};

			// Compare card's right value to card after it's left value
			adjacentCard = gameBoard[spaceID+1];
			if (spaceID % 3 !== 2 && (typeof adjacentCard == 'object')) {
				compareCards("right", "left");
			};

			// Compare card's left value to card to the before it's right value
			adjacentCard = gameBoard[spaceID-1];
			if (spaceID % 3 !== 0 && (typeof adjacentCard == 'object')) {
				compareCards("left", "right");
			};

			// Update turn and call related functions
			turnCount++;
			updateInfo();
			restrictPlayer();

			// After all cards have been played, determine Winner
			if (turnCount == gameBoard.length) {
				// Clear turn indicator
				$('#turn-count').html('The game is over.');
				// Check points to determine winner and alert winner
				if (player1.points > player2.points) {
					$('#extra').html(player1.name.toString() + ' wins!');
				} else if (player2.points > player1.points) {
					$('#extra').html(player2.name.toString() + ' wins!');
				} else {
					$('#extra').html('Draw.');
				};
			};
		} // ! Do not put semicolon here, because jquery
	});
};

//\\ Putting it all together //\\

function resetGame() {
	// Repopulate card deck
	cardDeck = masterDeck.map(function(card) { return card }); 
	// Empty all containers of their elements
	$('#game-board').html('')
	$('#p1-hand').html(''); 
	$('#p2-hand').html('');
	$('#p1-points').html('');
	$('#p2-points').html('');
	$('#turn-count').html('');
	// Reset board array
	gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8]; 
	// Reset turn count
	turnCount = 0;
	// Reset points
	player1.points = 5; 
	player2.points = 5;
};

var dealNew = function() {
	dealHand(player1);
	dealHand(player2);
	assignColor(player1, "blue");
	assignColor(player2, "red");
};

var updateInfo = function() {
	printTurn();
	printPoints();
};

var initializeCards = function() {
	printCards();
	animateCards();
	makeDraggable();
	makeFlippable();
};

var initializeSpaces = function() {
	makeSpaces();
	makeDroppable();
};

$(document).ready(function() {

	//\\ UI STUFF //\\

	// Make button for deal and to call relevant functions
	$('#deal-button').on('click', function(){
		resetGame();
		dealNew();
		determineFirstPlayer();
		updateInfo();
		initializeCards();
		initializeSpaces();
		restrictPlayer();
		$('.space').droppable("enable"); // fixes disable override from previous game (must come after makespaces)
	});

	// Make button for clear board and relevant functions
	$('#clear-button').on('click', function(){
		resetGame();
	});

	// Make button to change player name
	$('#namechange-button').on('click', function() {
		getNames();
	});

	// How to button instructions popup
	$('#howto-button'). on('click', function() {
		swal("How to Play", "Each player is dealt five cards from the deck. Every card has four numbers in the top corner. These are called the card's 'rank', and represent the strength of the corresponding side of the card. To claim an opponent's card, the rank of your card must be higher than that of the adjacent card's rank. The player with the most cards at the end is the winner.")
	});

}); // End document ready function

