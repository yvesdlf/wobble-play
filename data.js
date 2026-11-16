/* Wobble activity library and plan logic. No DOM access in this file. */
var SKILLS = {
  focus: "Staying with one thing",
  patience: "Waiting and turn-taking",
  impulse: "Pausing before acting",
  frustration: "Handling “I can’t do it”",
  switching: "Switching between activities",
  calm: "Calming the body"
};
var QUIZ_AREAS = ["focus", "patience", "impulse", "frustration", "switching"];
var AGE_N = { "3-4": 4, "5-6": 6, "7-9": 8, "10+": 10 };

var ACTS = [];
function A(id, name, skill, min, max, mins, need, go, steps, easier, harder) {
  ACTS.push({ id: id, name: name, skill: skill, min: min, max: max, mins: mins, need: need, go: go, steps: steps, easier: easier, harder: harder });
}

/* ---------- Focus ---------- */
A("tray", "Treasure tray", "focus", 3, 12, 5, "A tray, a tea towel, 5 to 10 small objects", false,
  ["Put five objects on the tray and name them together.", "Look for 20 seconds, then cover the tray with the towel.", "Take one object away in secret. Lift the towel: what went missing?", "Swap roles so your child hides one from you."],
  "Use three objects and let your child touch each one first.", "Use ten objects and remove two, or rearrange them and ask what moved.");
A("soundhunt", "Sound hunt", "focus", 3, 12, 3, "Nothing", true,
  ["Sit still together and close your eyes.", "Listen for one minute without talking.", "Open your eyes and take turns naming every sound you heard.", "Count them. Try to beat the number next time."],
  "Listen for 20 seconds and find just three sounds.", "Listen for two minutes and put the sounds in order from nearest to farthest.");
A("spotchange", "Spot the change", "focus", 4, 12, 5, "Nothing", true,
  ["Your child studies you carefully for 30 seconds.", "They turn around while you change three small things: roll a sleeve, move a watch, untuck a collar.", "They turn back and find all three.", "Swap roles."],
  "Change one big thing, like taking off a shoe.", "Change five small things, or do it with a shelf of objects.");
A("threading", "Pattern threading", "focus", 3, 7, 10, "String or a shoelace, dry pasta tubes or beads in two or three colours", false,
  ["Lay out a short pattern: red, blue, red, blue.", "Your child threads the same pattern onto the string.", "Ask what comes next and let them carry on for ten more.", "Wear it as a necklace until dinner."],
  "Use big pasta tubes and a two-colour pattern.", "Use three colours and a longer rule, such as two red, one blue, one green.");
A("suitcase", "The growing suitcase", "focus", 5, 12, 5, "Nothing", true,
  ["Start with: I packed my suitcase and in it I put a toothbrush.", "Your child repeats your sentence and adds one more thing.", "Keep going, each person repeating the whole list before adding.", "The game ends when someone forgets an item. Count how far you got."],
  "Stop at five items and act each one out with a gesture.", "Every item must start with the next letter of the alphabet.");
A("dictation", "Draw what I say", "focus", 5, 12, 10, "Paper and pencils for both of you, something to hide your drawing", false,
  ["Draw a simple picture in secret: a house, two trees, a sun.", "Describe it one step at a time while your child draws what they hear.", "No peeking and no pointing, only words.", "Compare the two pictures, then swap so your child gives the instructions."],
  "Use three shapes only: a circle, a square, a line.", "Add positions and sizes: a small triangle in the top left corner.");
A("coinspin", "Spinning coin", "focus", 3, 8, 3, "A coin and a hard table", false,
  ["Spin the coin on the table.", "Both of you watch it without speaking or moving until it lies completely flat.", "Guess how many seconds it will spin next time, then count together.", "Let your child be the spinner."],
  "Watch a rolling ball come to a stop instead.", "Spin two coins and keep your eyes on only one.");
