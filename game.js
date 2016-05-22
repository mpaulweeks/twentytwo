function game(){

var board = {};
var ai_turn = true;
var ai_on = false;
// var ai_on = true;
var score = 0;
var player_number = 0;
var ai_brain = ai_factory(); //inherited from ai.js

function move_ai(){
	if (!ai_on){
		return;
	}
	var choice = ai_brain.get_move(board);
	var query = $('.clickable.c' + choice);
	var element = Math.floor(Math.random()*query.length);
	query.eq(element).click();
}

function startGame(){
	gameOver = false;
	$('img').addClass('clickable');
	$('img').css({position: 'float', left: 0});
	for (var i = 1; i < 5; i++){
		board[i] = 4;
	}
	score = 0;
	print_score();

	ai_turn = true;
	move_ai();
}

function move(div){
	gap = 100
	distance = gap - div.offset().left;
	if(ai_turn){
		distance = $(window).width() - gap - div.offset().left - div.width();
	}
	distance += Math.floor(Math.random()*gap) - gap/2;
	delta = "+=" + distance;
	div.css({position: 'relative'});
	div.animate({left: delta}, 950);
}

function print_score(){
	$('#score').html(score);
	print_player();
}

function print_player(){
	if(gameOver){
		return;
	}
	var message = get_current_player_name();
	$('#player_message').html(message);
}

function get_current_player_name(){
	if(ai_on){
		if(ai_turn){
			return "AI";
		} else {
			return "Human";
		}
	} else {
		return "Player " + (player_number + 1);
	}
}

function get_opponent_player_name(){
	if(ai_on){
		if(ai_turn){
			return "Human";
		} else {
			return "AI";
		}
	} else {
		return "Player " + (2 - player_number);
	}
}

$('img').on('click', function (){
	if (gameOver){
		return;
	}

	if (!$(this).hasClass('clickable')){
		return;
	}

	$(this).removeClass('clickable');
	move($(this));

	var className = $(this).attr('class');
	var value = parseInt(className.charAt(1));
	board[value] -= 1;
	score += value;
	if (score > 21){
		var win = score == 22;
		var you_win = (!ai_on && win) || (ai_on && ((win && !ai_turn) || (!win && ai_turn)));
		console.log('you win = ' + you_win);
		var player_name = get_current_player_name();
		if (!you_win){
			player_name = get_opponent_player_name();
		}
		var message = player_name + ' wins!'
		gameOver = true;
		setTimeout(function(){
			alert(message);
			return startGame();
		}, 1000);
	}
	if(ai_on){
		if (ai_turn){
			ai_turn = false;

		} else {
			ai_turn = true;
			setTimeout(move_ai, 400);
		}
	}
	player_number = 1 - player_number;
	print_score();
});

$('#reset').on('click', startGame);

startGame();

}
