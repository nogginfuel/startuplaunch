
/*

This is a Madlibs-style random Hootscript generator.  It is only used to display
a sample script when somebody clicks on the link in hoot.html.

*/



function generateExampleScript(){
	function madness(x){
		return x[Math.floor(Math.random() * x.length)];
	}



	var place = madness([
		 "a beautiful forest"
		,"a sewage treatment plant"
		,"the secret druidic ruin"
		,"a vast parking lot"
	]);

	var day = madness([
		 "balmy like a jungle"
		,"cold as the arctic"
		,"generally quite acceptable in terms of temperature and humidity"
	]);

	var thoughts = madness([
		 "the old man you had run over with your car yesterday"
		,"donating to charity"
		,"trying your hand at living off the land"
		,"celery"
		,"animal husbandry"
	]);

	var food = madness([
		 "a ham sandwich"
		,"an apple (which fell from the greatest apple tree in all of the forest and is thought to have incredible magic power)"
		,"a bowl of soup"
		,"a human head"
	]);

	var adjective = madness([
		 "mighty"
		,"slippery"
		,"tainted"
	]);

	var item = madness([
		 "sword"
		,"Staff of Eternal Light"
		,"cat"
		,"guide to the underworld (with all of the really naughty pages bookmarked)"
		,"rock"
	]);

	var reason = madness([
		 "keeping the demons at bay"
		,"lighting your way"
		,"helping you calm yourself (and concentrate on something positive when the evil powers test your already questionable sanity to the point of breaking)"
	]);

	var action = madness([
		 "figure out the great mystery of the purpose of life"
		,"decide to become celibate"
		,"uncover a vast fortune underground which will lead you to a life of great opulence and eternal fame"
		,"eat a burrito"
		,"have some life-changing experience so profound that you will decide to change your name to 'Cool Wind Hammer'"
		,"eat enormous quantities of cheese"
	]);

	var adjective2 = madness([
		 "insane"
		,"bug-eyed"
		,"flea-bitten"
		,"beautiful"
		,"dirty and foul-smelling"
	]);

	var creatures = madness([
		 "wolves"
		,"sheep"
		,"manatees in protective land-going suits"
		,"robots"
		,"druids"
	]);

	var items = madness([
		 "poisoned knives"
		,"scrolls enchanted with powerful destructive spells"
		,"flutes"
		,"guns"
	]);

	var place2 = madness([
		 "cave"
		,"car dealership"
		,"bean cannery"
	]);

	var action = madness([
		 "find a place to relieve your bladder"
		,"knit a sweater very quickly"
		,"assume everything will be fine"
	]);

	var profession = madness([
		 "a drug dealer"
		,"a dental hygienist"
		,"a marine biologist"
		,"an accountant"
		,"a teen horse exorcist"
		,"a cat behavior historian"
	]);

	var beastlike = madness([
		 "an enraged mother bear"
		,"a badger with lava for blood and red coals for eyes"
		,"a duck inside another duck"
		,"all of the martial artists of the world compacted into a sphere of energy and shot out of a cannon into space"
	]);

	var defeated = madness([
		 "extremely dead"
		,"severely wounded and tending to their hurts"
		,"at odds with their own self-images of their abilities and left to contemplate a different sort of existence, perhaps one free of violence and friction"
		,"bleeding, but surprisingly pleased to have finally been beaten after many years of monotonous victory"
	]);

	var mentorwords = madness([
		 "The path of least resistance is a slippery slope to a pit with lots of things that are hard to hold onto."
		,"Never leave that light on. It uses too much electricity."
		,"You can't learn to paint with these poor quality brushes.  Look at all of these bristles! It's a mess.  In fact, the heck with all of this. Let's get some lunch."
		,"Someday all of this will seem funny."
	]);



	// the script
	// for the sake of all that is holy, turn on wordwrap to view this.
	// or better yet, just see it in the gamebuilder
	return "[start]:\n/You are walking through "+place+".  The day is "+day+", but you find yourself thinking of "+thoughts+".  You've packed light and have just "+food+" to eat and a "+adjective+" "+item+" for "+reason+".\n__\nYou ponder the narrow path before you.  You wonder where it will lead.  Perhaps before the day is through, you'll "+action+". After a pause to contemplate this, you resume walking.  _Let's see where that leads you_./\n\n[Let's see where that leads you]:\n/Without warning, you are attacked by a pack of "+adjective2+" "+creatures+" with "+items+"!  They appear to have come from a nearby "+place2+". You will need to either _fight like a beast_ with the "+item+" or _"+action+"_./\n\n\n[fight like a beast]:\n/You confront the "+creatures+" head-on with your "+item+" gripped firmly in your fists like "+beastlike+".  The battle is brief and extraordinarily violent, but ends with you standing in triumph and your enemies "+defeated+".\n__\nYou have won!  Masterfully done!/\n\n\n["+action+"]:\n/Having been "+profession+" for most of your life, you reason that the best course of action is to "+action+".  Unfortunately, the "+creatures+" are upon you too quickly and they are far too "+adjective2+" for your tactic to work!  You scream as they use their "+items+" upon your face and neck area!  You are dying.\n__\nAs the lights fade out and you drift off to the next plane of existence, you hear the voice of your mentor one last time saying, \""+mentorwords+"\"\n__\nOh dear. Perhaps you would like to _try again_?/\n\n\n[try again]:\n/Good idea.  Let's give that another shot.__/\nrun [Let's see where that leads you]\n";
}