A("threesteps", "Three-step mission", "focus", 3, 9, 5, "Things already in the room", false,
  ["Give a mission with three parts: touch the door, bring me a spoon, then sit on the blue cushion.", "Your child repeats the mission back before starting.", "They do all three in order without reminders.", "They give you a mission next, and check you did it right."],
  "Give two parts and point as you say them.", "Give five parts, or add a rule such as hopping between each one.");
A("mirror", "Mirror me", "focus", 3, 10, 5, "Nothing", false,
  ["Stand face to face, about an arm apart.", "Move very slowly: lift a hand, tilt your head, bend a knee.", "Your child copies as if they were your reflection.", "After a minute, call swap and they lead."],
  "Use only arm movements while sitting down.", "Do it in total silence, and try to make it impossible for a watcher to tell who is leading.");

/* ---------- Patience ---------- */
A("slowrace", "Slow-motion race", "patience", 3, 12, 5, "A clear stretch of floor", false,
  ["Mark a start line and a finish line.", "Race to the finish in slow motion. The last one to arrive wins.", "Anyone who stops moving completely goes back to the start.", "Play again walking backwards."],
  "Make the track only a few steps long.", "Balance a soft toy on your head while you race.");
A("oneblock", "One block each", "patience", 3, 8, 10, "Building blocks", false,
  ["Build one tower together, taking turns to add a single block.", "Before you place a block, both count to three out loud.", "Hands stay in laps while it is the other person's turn.", "See how tall it gets before it falls, then count the blocks."],
  "Skip the counting and just take turns.", "Count to five in a whisper, and place each block with the hand you don't write with.");
A("statues", "Statue museum", "patience", 4, 10, 5, "Nothing", false,
  ["Your child chooses a statue pose and holds it.", "You are the museum guard. Walk around and try to make the statue laugh without touching.", "The statue tries to stay still for 30 seconds.", "Swap roles."],
  "Hold the pose for ten seconds.", "Hold for a full minute while balancing on one leg.");
A("growjar", "Bean in a jar", "patience", 3, 12, 5, "A clear jar, kitchen paper or cotton wool, a dried bean, water", false,
  ["Line the jar with damp kitchen paper and tuck a bean between the paper and the glass.", "Put it on a windowsill and draw what it looks like today.", "Check it once a day at the same time and add a little water.", "Draw it again every third day. Talk about how slow change still counts."],
  "Just look and water. Skip the drawing.", "Keep a measuring chart, and guess the height before each check.");
A("talkingspoon", "Talking spoon story", "patience", 4, 12, 5, "A wooden spoon or any object to pass", true,
  ["Only the person holding the spoon may speak.", "Start a story with one sentence and pass the spoon.", "Each person adds one sentence and passes it on.", "After ten passes, the holder gives the story an ending."],
  "Each person adds just one word.", "Every sentence must include a word chosen by the previous speaker.");
A("waitjar", "The waiting minute", "patience", 3, 9, 5, "A timer", false,
  ["Tell your child that after the timer rings they choose the next game.", "Set the timer for one minute. Wait together with nothing in your hands.", "Talk about what waiting felt like in the body.", "Tomorrow, add 30 seconds."],
  "Start with 30 seconds and count down the last ten aloud.", "Wait three minutes and let your child decide what helps the time pass.");
A("slowspy", "Slow I-spy", "patience", 4, 10, 5, "Nothing", true,
  ["Choose something you can both see and give one clue.", "Your child must count to five silently before guessing.", "Give a new clue after each wrong guess.", "Swap after three objects."],
  "Use colours only, and count to three.", "Give clues about what the object is used for, never what it looks like.");
A("icerescue", "Ice rescue", "patience", 3, 8, 15, "A small plastic toy frozen in a tub of water the night before, a bowl of warm water, a spoon", false,
  ["Show your child the toy trapped in the ice.", "They rescue it by spooning warm water over the ice, a little at a time.", "No smashing. Notice together how the ice changes.", "Celebrate the rescue and freeze a new toy for another day."],
  "Freeze the toy in a thin layer so it comes free in a few minutes.", "Freeze three toys in layers and rescue them in order.");
