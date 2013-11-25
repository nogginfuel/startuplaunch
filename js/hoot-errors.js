/*

This script interprets the results of a bad parse into something readable so
that a game author can fix their Hootscript.

TODO: more common errors in plain English

*/


function getErrorMessage(parseResults, origScript){
	// parseresults contains:
	// "script":script, "stack":stack, "atom":atom.name}

	var contextsize = 10; // characters around the error to show
	var errorsize = 20; // characters of actual error to show

	var script = parseResults.script;
	var pos = origScript.length - script.length;
	var beforescript = origScript.slice(0,pos)
	var linecount = beforescript.split("\n").length;

	var eos = false;

	if(pos == origScript.length){
		script = "* the end of the script *";
		eos = true;
	}
	else{

		// format the snippet of script that will appear before the error
		if(beforescript.length > contextsize){
			beforescript = "..."+beforescript.slice(beforescript.length-10);
		}

		// from our error script, grab the error up until the first bit of whitespace
		var errorbit = /(\S)+/.exec(script);
		errorbit = errorbit[0];
		if(errorbit.length>errorsize){
			errorbit = errorbit.slice(0,errorsize);
		}

		// and then grab some script after the error
		var afterscript = script.slice(errorbit.length);
		if(afterscript.length > contextsize){
			afterscript = afterscript.slice(0,contextsize)+"...";
		}

		// and then smash it all into a pretty little formatted HTML snippet
		script = "<i>"+beforescript+"</i>"+errorbit+"<i>"+afterscript+"</i>";
		script = script.replace(/\n/g,"<i>&crarr;</i>");
		script = script.replace(/\s+/g," ");
	}




	// now come up with some specific errors
	switch(parseResults.atom){
		case "script":
			error = "Ran into <u>"+script+"</u> while looking for a thing.  To define a thing, be sure to use the format <b>[thing name]:</b>. Don't forget that every game needs to have a [start]: thing to begin the story!";
			break;
		case "colon":
			error = "I was looking for a ':' (colon) after what appeared to be the name of a thing and found <u>"+script+"</u> instead.  Perhaps you're missing the ':' after a thing name?  Things should be defined using this format: <b>[thing name]</b>'";
			break;

		case "name":
			error = "Did not understand <u>"+script+"</u>.  It looks like this should be the name of a thing?  Names should always be fully surrounded with brackets like <b>[this]</b>. They must also not contain square brackets or underscores ([,],_) as part of the name.";
			break;

		case "qclose":
			error = "I ran into <u>"+script+"</u> while looking for the closing slash in some display text.  Be sure that you have both a start and end slash <b>/like this/</b>. Hint: the problem is probably in the last display text in the script.";
			break;

		case "func": case "expr":
			if(eos){
				error = "I ran out of Hootscript while looking for a statement or expression.  In other words, it looks like you either have a thing that is empty (contains no commands or display text) or you might have an if or else statement followed by nothing.  Please give me something to do here!"
				break;
			}

			error = "I tried to interpret this and failed: <u>"+script+"</u>.<br><br>If this was a command of some sort, please check the documentation for the correct spelling of this command.<br><br>Also, things cannot be empty, so maybe you're trying to define a new thing here after an empty thing?<br><br>Or perhaps this was text that you'd written to be displayed? If that's the case, you probably have a missing slash at the end of your display text.  All display text should begin and end with slashes <b>/like this/</b>.  Hint: the problem is probably the display text that comes just before this one in your script!";
			break;

		case "to":
			error = "I ran into <u>"+script+"</u> while looking for the 'to' in a set statement like this: <b>set [some variable] to ...</b>";
			break;

		case "num":
			error = "I ran into <u>"+script+"</u> while looking for a number. This is probably after a 'to' in a set statement like this: <b>set [some variable] to 50</b> where 50 is the number you're trying to set.";
			break;

		case "strname":
			error = "I was looking at what appeared to be the name of a thing or variable <u>"+script+"</u> within some display text.  It looks like perhaps you left the closing square bracket off of the end of the name?  Calling things or variables within display text should look something like this: <b>/The item is [item]./</b>";
			break;

		case "link":
			error = "I was looking at what appeared to be a link to a thing <u>"+script+"</u> within some display text.  It looks like perhaps you left the closing underscore off of the end of the link name?  Linking to things within display text should look something like this: <b>/Here is _a thing_ linked in display text./</b>";
			break;

		case "value":
			error = "I was looking for a variable name or number in an if statement.  Instead I encountered <u>"+script+"</u>.  If statements should take the general form of <b>if <span style=\"font-style:italic;\">value test value2</span> then ...</b> where <span style=\"font-style:italic;\">value</span> and <span style=\"font-style:italic;\">value2</span> are either numbers <b>54</b> or variables <b>[variable]</b> and <span style=\"font-style:italic;\">test</span> is <b>equals</b> or <b>doesn't equal</b> or <b>less than</b> or <b>greater than</b>.  Please see the documentation for some more examples.";
			break;

		case "test": case "eq": case "gt": case "de":
			error = "I was looking for a test in an if statement. Instead I encountered <u>"+script+"</u>.  If statements should take the general form of <b>if <span style=\"font-style:italic;\">value test value2</span> then ...</b> where <span style=\"font-style:italic;\">value</span> and <span style=\"font-style:italic;\">value2</span> are either numbers <b>54</b> or variables <b>[variable]</b> and <span style=\"font-style:italic;\">test</span> is <b>equals</b> or <b>doesn't equal</b> or <b>less than</b> or <b>greater than</b>.  Please see the documentation for some more examples.";
			break;

		case "end":
			error = "I was looking for <b>end</b> to complete an if statement but instead I encountered <u>"+script+"</u>.  Maybe one of your if or else statements does not have a matching end.<br><br>On the other hand, if this was supposed to be a real command inside of an if or else, then it might be wrong. Check the documentation for the correct spelling and format of Hootscript commands.";
			break;

		case "then":
			error = "I was looking for a <b>then</b> to complete the test portion of an if statement, but instead I encountered <u>"+script+"</u>. If statements should take the general form of <b>if <span style=\"font-style:italic;\">test</span> then ...";
			break;


		default: 
			error = "Encountered <u>"+script+"</u> while looking for <b>"+parseResults.atom+"</b>.  Sorry I can't be less cryptic.  Please take a look at the text carefully and refer to the documentation for the correct way to do what you're trying to do.";
	}


	return "<p>Line "+linecount+": "+error+"</p>";
}

