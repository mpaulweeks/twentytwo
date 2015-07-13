
run_tests = run_tests || function(){console.log('done');}

old_tests = run_tests;
run_tests = function(){
	test_ai();
	old_tests();
}

function test_ai(){
	var ai_brain = ai_factory(); //inherited
	
}