A("dice20", "Dice to twenty", "patience", 5, 12, 10, "One die, paper and pencil", false,
  ["Take turns rolling the die and adding the number to your own score.", "While the other person rolls, your job is to keep their score.", "First to exactly twenty wins. If a roll takes you over, you wait.", "Shake hands and play again."],
  "Play to ten and use counters instead of writing.", "Play to fifty with two dice, and choose whether to add or subtract each roll.");

/* ---------- Impulse ---------- */
A("opposite", "Opposite leader", "impulse", 4, 12, 5, "Nothing", false,
  ["The leader calls an action: hands up.", "Everyone does the opposite: hands down.", "Try walk and stop, loud and quiet, fast and slow.", "Swap the leader every three calls."],
  "Use only two pairs: up and down, stop and go.", "The leader does one action while saying another. Follow the words, not the body.");
A("trafficlights", "Traffic lights", "impulse", 3, 9, 5, "Space to move. Coloured paper helps but is optional", false,
  ["Stand at one end of the room while your child stands at the other.", "Green means walk towards you, red means freeze.", "Add yellow for slow motion and purple for hopping.", "Whoever reaches the caller becomes the next caller."],
  "Use only green and red, and hold up coloured paper as you call.", "Call the colours quickly, and sometimes call the same colour twice.");
A("freezedance", "Freeze dance", "impulse", 3, 10, 5, "Music you can pause", false,
  ["Dance together while the music plays.", "When it stops, freeze like a statue until it starts again.", "Anyone who wobbles does three star jumps and rejoins.", "Let your child control the music for the next round."],
  "Freeze for just two seconds.", "Freeze in a named shape: low, tall, on one leg.");
A("headtoes", "Head, toes, mix-up", "impulse", 3, 7, 5, "Nothing", false,
  ["Practise touching your head when you hear head and your toes when you hear toes.", "Now switch the rule: head means touch toes, toes means touch head.", "Call them slowly at first, then mix up the order.", "Laugh at the slips and keep going."],
  "Keep the normal rule but go faster and faster.", "Add shoulders and knees as a second swapped pair.");
A("drumecho", "Drum echo", "impulse", 3, 8, 5, "Two pots or boxes and wooden spoons", false,
  ["Tap a short rhythm. Your child waits until you finish, then copies it.", "Play loud, then very quiet.", "When you lift your spoon in the air, all drumming stops at once.", "Swap so your child sets the rhythm and the stop signal."],
  "Tap just two or three beats.", "Play a rhythm with a silent gap in the middle that must be copied too.");
A("yesno", "No yes, no no", "impulse", 6, 12, 5, "Nothing", true,
  ["Ask your child quick questions for one minute.", "They must answer truthfully without saying yes or no.", "Count how many questions they get through before slipping.", "Swap and let them try to catch you."],
  "Ban only the word yes.", "Also ban nodding, shaking the head, and the word maybe.");
A("colourclap", "Colour clap", "impulse", 5, 12, 5, "A deck of playing cards", false,
  ["Turn the cards over one at a time onto a pile.", "Clap only when the new card is the same colour as the one before.", "A clap at the wrong moment gives the pile to the other player.", "Play through half the deck, then swap dealer."],
  "Clap for every red card.", "Clap for the same suit, and stay silent on any picture card.");
A("bubblerules", "Bubble rules", "impulse", 3, 7, 5, "Bubble mixture and a wand", false,
  ["Blow bubbles and let your child pop them all.", "New rule: pop with one finger only.", "New rule: pop only the biggest bubble.", "Last rule: hands behind your back and pop none for ten seconds."],
  "Use two rules: pop them all, then pop none.", "Pop only bubbles that are below your knees.");
A("buzz", "Buzz counting", "impulse", 7, 12, 5, "Nothing", true,
  ["Count upwards, taking turns to say the next number.", "Instead of any multiple of three, say buzz.", "A slip sends you both back to one.", "See how high you can get together."],
  "Say buzz on every number ending in five.", "Buzz on multiples of three and on any number containing a three.");

