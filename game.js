function game(){

var seen = {};
var moves = {};

function key(cards){
	var str_rep = "";
	for (var i = 1; i < 5; i++){
		str_rep += i;
		str_rep += cards[i];
	}
	return str_rep;
}

function new_(cards){
	var new_cards = {}
	for (var i = 1; i < 5; i++){
		new_cards[i] = cards[i];
	}
	return new_cards;
}

function play(score, cards){
    if (key(cards) in seen){
        return seen[key(cards)];
    }

    // catch a game end due to simulated move
    if (score == 22){
    	return false;
    }
    if (score > 22){
    	return true;
    }

    // base case
    var win = false;
    var winning_moves = [];
    for (var i = 1; i < 5; i++){
    	if (cards[i] > 0){
    		var win_move = score + i == 22;
    		win = win || win_move;
    		if (win_move){
    			winning_moves.push(i);
    		}
    	}
    }
    var loss = true;
    for (var i = 1; i < 5; i++){
    	if (cards[i] > 0){
    		loss = loss && score + i > 22;
    	}
    }
    if (win){
    	seen[key(cards)] = true;
    	moves[key(cards)] = winning_moves;
        return true;
    }
    if (loss){
    	seen[key(cards)] = false;
        return false;
    }

    // recursive case
    var good_moves = [];
    var all_true = true;
    for (var i = 1; i < 5; i++){
        if (cards[i] > 0){
            var new_cards = new_(cards);
            new_cards[i] -= 1;
            var opponent_result = play(score + i, new_cards);
            all_true = all_true && opponent_result;
            if (!opponent_result){
            	good_moves.push(i);
            }
        }
    }
    var result = !all_true;
    seen[key(cards)] = result;
    moves[key(cards)] = good_moves;
    return result
}

function determine_ai(){
	var cards = {};
	for (var i = 1; i < 5; i++){
		cards[i] = 4;
	}
    play(0, cards);
}

var board = {};
var ai_turn = true;
var ai_on = true;
var score = 0;

function move_ai(){
	var options = moves[key(board)];
	console.log(key(board), options);
	var choice = Math.floor(Math.random()*options.length);
	var query = $('.clickable.c' + options[choice]);
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

	ai_turn = true;
	move_ai();
	// ai_on = false;
	// ai_turn = false;
	// $('.clickable.c1').first().click();
	// $('.clickable.c1').first().click();
	// $('.clickable.c1').first().click();
	// $('.clickable.c2').first().click();
	// $('.clickable.c2').first().click();
	// $('.clickable.c2').first().click();
	// $('.clickable.c2').first().click();
	// $('.clickable.c3').first().click();
	// $('.clickable.c3').first().click();
	// ai_on = true;
	// ai_turn = true;
	// move_ai();
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
	$('#message').html(score);
	if (score > 21){
		var win = score == 22;
		var you_win = (win && !ai_turn) || (!win && ai_turn);
		gameOver = true;
		setTimeout(function(){
			alert('you win = ' + you_win);
			return startGame();
		}, 1000);
	}
	// console.log(board);
	if(ai_on){
		if (ai_turn){
			ai_turn = false;
		} else {
			ai_turn = true;
			setTimeout(move_ai, 400);
		}
	}
});

$('#reset').on('click', startGame);

determine_ai();
startGame();

}
