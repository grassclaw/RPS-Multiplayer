
// Initialize Firebase
var config = {
	apiKey: "AIzaSyDR8fQFqp4kZcwt-0pHnDVdAGUQ4AnOgIo",
	authDomain: "rock-paper-scissors-af009.firebaseapp.com",
	databaseURL: "https://rock-paper-scissors-af009.firebaseio.com",
	projectId: "rock-paper-scissors-af009",
	storageBucket: "rock-paper-scissors-af009.appspot.com",
	messagingSenderId: "433955021403"
};
firebase.initializeApp(config);

var fire = firebase.database();
var data;

var playObj = {
	player1: {
		name: 1,
		play: 1
	},
	player2: {
		name: 1,
		play: 1
	},
	plays: {
		onePlay: 1,
		twoPlay: 1
	},
	wins: {
		oneWins: 0,
		twoWins: 0,
		ties: 0
	},
	opponentName: null
}

function start() {
	fire.ref().set({
		player1: {
			name: 1,
			play: 1
		},
		player2: {
			name: 1,
			play: 1
		}
	});
}

function giveName() {
	$('.row-start').slideUp(2000);
	$('.col-fade').fadeToggle(2500);

	if ((data.player1.name === 1) && ($('#name-input').val() !== '')) {
		playObj.player1.name = $('#name-input').val();
		console.log('name input in player1.name block is ' + $('#name-input').val());
		console.log('local name 1 is ' + playObj.player1.name);
		fire.ref().update({
			player1: {
				name: playObj.player1.name,
				play: 1
			}
		}); // end firebase set data.player1.name
		playObj.player1.name = data.player1.name;
		$('#name-input').val('');
		$('.row-message').show();
		$('.col-message').html("<span>Please wait for an oppenent...</span>");
		player2OpponentSet();
	} else if (($('#name-input').val() !== '') && (data.player1.name != playObj.player1.name) && (data.player2.name === 1)) {
		playObj.player2.name = $('#name-input').val();
		fire.ref().update({
			player2: {
				name: playObj.player2.name,
				play: 1
			}
		}); // end firebase set name2
		playObj.player2.name = data.player2.name;
		$('#name-input').val('');
		playObj.opponentName = data.player1.name;
		playersTogether();
	}
}

function player2OpponentSet() {
	if ((data.player2.name !== playObj.player2.name) && (data.player1.name === playObj.player1.name) && (data.player2.name !== 1)) {
		playObj.player2.name = data.player2.name;
		playObj.opponentName = data.player2.name;
		playersTogether();
	} else {
		setTimeout(player2OpponentSet, 500);
	}
} // player2OpponentSet

function playersTogether() {
	if (playObj.opponentName !== null) {
		$('.row-message').show();
		$('.col-message').html("<span>You're playing with " + playObj.opponentName + " today.  Click rock, paper or scissors to play a round.  Have fun!</span>");
		setTimeout(startPlay, 2000);
	}
}

function startPlay() {
	$('.row-message').fadeToggle();
	$('.row-play-choice').fadeToggle();
}

function nameFocus() {
	$('#name-input').focus(function () {
		if ((($('#name-input').attr('value')) || ($('#name-input').val())) == 'Name') {
			$('#name-input').attr('value', '');
			$('#name-input').val('');
			console.log('onfocus ' + $('#name-input').attr('value'), $('#name-input').val());
		}
	});
	$('#name-input').blur(function () {
		if ((($('#name-input').attr('value')) || ($('#name-input').val())) == '') {
			$('#name-input').attr('value', 'Name');
			$('#name-input').val('Name');
			console.log('onblur ' + $('#name-input').attr('value'), $('#name-input').val());
		}
	});
}

