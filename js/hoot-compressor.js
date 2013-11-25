
/*

This is the compressor which is used to reduce the size of the game 'build'
output considerably.  The tool compresses the game build, and a minified copy
of everything here except hootCompress() is in examplegame.html so that the
game can be decompressed before it is played.

The dictionary compression approach is very fast and quite effective.
Results of a small sample script are:

	Game source: 2169
	Game: 2606 (-20% vs src)
	Compressed: 1620 (25% vs src, 38% vs 'orig' build)
	Decompressed same?: true

*/


// minification starts here...


// The Compression Dictionary - see comments below about its creation
// -----------------------------------------------------------------------------
var dict = ["\"],[\"break\",\"__\"],[\"string\",\"", "[[\"script\",[\"func\",[\"name\",\"", "\"],[\"print\",[\"string\",\"", "\"]]],[\"func\",[\"name\",\"", "\"],[\"break\",\"__\"]", "[\"func\",[\"name\",\"", "\"],[\"string\",\"", " \"],[\"link\",\"", ",[\"string\",\"", "\"],[\"link\",\"", "\",[\"name\",\"", "[[\"script\"", " of the ", " through", "start", " of the", " of th", " that ", " with ", " your ", ". The ", "n the ", " and ", " are ", " for ", " the ", " The ", " with", " you ", " You ", ". The", "\"],[\"", "]],[\"", "h you", "ight ", "n the", "s the", "s you", " and", " are", " for", " in ", " is ", " of ", " the", " The", " to ", " whe", " you", " You", ". Th", "\"]]]", "],[\"", "and ", "e th", "hat ", "ight", "ing ", "ion ", "ith ", "k\",\"", "me\",", "n th", "our ", "r po", "s of", "s th", "t th", "ter ", "The ", "You ", " a ", " A ", " an", " ar", " as", " be", " bo", " ca", " co", " di", " do", " dr", " fo", " fr", " ha", " he", " in", " is", " it", " li", " ma", " mi", " no", " of", " on", " pa", " po", " re", " ro", " se", " st", " th", " Th", " to", " wa", " wh", " wi", " wo", "'s ", ",[\"", ". ", ". T", "\",\"", "\"]]", "]]]", "ain", "al ", "all", "and", "ant", "ard", "are", "as ", "at ", "ate", "ce ", "ch ", "ck ", "cke", "d b", "d t", "d. ", "e a", "e b", "e c", "e f", "e i", "e o", "e p", "e r", "e s", "e t", "e w", "e. ", "ead", "ear", "eat", "ed ", "en ", "ent", "er ", "ere", "ers", "es ", "est", "f t", "for", "fun", "ght", "hat", "he ", "her", "hin", "his", "igh", "ill", "in ", "ine", "ing", "int", "ion", "is ", "ite", "ith", "ive", "ke ", "le ", "ll ", "ly ", "n t", "nd ", "ne ", "ng ", "nt ", "o t", "of ", "on ", "one", "or ", "ou ", "oun", "our", "ow ", "per", "pla", "r t", "r. ", "rd ", "re ", "rea", "res", "s a", "s o", "s t", "s. ", "se ", "st ", "t a", "t l", "t o", "t t", "t. ", "te ", "ter", "th ", "the", "The", "thi", "to ", "ts ", "tur", "und", "ur ", "ure", "use", "ut ", "ve ", "ver", "wit", "wor", "y a", "You", "you", "run", "\"]", "\\", "\""];
// -----------------------------------------------------------------------------

// currently this allows for 300-something dictionary entries - the above list is 235
var hootCompressionCode = [];
for(var i=164; i<167; i++){  // ¤¥¦
	for(var j=35; j<127; j++){
		if(j==92){ continue; } // the backslash will cause string trouble!
		hootCompressionCode.push(String.fromCharCode(i,j));
	}
}

function rot13(script){ // http://stackoverflow.com/a/5353260/695615
	return script.replace(/[a-zA-Z]/g, function(c) {
    	return String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
  	});
}




// =============================================================================
// The decompressor will be minified and included with the examplegame.html
// page, along with a minified copy of the dictionary, code table, and rot13.
// =============================================================================

function hootDecompress(script){
	script = rot13(script);
	for(var i=dict.length-1; i>=0; i--){ // see note below about reverse order
		// we can't use replace() because it only replaces globaly with
		// regular expressions - and we definitely can't use our dictionary
		// entries as regular expressions (and if they were modified so that
		// we could, they would not be reversible back to the original strings!)
		script = script.split(hootCompressionCode[i]).join(dict[i]);
	}
	return script;
}


// ...and ends here


// =============================================================================
// The compressor is called directly from here by hoot-builder.js when building
// the game output.
// =============================================================================
function hootCompress(script){
	for(d in dict){
		// see note above about why we can't just use replace
		script = script.split(dict[d]).join(hootCompressionCode[d]);	
	}
	return rot13(script);
}




