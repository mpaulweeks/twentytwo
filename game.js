function game(){

read_url_param = function(param_name, as_list){
    as_list = as_list || false;
    var vars = {};
    var q = document.URL.split('?')[1];
    if(q != undefined){
        q = q.split('&');
        for(var i = 0; i < q.length; i++){
            var param = q[i].split('=');
            var name = param[0];
            var value = param[1];
            vars[name] = vars[name] || [];
            vars[name].push(value);
        }
    }
    if (vars.hasOwnProperty(param_name)){
        if (vars[param_name].length == 1 && !as_list){
            return vars[param_name][0];
        }
        return vars[param_name];
    }
    return null;
};

var board = {};
var ai_turn = true;
var ai_on = false;
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
	ai_on = Boolean(read_url_param('ai'))

	gameOver = false;
	$('img').addClass('clickable');
	$('img').css({position: 'float', left: 0});
	for (var i = 1; i < 5; i++){
		board[i] = 4;
	}
	score = 0;
	print_score();
	$('.overlay').hide();

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
		var player_name = get_current_player_name();
		if (!win){
			player_name = get_opponent_player_name();
		}
		var message = player_name + ' wins!'
		gameOver = true;
		setTimeout(function(){
			$('#victory').html(message);
			$('.overlay').show();
		}, 1000);
	}
	else if(ai_on){
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