function makeMove(event) {
	playObj.plays.onePlay = $(event.target).data('move');
	console.log('onePlay is ' + playObj.plays.onePlay);
	$('.row-play-choice').hide();
	$('.row-play-battle').show();
	$('.pic-my-play').html('<img class="battle-img" src="assets/images/' + playObj.plays.onePlay + '.png" alt="You played ' + playObj.plays.onePlay + '" />');
	$('.my-move-caption').html('<span>' + playObj.plays.onePlay + '</span>');
	if ((playObj.opponentName === data.player2.name) && (data.player1.play === 1)) {
		playObj.player1.play = playObj.plays.onePlay;
		fire.ref().update({
			player1: {
				name: data.player1.name,
				play: playObj.player1.play
			}
		});
		setLocalOpponent1Play();
	} else if ((playObj.opponentName === data.player1.name) && (data.player2.play === 1)) {
		playObj.player2.play = playObj.plays.onePlay;
		fire.ref().update({
			player2: {
				name: data.player2.name,
				play: playObj.player2.play
			}
		});
		setLocalOpponent2Play();
	}
}
function setLocalOpponent1Play() {
	if (data.player2.play !== 1) {
		playObj.player2.play = data.player2.play;
		playObj.plays.twoPlay = playObj.player2.play;
		$('.pic-opponent-play').html('<img class="battle-img" src="assets/images/' + playObj.plays.twoPlay + '.png" alt="Your opponent played ' + playObj.plays.twoPlay + '" />');
		$('.opponent-move-caption').html('<span>' + playObj.plays.twoPlay + '</span>');
		setTimeout(reckoning, 3000);
	} else {
		setTimeout(setLocalOpponent1Play, 500);
	}
}
function setLocalOpponent2Play() {
	if (data.player1.play !== 1) {
		playObj.player1.play = data.player1.play;
		playObj.plays.twoPlay = playObj.player1.play;
		$('.pic-opponent-play').html('<img class="battle-img" src="img/' + playObj.plays.twoPlay + '.png" alt="Your opponent played ' + playObj.plays.twoPlay + '" />');
		$('.opponent-move-caption').html('<span>' + playObj.plays.twoPlay + '</span>');
		setTimeout(reckoning, 3000);
	} else {
		setTimeout(setLocalOpponent2Play, 500);
	}
}


function reckoning() {
	console.log('reckoning fired');
	$('.row-play-battle').hide();
	$('.row-reckoning').show();
	if (playObj.plays.twoPlay === playObj.plays.onePlay) {
		$('.winning-pic').html('<img class="battle-img" src="img/' + playObj.plays.onePlay + '.png" alt="You tie!" />');
		$('.outcome-message').html('<span>you tie!</span>');
		playObj.wins.ties++;
		$('.col-win').find('span').text('wins: ' + playObj.wins.oneWins);
		$('.col-tie').find('span').text('ties: ' + playObj.wins.ties);
		$('.col-lose').find('span').text('losses: ' + playObj.wins.twoWins);
		console.log('ties is ' + playObj.wins.ties);
	} else if ((playObj.plays.onePlay == 'rock' && playObj.plays.twoPlay == 'scissors') || (playObj.plays.onePlay == 'scissors' && playObj.plays.twoPlay == 'paper') || (playObj.plays.onePlay == 'paper' && playObj.plays.twoPlay == 'rock')) {
		$('.winning-pic').html('<img class="battle-img" src="assets/images/' + playObj.plays.onePlay + '.png" alt="You win!" />');
		$('.outcome-message').html('<span>' + playObj.plays.onePlay + ' beats ' + playObj.plays.twoPlay + '.  you win!</span>');
		playObj.wins.oneWins++;
		$('.col-win').find('span').text('wins: ' + playObj.wins.oneWins);
		$('.col-tie').find('span').text('ties: ' + playObj.wins.ties);
		$('.col-lose').find('span').text('losses: ' + playObj.wins.twoWins);
		console.log('oneWins is ' + playObj.wins.oneWins);
	} else {
		$('.winning-pic').html('<img class="battle-img" src="assets/images/' + playObj.plays.twoPlay + '.png" alt="You lose!" />');
		$('.outcome-message').html('<span>' + playObj.plays.twoPlay + ' beats ' + playObj.plays.onePlay + '.  you lose!</span>');
		playObj.wins.twoWins++;
		$('.col-win').find('span').text('wins: ' + playObj.wins.oneWins);
		$('.col-tie').find('span').text('ties: ' + playObj.wins.ties);
		$('.col-lose').find('span').text('losses: ' + playObj.wins.twoWins);
		console.log('twoWins is ' + playObj.wins.twoWins);
	} // end reckoning game logic
	setTimeout(setNext, 3000);
} // end reckoning
function setNext() {

	fire.ref().update({
		player1: {
			name: data.player1.name,
			play: 1
		},
		player2: {
			name: data.player2.name,
			play: 1
		}
	});

	$('.row-reckoning').hide();
	$('.pic-opponent-play, .opponent-move-caption, .my-move-caption, .pic-my-play, .winning-pic, .outcome-message').empty();
	$('.row-play-choice').show();
}


// Starts the game - Calls Start function
$(document).ready(function () {
	fire.ref().on('value', function (snapshot) {
		data = snapshot.val();
	});
	start(); //Sets initial parameters for start game so if players re-enter game will reset
	nameFocus();
	$('#name-submit').click(giveName);
	$(document).keypress(function (event) {
		if (event.which === 13) {
			giveName();
		}
	});
	$('.col-play-pic').click(function (event) {
		makeMove(event)
	});
}); 