/* ---------- Frustration ---------- */
A("wobblytower", "Wobbly tower", "frustration", 3, 10, 10, "Building blocks", false,
  ["Build a tower using only the hand you don't write with.", "When it falls, both say oops, again, and take a slow breath.", "Rebuild it one block higher than before.", "Stop after three rebuilds and name what got easier."],
  "Use both hands and large blocks.", "Build on a cushion so the base is unsteady.");
A("wronghand", "Wrong-hand portraits", "frustration", 4, 12, 10, "Paper and pencils", false,
  ["Draw each other using the hand you don't normally draw with.", "No rubbing out. Lines that go wrong stay in.", "Swap pictures and say one thing you like about the other drawing.", "Sign them with the same wrong hand."],
  "Draw a simple smiley face instead of a portrait.", "Draw with your eyes closed as well.");
A("knots", "Tricky knots", "frustration", 5, 12, 10, "A length of rope or thick shoelace", false,
  ["Tie three loose knots in the rope while your child looks away.", "They untie them one at a time and rate each from one to five for difficulty.", "Agree a hint signal. Using it is a smart move, not a loss.", "Swap and let them tie knots for you."],
  "Tie one very loose knot.", "Tie the knots tighter, or untie them wearing gloves.");
A("mistakeoftheday", "Mistake of the day", "frustration", 4, 12, 5, "Nothing", true,
  ["At dinner or in the car, share one mistake you made today.", "Say what happened next and what you would try differently.", "Invite your child to share one. Listen without fixing it.", "Finish with a high five for trying."],
  "You share yours and your child only listens.", "Each person also names one thing that is still hard, and a next step for it.");
A("yetjar", "The yet jar", "frustration", 5, 12, 10, "A jar, slips of paper, a pen", false,
  ["Talk about things each of you can't do yet.", "Write each one on a slip, ending with the word yet, and put it in the jar.", "Choose one slip and plan a tiny first step for this week.", "Open the jar every Sunday and move finished slips to the fridge door."],
  "Draw the thing instead of writing it.", "Add a date to each slip and guess how long it will take.");
A("planelab", "Paper plane lab", "frustration", 5, 12, 15, "Several sheets of paper, tape to mark a start line", false,
  ["Fold one paper plane each and throw from the line. Mark where it lands.", "Change exactly one thing: the wing fold, the nose, the throw.", "Throw again and compare. A worse flight still tells you something.", "Run five trials and keep the best design."],
  "Fold the plane together and just test different throws.", "Measure each flight and write the results in a table.");
A("cupstack", "Beat your own time", "frustration", 4, 12, 10, "Six plastic or paper cups, a timer", false,
  ["Stack the cups into a pyramid, then back into one pile, while you time it.", "Write down the time. It is the only score that matters.", "Try three more times, each time trying to beat your own time.", "If the stack falls, the clock keeps running. Rebuild and carry on."],
  "Use three cups.", "Use ten cups, or stack with one hand.");
A("beanbagwalk", "Beanbag balance walk", "frustration", 3, 9, 5, "Tape or a skipping rope for a line, a beanbag or rolled socks", false,
  ["Lay a line along the floor.", "Walk it heel to toe with the beanbag on your head.", "When it drops, stop, breathe out slowly, put it back, and continue from that spot.", "Count the drops, then try for one fewer."],
  "Walk the line with the beanbag held on a flat hand.", "Walk it backwards, or carry a spoon with a ball as well.");
A("thermometer", "Feelings thermometer", "frustration", 5, 12, 15, "Paper and coloured pens", false,
  ["Draw a tall thermometer and number it from one at the bottom to five at the top.", "Together, describe what each level feels like, from calm to about to explode.", "Next to each level, write one thing that helps at that point.", "Stick it where you can both point to it during the week."],
  "Use three levels with a face drawn for each.", "Add what other people can see at each level, and what they should do to help.");
A("tongs", "Tongs transfer", "frustration", 3, 8, 5, "Kitchen tongs or chopsticks, two bowls, dry pasta or cotton balls", false,
  ["Fill one bowl with pasta pieces.", "Move them to the other bowl one at a time using only the tongs.", "Dropped pieces stay dropped. Keep going to the end.", "Count how many made it across and try again."],
  "Use a spoon and large pompoms.", "Use chopsticks, or set a one-minute timer.");

