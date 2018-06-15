
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
		myPlay: 1,
		opponentPlay: 1
	},
	wins: {
		myWins: 0,
		opponentWins: 0,
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
		}); // end ref set
}

function giveName() {
	$('.row-start').slideUp(2000);
	console.log('initial value of firebase name1 is ' + data.player1.name);

	if((data.player1.name === 1) && ($('#name-input').val() !== '')) {
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
		$('.col-message').html("<span>Waiting for an opponent...</span>");
		console.log('firebase player1.name is ' + data.player1.name);
		player2OpponentSet();
	} else if(($('#name-input').val() !== '') && (data.player1.name != playObj.player1.name) && (data.player2.name === 1)) {
		playObj.player2.name = $('#name-input').val();
		console.log('name input in name2 block is ' + $('#name-input').val());
		console.log('local player2.name is ' + playObj.player2.name);
		fire.ref().update({
			player2: {
				name: playObj.player2.name,
				play: 1
			}
		}); // end firebase set name2
		playObj.player2.name = data.player2.name;
		$('#name-input').val('');
		console.log('firebase name 2 is ' + data.player2.name);
		playObj.opponentName = data.player1.name;
		console.log('local opponent name (1) is ' + playObj.opponentName);
		playersTogether();

	} // set player1 and player2

} // end giveName

function player2OpponentSet() {
	if((data.player2.name !== playObj.player2.name) && (data.player1.name === playObj.player1.name) && (data.player2.name !== 1)) {
		playObj.player2.name = data.player2.name;
		playObj.opponentName = data.player2.name;
		console.log('local opponent name (2) is ' + playObj.opponentName);
		playersTogether();
	} else {
		setTimeout(player2OpponentSet, 500);
	}
} // player2OpponentSet

function playersTogether() {
	if(playObj.opponentName !== null) {
		console.log('opponent is ' + playObj.opponentName);
		$('.row-message').show();
		$('.col-message').html("<span>You're playing with " + playObj.opponentName + " today.  Click rock, paper or scissors to play a round.  Have fun!</span>");
		setTimeout(startPlay, 2000);
	} // show begin message
} // end playersTogether

function startPlay() {
	$('.row-message').slideUp();
	$('.row-play-choice').slideDown();
} // end startPlay

function nameFocus(){
	$('#name-input').focus(function() {
		if((($('#name-input').attr('value')) || ($('#name-input').val()))  == 'Name') {
			$('#name-input').attr('value', '');
			$('#name-input').val('');
			console.log('onfocus ' + $('#name-input').attr('value'), $('#name-input').val());
		} // name-input focus if
	}); // name-input focus
	$('#name-input').blur(function() {
		if((($('#name-input').attr('value')) || ($('#name-input').val()))  == '') {
			$('#name-input').attr('value', 'Name');
			$('#name-input').val('Name');
			console.log('onblur ' + $('#name-input').attr('value'), $('#name-input').val());
		} //name-input blur if
	}); // name-input blur
} //end nameFocus

