
/*

This is the grammar for Hootscript.  This script also makes some transformations
to the grammar so that it contains predictions (instead of a separate prediction
table as you might expect).

This grammar is used by the Hoot parser to transform scripts into games.

*/


function getGrammar(){



    // the grammar
    // =====================================================================


    var grammar = {
        "script":   { rules: "+func",                                       keep:true },
        "func":     { rules: "name colon +expr",                            keep:true },
        "expr":     { rules: "print | assign | ifseq | runme | incr | decr"           },
        "print":    { rules: "qopen *qinnards qclose",                      keep:true },
        "assign":   { rules: "set name to num",                             keep:true },
        "qinnards": { rules: "strname | upname | break | link | string"               },
        "ifseq":    { rules: "if value test value then +expr *elseseq end", keep:true },
        "elseseq":  { rules: "else +expr",                                  keep:true },
        "test":     { rules: "eq | lt | gt | de"                                      },
        "value":    { rules: "name | num"                                             },
        "cond":     { rules: "if value test value then +expr",              keep:true },
        "runme":    { rules: "run name",                                    keep:true },
        "incr":     { rules: "increase name",                               keep:true },
        "decr":     { rules: "decrease name",                               keep:true },
        "colon":    { lookahead: /^:/,        extract: /^(:)\s*/                      },
        "name":     { lookahead: /^\[/,       extract: /^\[([^[_]+?)\]\s*/, keep:true },
        "num":      { lookahead: /^\d/,       extract: /^(\d+)\s*/,         keep:true },
        "eq":       { lookahead: /^e/,        extract: /^(equals)\s*/,      keep:true },
        "lt":       { lookahead: /^l/,        extract: /^(less than)\s*/,   keep:true },
        "gt":       { lookahead: /^g/,       extract: /^(greater than)\s*/, keep:true },
        "de":       { lookahead: /^d/,      extract: /^(doesn't equal)\s*/, keep:true },
        "set":      { lookahead: /^s/,        extract: /^(set)\s*/                    },
        "to":       { lookahead: /^t/,        extract: /^(to)\s*/                     },
        "if":       { lookahead: /^if/,       extract: /^(if)\s*/                     },
        "then":     { lookahead: /^t/,        extract: /^(then)\s*/                   },
        "else":     { lookahead: /^el/,       extract: /^(else)\s*/                   },
        "end":      { lookahead: /^en/,       extract: /^(end)\s*/                    },
        "run":      { lookahead: /^r/,        extract: /^(run)\s*/                    },
        "increase": { lookahead: /^in/,       extract: /^(increase)\s*/               },
        "decrease": { lookahead: /^de/,       extract: /^(decrease)\s*/               },
        "qopen":    { lookahead: /^\//,       extract: /^(\/)/                        },
        "qclose":   { lookahead: /^\//,       extract: /^(\/)\s*/                     },
        "string":   { lookahead: /^[^[_\/^]/, extract: /^([^[_\/^]+)/,      keep:true },
        "link":     { lookahead: /^_/,        extract: /^_([^_]+?)_/,       keep:true },
        "break":    { lookahead: /^__/,       extract: /^(__)/,             keep:true },
        "strname":  { lookahead: /^\[/,       extract: /^\[([^[]+?)\]/,     keep:true },
        "upname":   { lookahead: /^\^\[/,     extract: /^\^\[(.+?)\]/,      keep:true }
    };




    // massage the grammar
    // =====================================================================

    for(var g in grammar){ 
        atom = grammar[g];
        atom.name = g; // store its name inside itself
        atom.operator = ""; // default

        if(atom.rules){
            // split alternative rules
            atom.rules = atom.rules.split(" | ");
            for(r in atom.rules){
                // split rule into atoms
                atom.rules[r] = atom.rules[r].split(" ");
                for(x in atom.rules[r]){
                    // look for + and * operators on atoms
                    ratom = atom.rules[r][x];
                    firstchar = ratom[0];
                    if(firstchar == "+" || firstchar == "*"){
                        ratom = ratom.slice(1);
                    }
                    else{
                        firstchar = "";
                    }
                    atom.rules[r][x] = {
                        "name": ratom,
                        "operator":firstchar
                    }
                }
            }
        }
    }


    // now go through again and make predictions
    for(var g in grammar){ 
        atom = grammar[g];

        if(atom.rules){
            atom.predictions = [];
            for(r in atom.rules){
                atom.predictions.push(getprediction(atom.rules[r][0].name));
            }
        }
    }

    function getprediction(atom){
        if(!grammar[atom]){ alert("Bad Grammar!  Couldn't find '"+atom+"'."); }
        if(grammar[atom].rules){
            return getprediction(grammar[atom].rules[0][0].name);
        }
        return grammar[atom].lookahead;
    }




    return grammar;
}
