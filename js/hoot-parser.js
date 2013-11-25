
/*

This is the Hoot parser.  It turns Hootscripts into Hoot games.

It is predictive (see hoot-grammar.js for creation of predictions)
and iterative rather than recursive.  It's orders of magnitude faster than the
previous recursive PEG-style parser.
This could probably do with some refactoring and beautification, but
I need some time away from it before I start that.

*/


function parser(script, grammar){
	var stack = [grammar["script"]];
	var success = true;
	var tree = [];
	var matchedrule, atom, newatom, ruleatom; // used later

	var treestack = [tree];

	script = script.replace(/^\s+/, ''); // trim leading space

	while(stack.length > 0 && success){
		//console.log((function(){var s = script.replace(/\n/,''); var elipsis = (script.length>30 ? '...' : '');	var s = "'"+s.substring(0,30)+elipsis+"' <--- "; var i = 0;	for(; i<stack.length; i++){ s+=stack[i].operator+stack[i].name+(stack[i].popstack?'(pop)':'')+" "; } return s; })()	);

		atom = stack.pop();

		if(atom.extract){ // terminal
			matches = atom.extract.exec(script);
			if(matches != null){
			    var len = matches[0].length;
				script = script.slice(len);
				if(atom.keep){
					treestack[treestack.length-1].push([atom.name, matches[1]]);
				}
				if(atom.operator == "*" || atom.operator == "+"){ 
					atom.operator = "*";
					stack.push(cloneAtom(atom)); 
				}
			}
			else{
				if(atom.operator != "*"){
					success = false;
				}
				else{
					if(atom.popstack){
						treestack.pop(); // because this was an optional item!
					}
				}
			}
		}

		else{ // non-terminal 

			rule = function(pr){
				for(p in pr){ if(pr[p].test(script)){ return p; } }
				return false;
			}(atom.predictions);

			if(rule !== false){ // no rule matched the incoming script!
				if(atom.operator == "*" || atom.operator == "+"){ 
					atom.operator = "*";
					stack.push(cloneAtom(atom)); 
				}
				matchedrule = atom.rules[rule];
				for(var i=matchedrule.length-1; i>=0; i--){
					ruleatom = cloneAtom(grammar[matchedrule[i].name]);
					ruleatom.operator = matchedrule[i].operator;
					ruleatom.popstack = false; // by default, we don't pop the script stack after a match
					if(i==matchedrule.length-1 && atom.keep){
						ruleatom.popstack = true; // last atom in rule pops the script stack if this is an atom that we keep
					}
					stack.push(ruleatom);
				}
				newatom = [atom.name];
				if(atom.keep){
					treestack[treestack.length-1].push(newatom);
					treestack.push(newatom);
				}
			}
			else{
				if(atom.operator != "*"){ 
					success = false; 
				}
				else{
					if(atom.popstack){
						treestack.pop(); // because this was an optional item!
					}
				}
			}
		}


		if(atom.popstack && atom.operator != "*" && atom.operator != "+"){
			treestack.pop();
		}

	}

	// we're out of atoms on the stack, there better not be any script left!
	success &= (/\S/.test(script) ? false : true );

	if(!success){
		return {"success":false, "script":script, "stack":stack, "atom":atom.name};
	}

	return {"success":true, "tree":tree};

	function cloneAtom(a){
		var c = {};
		for(attr in a){ // since we are in control of the atom object, it's safe to copy this way
			c[attr] = a[attr];
		}
		return c;
	}
}