/* ---------- Switching ---------- */
A("freezeswitch", "Freeze and switch", "switching", 3, 10, 5, "Music you can pause", false,
  ["Dance to the music. When it stops, freeze.", "When you call switch, everyone starts a completely different move.", "Call switch two or three times in one song.", "Your child runs the music for the next song."],
  "Call the new move for them: now hop, now spin.", "Each new move must be the opposite of the last: high then low, fast then slow.");
A("sortflip", "Sort and flip", "switching", 3, 9, 10, "Mixed blocks, buttons, or playing cards", false,
  ["Sort the pile by colour as fast as you can.", "Shout flip. Mix them up and sort by shape or size instead.", "Flip again and let your child invent the next sorting rule.", "Ask which rule was hardest to change to."],
  "Use two colours and two shapes.", "Flip in the middle of a sort, without mixing the pile first.");
A("animalwalks", "Animal walk switch", "switching", 3, 8, 5, "Space to move", false,
  ["Cross the room walking like a bear.", "On each clap, change animal: frog, crab, snake, flamingo.", "Clap at surprising moments.", "Let your child be the clapper while you do the walking."],
  "Use two animals and clap only at the walls.", "Two claps means go back to the animal before last.");
A("countdownhandoff", "Countdown hand-off", "switching", 3, 8, 10, "A timer and two things your child likes doing", false,
  ["Explain: three minutes of the first game, then we switch.", "Give a warning at one minute and count the last ten seconds together.", "At zero, do the same goodbye action every time, such as a wave to the toys.", "Start the second activity straight away. Use the same routine before screens go off."],
  "Go from a less liked activity to a favourite one.", "Let your child run the timer and give the one-minute warning.");
A("ballrules", "Catch with changing rules", "switching", 5, 12, 10, "A soft ball", false,
  ["Throw the ball back and forth. Each catcher names an animal.", "After ten catches, change the rule: now name a food.", "Change again: now a word that starts with B.", "Finish with a round where the rule changes after every three catches."],
  "Roll the ball on the floor and name colours.", "Alternate two rules on every throw: animal, food, animal, food.");
A("daynight", "Day and night", "switching", 4, 9, 5, "Two pieces of paper with a sun and a moon drawn on them", false,
  ["Hold up the sun and your child says day. Hold up the moon and they say night.", "Now the tricky rule: sun means say night, moon means say day.", "Show the cards faster.", "Switch back to the normal rule without warning and see who notices."],
  "Stay with the normal rule and build up speed.", "Add a star card that means clap and say nothing.");
A("storyremix", "Story remix", "switching", 5, 12, 5, "Nothing", true,
  ["Start retelling a story you both know well.", "On each clap, the teller must swap one thing: the hero, the place, the weather.", "Keep the story going with the change in place.", "Hand over the telling after three claps."],
  "You tell the story and your child chooses each swap.", "Each swap must be to something that starts with the same letter.");
A("courseremix", "Obstacle course remix", "switching", 4, 12, 15, "Cushions, chairs, a blanket, tape", false,
  ["Build a four-station course together: over, under, around, through.", "Run it once the normal way.", "Run it backwards, starting at the last station.", "Change one station and run it again without a practice."],
  "Use two stations.", "Draw the order of stations from a hat before each run.");
A("categoryswitch", "Category switch", "switching", 6, 12, 5, "Nothing", true,
  ["Take turns naming animals as quickly as you can.", "On a clap, switch to foods without a pause.", "On the next clap, switch to things that are blue.", "Whoever hesitates for three seconds picks the next category."],
  "Give a five-second pause after every clap.", "Alternate between two categories on every turn.");

/* ---------- Calm ---------- */
A("bellybuddy", "Belly buddy breathing", "calm", 3, 8, 5, "A small soft toy", false,
  ["Lie on your backs with a soft toy on each belly.", "Breathe in slowly through the nose so the toy rides up.", "Breathe out slowly so it rides down.", "Give the toy ten slow rides."],
  "Do five rides and count them aloud.", "Breathe in for four counts and out for six.");
