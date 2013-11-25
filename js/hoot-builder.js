/*

This is the script which runs the hoot.html tool itself.  Mostly, it just
contains a bunch of click handlers.  But if you're not sure how anything is
being done, this is the place to start.

*/



var grammar = getGrammar();


function clickTab(tab, tabContent){
	$(".tabContent").hide();
	$(".tab").removeClass("selected");
	tab.addClass("selected");
	tabContent.show();
}

function parseScript(){
	return parser($("#source").val(), grammar);
}

function showError(results, where){
	$(where+" .errorhell")
		.html(getErrorMessage(results, $("#source").val()))
		.show();
}


function showPrettyStructure(){

	var results = parseScript();
	if(!results.success){
		$("#structurearea").html("");	
		showError(results, "#structure");
		return;
	}

	var display = getPrettyStructure(results.tree);
	$("#structure .errorhell").hide();
	$("#structurearea").html(display);
}

function playGame(){
	var results = parseScript();
	if(!results.success){
		$("#playarea").hide();
		showError(results, "#play");
		return;
	}

	// do play here
	$("#play .errorhell").hide();
	$("#playarea").show();
	rungame(results.tree, $("#playarea"));
}

function buildGame(){
	var results = parseScript();
	if(!results.success){
		$("#buildarea").hide();
		$("#buildtest").hide();
		showError(results, "#build");
		return;
	}

	// do build here
	$("#build .errorhell").hide();
	$("#buildarea").show();
	$("#buildtest").show();
	var orig = JSON.stringify(results.tree);
	global_compressed_game = hootCompress(orig);
	$("#buildarea").val("var game=\""+global_compressed_game+"\";");
}

var global_compressed_game = "";



$(function(){ 

	// On startup:


	$('#tab_docs').click(function(){
		clickTab($(this), $('#docs'));
		return false;
	});

	// structure tab!
	$('#tab_structure').click(function(){
		clickTab($(this), $('#structure'));
		showPrettyStructure();
		return false;
	});

	// play tab!
	$('#tab_play').click(function(){
		clickTab($(this), $('#play'));
		playGame();
		return false;
	});

	// build tab!
	$('#tab_build').click(function(){
		clickTab($(this), $('#build'));
		buildGame();
		return false;
	});

	// build playtest link
	$("#buildtest").click(function(){
		$("#play").show();
		$("#play .errorhell").hide();
		$("#playarea").show();
		rungame(JSON.parse(hootDecompress(global_compressed_game)), $("#playarea"));
		return false;
	});

	// start with docs tab selected
	$('#tab_docs').click(); 



	$('#generate-script').click(function(){
		$('#source').val(generateExampleScript());
		return false;
	});	
	


});

