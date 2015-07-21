PERFECT = 'hard';
FORGETFUL = 'FORGETFUL';
EVOLVING = 'EVOLVING';
RANDOM = 'very easy';

function ai_factory(){

	var seen = {};
	var moves = {};

	var is_forgetting = false;

	function get_score(board){
		var sum = 40;
		for(var i = 1; i < 5; i++){
			sum -= i*board[i];
		}
		return sum;
	}

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

	function random(options){
		if (0 == options.length){
			return null;
		}
		return options[Math.floor(Math.random()*options.length)];
	}

	function get_move(board, difficulty){
		difficulty = difficulty || PERFECT;
		var possible_moves = [];
		for (var i = 1; i < 5; i++){
			if (board[i] > 0){
				possible_moves.push(i);
			}
		}
		var options = [];
		var choice = null;

		if (difficulty == EVOLVING && get_score(board) > 11){
			difficulty = PERFECT;
		}

		if (difficulty == FORGETFUL){
			is_forgetting = !is_forgetting;
			if (!is_forgetting){
				difficulty = PERFECT;
			}
		}

		if (difficulty == PERFECT){
			options = moves[key(board)];
		}

		if (difficulty == RANDOM){
			// do nothing
		}

		return choice || random(options) || random(possible_moves);
	}

	function build_tree(){
		seen = {};
		moves = {};
		var cards = {};
		for (var i = 1; i < 5; i++){
			cards[i] = 4;
		}
	    play(0, cards);
	}

	build_tree();

	return {
		get_move: get_move,
	};
}
