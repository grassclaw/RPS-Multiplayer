$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDR8fQFqp4kZcwt-0pHnDVdAGUQ4AnOgIo",
        authDomain: "rock-paper-scissors-af009.firebaseapp.com",
        databaseURL: "https://rock-paper-scissors-af009.firebaseio.com",
        projectId: "rock-paper-scissors-af009",
        storageBucket: "rock-paper-scissors-af009.appspot.com",
        messagingSenderId: "433955021403"
    };
    // firebase.initializeApp(config);

    var app = firebase.initializeApp(config);

    // Alias database and sub-levels.
    var database = firebase.database();
    var chats = database.ref('chat');
    var connections = database.ref('connections');

    // Initialize player/opponent data.
    var con;
    var player = {
        number: '0',
        name: '',
        wins: 0,
        losses: 0,
        turns: 0,
        choice: ''
    };
    var opponent = {
        number: '0',
        name: '',
        wins: 0,
        losses: 0,
        turns: 0,
        choice: ''
    };
    var waiting = false;

    // jQuery selectors used in multiple places.
    var messages = $('.messages');
    var username = $('#username');

    // Initial connection to Firebase/presence handling.
    // This is 'once' and not 'on'.
    connections.once('value', function (snapshot) {
        if (Object.keys(snapshot.val()).indexOf('1') === -1) {
            player.number = '1';
            opponent.number = '2';
        } else if (Object.keys(snapshot.val()).indexOf('2') === -1) {
            player.number = '2';
            opponent.number = '1';
        }

        // If you got a player number, you're 1 or 2.
        if (player.number !== '0') {
            // Make a connection to Firebase and send your info.
            con = connections.child(player.number);
            con.set(player);

            // When I disconnect, remove this device.
            con.onDisconnect().remove();

            // If 1 and 2 were taken, your number is still 0.
        } else {
            // Remove the name form and put the alert there.
            $('section').remove();
            $('.alert').show();
            // And disconnect from Firebase.
            app.delete();
        }
    });


    // Ongoing event listening.
    connections.on('value', function (snapshot) {
        // If the player is connected,
        if (con) {
            // And an opponent is connected,
            if (Object.keys(snapshot.val()).indexOf(opponent.number) !== -1) {
                // Gather the latest info about your opponent and also yourself.
                opponent = snapshot.val()[opponent.number];
                player = snapshot.val()[player.number];
                // If we have a name for our opponent,
                if (opponent.name.length > 0) {
                    // Show the opponent. This also updates the opponents info over time.
                    DOMFunctions.showOpponentInfo();
                    // Once both players have a name,
                    if (player.name.length > 0) {
                        // Check each time whether the players have made selections.
                        var choice1 = snapshot.val()['1'].choice;
                        var choice2 = snapshot.val()['2'].choice;
                        var turns1 = snapshot.val()['1'].turns;

                        // If both have picked, run getWinner on those choices.
                        if (choice1.length > 0 && choice2.length > 0) {
                            getWinner(choice1, choice2);
                            // If player 1 hasn't chosen yet, show them their options.
                        } else if (choice1.length === 0 && turns1 === 0) {
                            DOMFunctions.showMoveOptions('1');
                            // Otherwise player 2 must be the one who hasn't make a choice yet.
                        } else if (choice1.length > 0 && choice2.length === 0) {
                            DOMFunctions.showMoveOptions('2');
                        }
                    }
                }
            } else if (opponent.name.length > 0 && Object.keys(snapshot.val()).indexOf(opponent.number) === -1) {
                $('.turn').text('Opponent left. Waiting for new opponent.');
                $('.waiting-' + opponent.number).show();
                $('.name-' + opponent.number).empty();
                $('.win-loss-' + opponent.number).empty();
            }
        }
    });


    // On-click function for submitting a name.
    $('#submit-name').on('click', function () {
        player.name = username.val();
        if (player.name.length > 0) {
            con.update({
                name: player.name
            });
            DOMFunctions.showSelfJoin();
        }

        return false;
    });

    // Functions for changing HTML elements.
    var DOMFunctions = {
        showSelfJoin: function () {
            username.val('');
            $('.user-form').hide();
            $('.waiting-' + player.number).hide();
            $('.name-' + player.number).text(player.name);
            $('.win-loss-' + player.number).text('Wins: ' + player.wins + ' | Losses: ' + player.losses);
            $('.hello').text('Hello ' + player.name + '! You are player ' + player.number + '.').show();
            $('.turn').show();
            $('.chat-row').show();
            $('.moves-' + opponent.number).remove();
            this.updateScroll();
        },
        showOpponentInfo: function () {
            $('.waiting-' + opponent.number).hide();
            $('.name-' + opponent.number).text(opponent.name);
            $('.win-loss-' + opponent.number).text('Wins: ' + opponent.wins + ' | Losses: ' + opponent.losses);
        },
        updatePlayerStats: function () {
            $('.win-loss-' + player.number).text('Wins: ' + player.wins + ' | Losses: ' + player.losses);
        },
        updateScroll: function () {
            messages[0].scrollTop = messages[0].scrollHeight;
        },
        showMoveOptions: function (currentPlayer) {
            if (currentPlayer === player.number) {
                $('.moves-' + currentPlayer).css('display', 'flex');
            }
            $('.turn').text('Player ' + currentPlayer + '\'s turn.');
        },
        showChats: function (snap) {
            var chatMessage = snap.val();
            // Only show messages sent in the last half hour. A simple workaround for not having a ton of chat history.
            if (Date.now() - chatMessage.timestamp < 1800000) {
                var messageDiv = $('<div class="message">');
                messageDiv.html('<span class="sender">' + chatMessage.sender + '</span>: ' + chatMessage.message);
                messages.append(messageDiv);
            }
            DOMFunctions.updateScroll();
        },
        showGameResult: function (message) {
            this.updatePlayerStats();
            $('.choice-' + opponent.number).text(opponent.choiceText).show();
            $('.turn').hide();
            $('.winner').text(message);
            $('.moves').hide();
            setTimeout(function () {
                $('.winner').empty();
                $('.turn').show();
                $('.choice').empty().hide();
                DOMFunctions.showMoveOptions('1');
            }, 3000)
        }
    };

    // On-click function for selecting a move.
    $('.move').on('click', function () {
        var choice = $(this).data('choice');
        var move = $(this).data('text');
        con.update({
            choice: choice,
            choiceText: move
        });

        $('.moves-' + player.number).hide();
        $('.choice-' + player.number).text(move).show();
    });

    // On-click function for submitting a chat.
    $('#submit-chat').on('click', function () {
        var message = $('#message');
        var chatObj = {
            message: message.val(),
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            sender: player.name
        };
        chats.push(chatObj);

        // Clear message input.
        message.val('');

        return false;
    });

    // Database listening function for chats.
    chats.on('child_added', function (snapshot) {
        if (snapshot.val()) {
            DOMFunctions.showChats(snapshot);
        }
    });

    // Win-Loss-Draw logic.
    var getWinner = function (move1, move2) {
        if (move1 === move2) { recordWin(); }
        if (move1 === 'r' && move2 === 's') { recordWin('1', '2'); }
        if (move1 === 'r' && move2 === 'p') { recordWin('2', '1'); }
        if (move1 === 'p' && move2 === 'r') { recordWin('1', '2'); }
        if (move1 === 'p' && move2 === 's') { recordWin('2', '1'); }
        if (move1 === 's' && move2 === 'p') { recordWin('1', '2'); }
        if (move1 === 's' && move2 === 'r') { recordWin('2', '1'); }
    };

    var recordWin = function (winner, loser) {
        player.turns++;
        connections.child(player.number).update({
            choice: '',
            turns: player.turns
        });
        // If there was a winner,
        if (winner) {
            // Then update your own win/loss count.
            if (winner === player.number) {
                player.wins++;
                connections.child(winner).update({
                    wins: player.wins
                });
            } else {
                player.losses++;
                connections.child(loser).update({
                    losses: player.losses
                });
            }
            // Then show the win.
            DOMFunctions.showGameResult('Player ' + winner + ' wins!');
        } else {
            // Else, show the draw.
            DOMFunctions.showGameResult('Draw.');
        }
    }
});