/*

A note about the decompression running through the dictionary on reverse order
when deompressing:

It's completely possible for a replacement to match the results of a previous
replacement, totally corrupting the output.  For example, given these two
replacements:

	replace 'oo' with '$ee'
	replace 'ee ba' with '$xx'

Now imagine the string "foo bar fee bar" being replaced with these two replacements.
It would be corrupted if we were to undo the replacements in the same order, but
completely fine if we undid the replacements in the reverse order.



A note about the dictionary.

The common strings were created using hoot-create-dictionary.html 
to extract commonly-used strings from some representative text.  Namely:

Some sample Hootscript games produced these common strings:
	Settings:
	var max_likely_string_len = 100;
	var min_string_len = 3;
	var min_frequency = 5;
--------------------------------------------------------------------------------
",[\"", "\",\"", "],[\"", "ing", " you", "tri", ",[\"string\",\"", "the", "ou ", " the", "he ", " of", " a ", "k\",\"", " to", " of ", "\"],[\"string\",\"", "nd ", " the ", " your ", "to ", "and", " to ", " an", "re ", "e t", "rea", "]]]", " you ", "int", "and ", "me\",", "You", " and ", " po", "\",[\"name\",\"", "\"],[\"link\",\"", "\"]]", "fun", "ed ", "You ", "\"],[\"print\",[\"string\",\"", "\"]]]", ",[\"func\",[\"name\",\"", "e a", "er ", " be", "ing ", "]],[\"", ".  ", "y a", "ve ", "\"]", "\"],[\"string\",\"", "ith", "t a", "e w", "\"]]],[\"func\",[\"name\",\"", "e th", " ar", " li", " \"],[\"link\",\"", "her", "\"],[\"", "ight", "ter", "at ", "e o", "on ", " co", "\"],[\"break\",\"__\"]", "st ", "cke", "th ", "for", "ead", " are", " se", "ll ", "h you", "s t", "r t", "t o", "f t", "ate", "ere", "one", " through", "\"],[\"break\",\"__\"],[\"string\",\"", "s you", "r po", "is ", "ight ", "pla", "t l", ", you", "ain", "e s", "or ", " are ", " whe", " wo", " with ", " that ", " You ", " pa", "ly "
--------------------------------------------------------------------------------


A massaged copy of the Return to Zork script produced these common strings:
	Settings:
	var max_likely_string_len = 10;
	var min_string_len = 3;
	var min_frequency = 30;
--------------------------------------------------------------------------------
"he ", " th", "the", " the", " the ", "ing", " of", "   ", "of ", " of ", "ng ", "ed ", "ing ", " Th", " to", "nd ", "The", " The", "to ", "er ", " in", "re ", "The ", " The ", "ou ", " to ", " an", "is ", "at ", " a ", "and", "in ", "es ", "    ", ". T", "st ", " you", "ll ", "th ", " You", "s. ", "and ", " wi", "on ", "en ", "e t", " be", "ter", " in ", " and", " and ", ".  ", "e. ", "s t", "n t", " is", " fo", ". Th", "or ", " is ", " You ", " re", " ma", "d t", "ts ", " ha", "ck ", "her", "e o", "hat", "e a", "le ", "for", " on", "ion", "all", "f t", " of th", ". The", "ve ", " st", " of the", "n th", " wa", " co", "as ", "ow ", "se ", " of the ", "t t", "ith", "ent", "ut ", "ly ", "ver", " for", "ere", "hat ", "e i", "ers", "n the", " you ", "our", "ill", "ate", ". The ", " ca", "s o", "tur", "ce ", "s a", "e s", "ear", "wit", " with", "ith ", "e b", "n the ", "d. ", "res", "und", "e w", " wh", "oun", "t a", "ite", "e r", "rd ", " with ", " no", "e f", "t. ", "ard", "s th", "eat", "are", "al ", "ch ", " bo", " A ", "ine", "use", "     ", "ur ", "his", " fr", " do", "our ", "te ", "igh", "ive", "hin", "wor", "est", "e p", "nt ", "d b", "ght", " it", " ar", "e th", "ne ", "r. ", "ure", " as", " di", " mi", "s the", "t th", "thi", "e c", "ead", "ke ", "per", "'s ", " , ", "o t", "s of", "t o", "ter ", "ant", " dr", " he", "ight", "ion ", " for ", " ro", " Ca", "ound", "ock", "are ", "ar ", "rea", " Mo", " Tr", " In", "ope", "om ", "e of", "an ", "der", "ood", "out", "ste", "s the ", "tha", "ave", "d th", "rin", " Sh", "ore", "ome", "s of ", "to t", "e d", "eve", "rou", "r t", "rs ", "ry ", "han", " pr", " pl", " so", " mo", "ous", ...
--------------------------------------------------------------------------------

 */