function makeMove(event) {
		playObj.plays.myPlay = $(event.target).data('move');
		console.log('myPlay is ' + playObj.plays.myPlay);
		$('.row-play-choice').hide();
		$('.row-play-battle').show();
		$('.pic-my-play').html('<img class="battle-img" src="img/' + playObj.plays.myPlay + '.jpg" alt="You played ' + playObj.plays.myPlay + '" />');
		$('.my-move-caption').html('<span>' + playObj.plays.myPlay + '</span>');
		if((playObj.opponentName === data.player2.name) && (data.player1.play === 1)) {
			console.log('player 1 set play value in firebase');
			playObj.player1.play = playObj.plays.myPlay;
			fire.ref().update({
				player1: {
					name: data.player1.name,
					play: playObj.player1.play
				}
			}); // end firebase update data.player1.play
			console.log('set player1 play complete.  playObj.plays.myPlay for player 1 is "' + playObj.plays.myPlay + '" and data.player1.play is "' + data.player1.play +'"');
			setLocalOpponent1Play();
		} else if((playObj.opponentName === data.player1.name) && (data.player2.play === 1)){
			console.log('player2 set play value in firebase');
			playObj.player2.play = playObj.plays.myPlay;
			fire.ref().update({
				player2: {
					name: data.player2.name,
					play: playObj.player2.play
				}
			}); // end firebase update data.player2.play
			console.log('set player2 play complete.  playObj.plays.myPlay for player2 is "' + playObj.plays.myPlay + '" and data.player2.play is "' + data.player2.play +'"');
			setLocalOpponent2Play();
		} // end set play db values
} // end makeMove
function setLocalOpponent1Play() {
		if(data.player2.play !== 1) {
			console.log('player1 set opponent play value locally');
			playObj.player2.play = data.player2.play;
			playObj.plays.opponentPlay = playObj.player2.play;
			$('.pic-opponent-play').html('<img class="battle-img" src="img/' + playObj.plays.opponentPlay + '.jpg" alt="Your opponent played ' + playObj.plays.opponentPlay + '" />');
			$('.opponent-move-caption').html('<span>' + playObj.plays.opponentPlay + '</span>');
			setTimeout(reckoning, 3000);
		} else {
			setTimeout(setLocalOpponent1Play, 500);
		}
} // end set local opponent 1 play
function setLocalOpponent2Play() {
		if(data.player1.play !== 1) {
			console.log('player2 set opponent play value locally');
			playObj.player1.play = data.player1.play;
			playObj.plays.opponentPlay = playObj.player1.play;
			$('.pic-opponent-play').html('<img class="battle-img" src="img/' + playObj.plays.opponentPlay + '.jpg" alt="Your opponent played ' + playObj.plays.opponentPlay + '" />');
			$('.opponent-move-caption').html('<span>' + playObj.plays.opponentPlay + '</span>');
			setTimeout(reckoning, 3000);
		} else {
			setTimeout(setLocalOpponent2Play, 500);
		}// end else if set opponent values
} // end set local opponent values

	// click handler fires in first page, hide row-play-choice run set playObj.playerX.play and battle screen for nameX, push firebase playerX.play

	// click handler fires in second page, hide row-play-choice run set playObj.playerX.play and battle screen for nameX, push firebase playerX.play

	// if play isn't null for both players, set local playObj.playerX.play variables equal to firebase move variables and complete battle screens and reckon

	// one second timeout, then animate reckoning function

	// display score at the top, hide battle screen, show row-play-choice, repeat click handler

function reckoning() {
	console.log('reckoning fired');
	$('.row-play-battle').hide();
	$('.row-reckoning').show();
	if(playObj.plays.opponentPlay === playObj.plays.myPlay){
		$('.winning-pic').html('<img class="battle-img" src="img/' + playObj.plays.myPlay + '.jpg" alt="You tie!" />');
		$('.outcome-message').html('<span>you tie!</span>');
		playObj.wins.ties++;
		$('.col-win').find('span').text('wins: ' + playObj.wins.myWins);
		$('.col-tie').find('span').text('ties: ' + playObj.wins.ties);
		$('.col-lose').find('span').text('losses: ' + playObj.wins.opponentWins);
		console.log('ties is ' + playObj.wins.ties);
	} else if((playObj.plays.myPlay == 'rock' && playObj.plays.opponentPlay == 'scissors') || (playObj.plays.myPlay == 'scissors' && playObj.plays.opponentPlay == 'paper') || (playObj.plays.myPlay == 'paper' && playObj.plays.opponentPlay == 'rock')){
			$('.winning-pic').html('<img class="battle-img" src="img/' + playObj.plays.myPlay + '.jpg" alt="You win!" />');
			$('.outcome-message').html('<span>' + playObj.plays.myPlay + ' beats ' + playObj.plays.opponentPlay + '.  you win!</span>');
			playObj.wins.myWins++;
			$('.col-win').find('span').text('wins: ' + playObj.wins.myWins);
			$('.col-tie').find('span').text('ties: ' + playObj.wins.ties);
			$('.col-lose').find('span').text('losses: ' + playObj.wins.opponentWins);
			console.log('myWins is ' + playObj.wins.myWins);
	} else {
			$('.winning-pic').html('<img class="battle-img" src="img/' + playObj.plays.opponentPlay + '.jpg" alt="You lose!" />');
			$('.outcome-message').html('<span>' + playObj.plays.opponentPlay + ' beats ' + playObj.plays.myPlay + '.  you lose!</span>');
			playObj.wins.opponentWins++;
			$('.col-win').find('span').text('wins: ' + playObj.wins.myWins);
			$('.col-tie').find('span').text('ties: ' + playObj.wins.ties);
			$('.col-lose').find('span').text('losses: ' + playObj.wins.opponentWins);
			console.log('opponentWins is ' + playObj.wins.opponentWins);
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




$(document).ready(function(){
	fire.ref().on('value', function(snapshot) {
		data = snapshot.val();
	});
	start();
	nameFocus();
	$('#name-submit').click(giveName);
	$(document).keypress(function(event) {
		if(event.which === 13) {
			giveName();
		}
	});
	$('.col-play-pic').click(function(event){
		makeMove(event)
	});


}); // end doc ready
