//$(document).ready(function() {

// These functions will come in handy
function isEven(value){
    if (value % 2 == 0) {
       	return true;
    } else {
        return false;
	};
};

function isOdd(value){
	if (value % 1 == 0) {
		return true;
	} else {
		return false;
	};
};

// Make array of card objects
var cardDeck = [
	{	name: 'Bite Bug',
		top: 1,
		right: 3,
		bottom: 3,
		left: 3
	},
	{	name: 'Blobra',
		top: 2,
		right: 3,
		bottom: 1,
		left: 5
	},
	{	name: 'Blood Soul',
		top: 2,
		right: 1,
		bottom: 6,
		left: 1
	},
	{	name: 'Caterchipillar',
		top: 4,
		right: 2,
		bottom: 4,
		left: 3
	},
	{	name: 'Cockatrice',
		top: 2,
		right: 1,
		bottom: 2,
		left: 6
	},
	{	name: 'Fastitocalon-F',
		top: 3,
		right: 5,
		bottom: 2,
		left: 6
	},
	{	name: 'Funguar',
		top: 5,
		right: 1,
		bottom: 1,
		left: 3
	},
	{	name: 'Gayla',
		top: 2,
		right: 1,
		bottom: 4,
		left: 4
	},
	{	name: 'Geezard',
		top: 1,
		right: 4,
		bottom: 1,
		left: 5
	},
	{	name: 'Gesper',
		top: 1,
		right: 5,
		bottom: 4,
		left: 1
	},
	{	name: 'Red Bat',
		top: 6,
		right: 1,
		bottom: 1,
		left: 2
	},
];

// Make an array of spaces
var spaces = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// Inside gameboard, map a div for each space
var makeSpaces = function() {
	for (var i = 0; i < spaces.length; i++) {
	$('#game-board').append('<div class="space">' + i + '</div>')
	};
};

// Make spaces droppable
var makeDroppable = function() {
	$('.space').droppable({
		accept: ".card",
		hoverClass: "space-hover",
		tolerance: "intersect",
	});
};

// make var for even and odd player
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

// prompt players for name and store in variable
// var evenPlayer.name = 'Player 1';
// var oddPlayer.name = 'Player 2';

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
};

// make var for turn number
var turnCount = 0;

// update div to show turn
var displayTurn = function() {
	if (turnCount % 2 == 0) {
		$('#turn-count').html(evenPlayer.name + "'s Turn");
	} else {
		$('#turn-count').html(oddPlayer.name + "'s Turn");
	};
};

// Deal function draws 5 cards at random per player, and push them to player's hand array
var dealHand = function(player) {
	player.deck = cardDeck.slice();
	player.hand = [];
	for (var i = 0; i < 5; i++) {
		var randomIndex = Math.floor((Math.random() * player.deck.length));
		player.hand.push(player.deck[randomIndex]);
		player.deck.splice(randomIndex, 1);
	};
};

// print player's hand array objects to divs in UI
var printCards = function() {
	// for player 1
	player1.hand.forEach(function(card) {
		$('#p1-hand').append('<div class="card p1">' + card.name + '</div>');
	});
	// for player 2
	player2.hand.forEach(function(card) {
		$('#p2-hand').append('<div class="card p2">' + card.name + '</div>');
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

// Make var for p1 points and p2 points
// each player starts with 5 points
var p1Points = 5;
var p2Points = 5;

// print points to bottom of hand
var printPoints = function() {
	$('#p1-points').html(p1Points);
	$('#p2-points').html(p2Points);
};

// Make var for cards played
var cardsPlayed = 0;

// WHen card is dropped update board array space to store card object data
// increment cards played by 1 (cardsPlayed++)
// change player turn (turnCount++)
// run a win check similar to tic tac toe

// Make button for deal, clear board

$('#deal-button').on('click', function(){
	$('.card').remove();
	updateNames();
	makeSpaces();
	makeDroppable();
	dealHand(player1);
	dealHand(player2);
	printPoints();
	printCards();
	makeDraggable();
	determineFirstPlayer();
	displayTurn();
});

$('#clear-button').on('click', function(){
	$('.card').remove();
	$('#game-board').html('')
})

// restrict movement of non-designated player
var restrictPlayer = function() {
	// player 1
	if (player1 == evenPlayer && isEven(turnCount)) {
		$('.p1').draggable("enable");
		$('.p2').draggable("disable");
	} else if (player1 == oddPlayer && isOdd(turnCount)) {
		$('.p1').draggable("enable");
		$('.p2').draggable("disable");
	} else if (player1 == evenPlayer && isOdd(turnCount)) {
		$('.p1').draggable("disable");
	} else if (player1 == oddPlayer && isEven(turnCount)) {
		$('.p1').draggable("disable");
	};
};

//}); // end document ready function

