/*

This script is responsible for turning games into the structures seen on the 
structure tab.

*/

function getPrettyStructure(tree){

	if(is_array(tree[0])){ return getPrettyStructure(tree[0]); }

	switch(tree[0]){

		case "script": 
			return getThePrettyRest(tree);

		case "func": 
			funcname = tree[1][1];
			return "<div class=\"disp-func\">"
				+"<span class=\"funcname\">"+funcname+"</span>"
				+"<div class=\"disp-func-inner\">"+getThePrettyRest(tree,2)+"</div></div>";

		case "assign":
			first = tree[1][1];
			second = tree[2][1];
			return "<span class=\"disp-statement\">set <span class=\"disp-var\">"+first+"</span> to <span class=\"disp-var\">"+second+"</span></span><br>";

		case "print":
			return "<div class=\"disp-print\">"+getThePrettyRest(tree)+"</div>";

		case "string":
			return tree[1];

		case "link":
			return "<u>"+tree[1]+"</u>";

		case "upname":
			return "<b>^"+tree[1]+"</b>";

		case "strname":
			return "<b>"+tree[1]+"</b>";

		case "break":
			return "<br><b>&#8212;</b><br>";

		case "ifseq":
			test1 = tree[1][1];
			test = tree[2][1];
			test2 = tree[3][1];
			return "<div class=\"disp-if\">"
					+"<span class=\"disp-if-test\">if <span class=\"disp-var\">"+test1+"</span> "
					+test+" <span class=\"disp-var\">"+test2+"</span></span>"
					+"<div class=\"disp-if-inner\">"+getThePrettyRest(tree,4)+"</div></div>";	

		case "elseseq":
			return "</div></div><div class=\"disp-if\"><span class=\"disp-if-test\">else </span><div class=\"disp-if-inner\">"+getThePrettyRest(tree);

		case "incr":
			name = tree[1][1];
			return "<span class=\"disp-statement\">increase <span class=\"disp-var\">"+name+"</span></span><br>";

		case "decr":
			name = tree[1][1];
			return "<span class=\"disp-statement\">decrease <span class=\"disp-var\">"+name+"</span></span><br>";

		case "runme":
			name = tree[1][1];
			return "<span class=\"disp-statement\">run <span class=\"disp-var\">"+name+"</span></span><br>";


		default: 
			return "<span class=\"disp-unk\">unknown thing '"+tree[0]+"'</span><div  class=\"disp-func\">"+getThePrettyRest(tree)+"</div>";
	}
}

function getThePrettyRest(tree, startwith){
	var o="";
	var i = startwith ? startwith : 1;
	for( ; i<tree.length; i++){
		o += getPrettyStructure(tree[i]);
	}
	return o;
}



function is_array(thing){
	return Object.prototype.toString.apply(thing) == '[object Array]';
}
