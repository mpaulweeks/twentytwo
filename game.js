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

    // base case
    var win = false;
    var winning_moves = [];
    for (var i = 1; i < 5; i++){
    	if (cards[i] > 0){
    		var winning_move = score + i == 22;
    		win = win || winning_move;
    		if (winning_move){
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
    	moves[key(cards)] = winning_moves;
        return true;
    }
    if (loss){
        return false;
    }

    // recursive case
    var good_moves = [];
    var all_true = true;
    for (var i = 1; i < 5; i++){
        if (cards[i] > 0){
            new_cards = new_(cards);
            new_cards[i] -= 1;
            opponent_result = play(score + i, new_cards);
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
var score = 0;

function move_ai(){
	var options = moves[key(board)];
	// console.log(options);
	var choice = Math.floor(Math.random()*options.length);
	var query = $('.clickable.c' + options[choice]);
	var element = Math.floor(Math.random()*query.length);
	query.eq(element).click();
}

function startGame(){
	$('img').show();
	$('img').addClass('clickable');
	for (var i = 1; i < 5; i++){
		board[i] = 4;
	}
	score = 0;

	ai_turn = true;
	move_ai();
}

$('img').on('click', function (){
	if (!$(this).hasClass('clickable')){
		return;
	}

	$(this).removeClass('clickable');
	$(this).hide();
	var className = $(this).attr('class');
	var value = parseInt(className.charAt(1));
	board[value] -= 1;
	score += value;
	$('#message').html(score);
	if (score > 21){
		var win = score == 22;
		var you_win = (win && !ai_turn) || (!win && ai_turn);
		alert('you win = ' + you_win);
		return startGame();
	}
	// console.log(board);
	if (ai_turn){
		ai_turn = false;
	} else {
		ai_turn = true;
		move_ai();
	}
});

$('#reset').on('click', startGame);

determine_ai();
startGame();

}