A("fivefinger", "Five-finger breathing", "calm", 4, 12, 3, "Nothing", true,
  ["Hold one hand up with the fingers spread.", "With a finger of the other hand, trace up the thumb while you breathe in.", "Trace down the other side while you breathe out.", "Carry on across all five fingers, then swap hands."],
  "Trace your child's hand for them while they breathe.", "Pause for a count of two at the top of each finger.");
A("spaghetti", "Raw and cooked spaghetti", "calm", 3, 9, 5, "Space to lie down", false,
  ["Stand tall and stiff like raw spaghetti. Squeeze every muscle for five seconds.", "Now you are in the pot. Slowly go soft and wobbly.", "Melt all the way to the floor like cooked spaghetti.", "Repeat three times, then rest for five slow breaths."],
  "Squeeze and soften just the hands.", "Tense one body part at a time, from the toes up to the face.");
A("senses54321", "Five, four, three, two, one", "calm", 5, 12, 5, "Nothing", true,
  ["Name five things you can see.", "Name four things you can touch, and touch them.", "Name three things you can hear and two you can smell.", "Name one thing you like about right now."],
  "Do three things you see, two you hear, one you can touch.", "Do it silently, counting on fingers, then compare lists.");
A("calmcorner", "Build a calm corner", "calm", 3, 12, 15, "Cushions, a blanket, two or three quiet things your child chooses", false,
  ["Choose a spot together that is out of the way but not shut off.", "Your child picks what goes in it: a cushion, a book, something to squeeze.", "Practise going there when everyone is calm, for two minutes.", "Agree that it is a place to feel better, never a punishment."],
  "Use one cushion and one soft toy in the living room.", "Add a short list, drawn by your child, of things to do there.");
A("wallpush", "Push the wall down", "calm", 3, 10, 3, "A solid wall", true,
  ["Stand facing the wall with both hands flat against it.", "Push as hard as you can for ten seconds, as if moving the wall.", "Step back, shake out your arms, and take one slow breath.", "Repeat three times."],
  "Push palm to palm against your hands instead.", "Push with your back against the wall, sliding down into a sitting position.");
A("crosstaps", "Cross taps", "calm", 4, 12, 3, "Nothing", false,
  ["March slowly on the spot.", "Tap your right hand on your left knee, then left hand on right knee.", "Keep a slow, steady beat for twenty taps.", "Finish with your hands on your belly for three breaths."],
  "Do it sitting on a chair.", "Tap elbow to opposite knee, or tap the opposite heel behind your back.");
A("lazyeights", "Sky eights", "calm", 4, 12, 3, "Nothing", false,
  ["Hold one arm straight out with the thumb up.", "Draw a large figure eight lying on its side in the air.", "Follow your thumb with your eyes, keeping your head still.", "Do five with each hand, then five with both hands together."],
  "Draw the eight on paper with a fat crayon instead.", "Draw it with one foot while balancing on the other.");
A("hotchocolate", "Hot chocolate breath", "calm", 3, 8, 2, "Nothing, or a real warm drink", true,
  ["Cup your hands as if holding a mug of hot chocolate.", "Smell it: breathe in slowly through the nose.", "Cool it down: blow out slowly through the mouth.", "Take five sips of air this way."],
  "Do three breaths with a real warm drink.", "Breathe in for three counts and blow out for six.");
A("glitterjar", "Glitter jar", "calm", 4, 12, 15, "A jar with a tight lid, warm water, clear glue, glitter", false,
  ["Fill the jar most of the way with warm water and add a good squeeze of glue.", "Add glitter, close the lid tightly, and shake.", "Watch together until every piece has settled, breathing slowly.", "Keep it in the calm corner and shake it whenever feelings are swirling."],
  "Make it yourself and let your child do the shaking.", "Time how long it takes to settle and match your breathing to it.");

