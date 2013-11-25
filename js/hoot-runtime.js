/*

This is the 'runtime' for Hoot.  It's the code that makes a Hoot game playable.
A minified copy of this entire script is in examplegame.html to make it run.



TODO: runtime needs for the "location" var to mean the current location
so that the engine can always display a clickable with the location name
as a clickable title in the game display

ALSO: allow location to be set to something invalid (like NOWHERE) which
will not display the location at all

ALSO: might want to do something similar for an inventory (game author
would be responsible for creating inventory interface)

*/



function rungame(tree, outputarea){
	var gamevars = [];
	var upper = false;

	// the first element in the tree will be array of the rest of the tree
	tree = tree[0];

	outputarea.empty();
	runfunc('start');

	function runfunc(funcname){
		thefunc = findfunc(funcname);
		if(!thefunc){ alert("Sorry, can't continue because I couldn't find a thing named \""+funcname+"\"."); return; }
		// console.log("running function "+thefunc[1][1]);
		expressions(thefunc, 2);
	}

	function findfunc(funcname){
		for(s in tree){
			if(tree[s][1] && tree[s][1][1] && tree[s][1][1].toLowerCase() == funcname.toLowerCase()){ 
				return tree[s];
			}
		}
		return null;
	}

	function expression(expr){
		switch(expr[0]){
			case 'assign':
				// console.log("assigning "+expr[1][1]+" to "+expr[2][1]);
			 gamevars[expr[1][1].toLowerCase()] = expr[2][1]; 

			 break;
			case 'print':  print(expr); break;
			case 'ifseq':  ifsequence(expr); break;
			case 'runme':  runfunc(expr[1][1]); break;
			case 'decr':   gamevars[expr[1][1].toLowerCase()]--; break;
			case 'incr':   gamevars[expr[1][1].toLowerCase()]++; break;
			case 'elseseq': break; // do nothing, this will run if needed
			default: alert("Sorry, I wasn't expecting a '"+expr[0]+"' in the script. :-(");
		}
	}

	function expressions(list, startpos){
		// run multiple expressions from a list, starting from startpos
		for(var e=startpos; e<list.length; e++){
			expression(list[e]);
		}
	}

	function ifsequence(tree){
		var val1 = tree[1][1];
		var test_opr = tree[2][1];
		var val2 = tree[3][1];

		// console.log("Test: "+val1+" "+test_opr+" "+val2);

		if(tree[1][0] == "name"){ val1=gamevars[val1.toLowerCase()]; }
		if(tree[3][0] == "name"){ val2=gamevars[val2.toLowerCase()]; }

		// console.log("translates to: "+val1+" "+test_opr+" "+val2);


		if( (test_opr == "equals"           && val1 == val2) ||
			(test_opr == "less than"         && val1 <  val2) ||
			(test_opr == "greater than"      && val1 >  val2) ||
			(test_opr == "doesn't equal"        && val1 != val2) ){
			// console.log("true");
			expressions(tree,4);
		}
		else{
			// console.log("false");
			// see if there's an else to run
			for(e in tree){
				if(tree[e][0] == "elseseq"){
					expressions(tree[e],1);
				}
			}
		}
	}

	function print(printables){
		for(var p = 1; p<printables.length; p++){
			type = printables[p][0]; // the type of printable item
			body = printables[p][1]; // the body of the printable
			// console.log("printing "+type+": "+body);
			switch(type){
				case 'string' : printstr(body); break;
				case 'strname'   : printname(body); break;
				case 'upname' : upper = true; printname(body); break;
				case 'link'   : printlink(body); break;
				case 'break'  : printbreak(); break;
				default: alert("Sorry, I don't know how to display a '"+type+"'. :-(");
			}
		}
	}

	function printname(name){
		name = name.toLowerCase();
		if(name in gamevars){
			printstr(gamevars[name]);
			return;
		}
		if(findfunc(name)){
			runfunc(name);
			return;
		}
		alert("Sorry, couldn't find anything called '"+name+"' to display.");
	}

	function printstr(str){
		str = String(str);
		if(upper){
			upper = false; // we've done it, don't do it again until requested
			printstr(str.charAt(0).toUpperCase()+str.slice(1));
			return;
		}
		outputarea.append("<span>"+str+"</span>");
	}

	function printlink(funcname){
		outputarea.append($("<a href=\"#\">"+body+"</a>").click(function(){
			outputarea.empty();
			runfunc(funcname);
			return false;
		}));
	}

	function printbreak(){
		outputarea.append("<hr>");
	}
}