var GAME_LIST = [
  { id: "match", name: "Pair Pond", skill: "focus", mins: 3, blurb: "Turn over two cards at a time and find the matching pairs.", better: "low", unit: "turns" },
  { id: "gofrog", name: "Go, Frog!", skill: "impulse", mins: 2, blurb: "Tap every frog. Keep your finger away from the crocodile.", better: "high", unit: "out of 16" },
  { id: "path", name: "Firefly Path", skill: "focus", mins: 3, blurb: "Watch the lights and tap them back in the same order.", better: "high", unit: "lights in a row" },
  { id: "odd", name: "Odd One Out", skill: "switching", mins: 1, blurb: "One picture is different. Find as many as you can in 40 seconds.", better: "high", unit: "found" },
  { id: "star", name: "Golden Star", skill: "patience", mins: 2, blurb: "Wait for the star to turn gold. Tap too soon and you start that star again.", better: "high", unit: "out of 6" },
  { id: "breathe", name: "Balloon Breath", skill: "calm", mins: 1, blurb: "Breathe in as the balloon grows and out as it shrinks.", better: null, unit: "" },
  { id: "freeze", name: "Freeze Screen", skill: "impulse", mins: 2, blurb: "Dance when the screen says dance. Freeze when it says freeze.", better: null, unit: "" }
];

/* Activities that cannot be started on the spot. Kept out of the day's own picks and labelled wherever they appear. */
var PREP = { icerescue: "freeze the toy in a tub of water the night before.", growjar: "this one runs for about a week, a minute a day after the first set-up." };
ACTS.forEach(function (a) { a.prep = PREP[a.id] || null; });

var WEEK_THEMES = ["Learn the first games", "Add a second skill", "Use it in real moments", "Your child leads"];

function fits(act, ageKey) { var n = AGE_N[ageKey] || 6; return act.min <= n && n <= act.max; }

/* order: skill ids, most-needed first. Returns { week, theme, acts:[...], game } for a 1-based day number. */
function planFor(profile, order, day, swaps) {
  swaps = swaps || {};
  var week = Math.min(4, Math.ceil(day / 7));
  var o = order;
  var lists = { 1: [o[0], "calm", o[1]], 2: [o[0], o[1], "calm"], 3: [o[1], o[2], o[0]], 4: [o[0], o[1], o[2]] };
  var n = { "5": 1, "10": 2, "15": 3 }[profile.time] || 2;
  var used = {}, out = [];
  for (var j = 0; j < n; j++) {
    var sk = lists[week][j];
    var all = ACTS.filter(function (a) { return a.skill === sk && fits(a, profile.age); });
    if (!all.length) continue;
    /* The day's own picks are short (about 5 minutes each, so the plan fits the time the parent chose)
       and need no preparation. Longer and plan-ahead activities are reachable with Swap. */
    var c = all.filter(function (a) { return !a.prep; });
    if (week === 3) { var g = c.filter(function (a) { return a.go; }); if (g.length >= 2) c = g; }
    var fit = c.filter(function (a) { return a.mins <= 5; });
    if (!fit.length) fit = c.filter(function (a) { return a.mins <= 10; });
    if (!fit.length) fit = c.length ? c : all;
    var start = (day * 5 + j * 2) % fit.length;
    var rest = all.filter(function (a) { return fit.indexOf(a) < 0; }).sort(function (x, y) { return x.mins - y.mins; });
    var ring = fit.slice(start).concat(fit.slice(0, start), rest);
    var idx = (swaps[day + "-" + j] || 0) % ring.length, tries = 0;
    while (used[ring[idx].id] && tries < ring.length) { idx = (idx + 1) % ring.length; tries++; }
    used[ring[idx].id] = 1; out.push(ring[idx]);
  }
  return { week: week, theme: WEEK_THEMES[week - 1], acts: out, game: GAME_LIST[(day - 1) % GAME_LIST.length] };
}

if (typeof module !== "undefined") module.exports = { SKILLS: SKILLS, ACTS: ACTS, AGE_N: AGE_N, GAME_LIST: GAME_LIST, planFor: planFor, fits: fits, QUIZ_AREAS: QUIZ_AREAS };
