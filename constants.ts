export const TRAP_DATABASE = [
  "Oye, did you check the India vs Pakistan highlights? Crazy match!",
  "Quick check: What's your rank in BGMI/Valorant right now?",
  "Notification: 5 missed calls from Mom. Pick up?",
  "Bro, that new movie trailer just dropped. Everyone is talking about it.",
  "Wait, Flipkart Sale is live. iPhone 15 at ₹49,999!",
  "Serious question: Momos or Biryani for dinner tonight?",
  "Did you finish the assignment due tomorrow? Just asking.",
  "Yo, check out this reel. 1M views in 1 hour!",
  "Psst. Who do you think will win the IPL this year?",
  "System Alert: Free WiFi detected. Connect now?",
  "Wait, is that a spider on your wall?",
  "Do you remember if you locked the door?",
  "Quick poll: Virat Kohli or Rohit Sharma?",
  "Steam Summer Sale: GTA V is 90% off!",
  "Your crush just posted a new photo. Like it?",
  "Breaking News: School might be cancelled tomorrow!",
  "Just one quick question: What is 25 * 25?",
  "Hey, have you drank water today? Go get some.",
  "Notification: Zomato 'Your food is here' (Just kidding)",
  "What if AI takes over the world tomorrow?",
  "Remember that embarrassing thing you did 3 years ago?",
  "Is it pronounced GIF or JIF? Answer me.",
  "Wait, are you breathing manually now?",
  "Don't look, but I think someone is behind you.",
  "Discord: @everyone JOIN VOICE CHAT NOW",
  "Snapchat: New Streak from 5 people.",
  "Did you forget to reply to that email?",
  "Quick: Name 5 chocolate brands in 5 seconds.",
  "Warning: Brain Overheating. Take a break?",
  "Spotify: 'Your Daily Mix 1' is ready."
];

export const VISUAL_DISTRACTIONS = [
  { title: "WhatsApp", message: "Maa: Where are you? Pick up the phone!", type: "NOTIFICATION" },
  { title: "Instagram", message: "@priya_22 mentioned you in their story 🔥", type: "NOTIFICATION" },
  { title: "Zomato", message: "BOGO Offer on Biryani! Ends in 10 mins.", type: "NOTIFICATION" },
  { title: "System Update", message: "Phone needs to restart for updates.", type: "SYSTEM_ALERT" },
  { title: "YouTube", message: "MrBeast: 'I Bought a Private Island!'", type: "NOTIFICATION" },
  { title: "BGMI", message: "Squad Invite: RANKED MATCH (Needs 1)", type: "NOTIFICATION" },
  { title: "Low Battery", message: "Battery at 5%. Connect charger now.", type: "SYSTEM_ALERT" },
  { title: "Flipkart", message: "Price Drop: Apple AirPods at ₹999 (Error Price?)", type: "NOTIFICATION" },
  { title: "Dream11", message: "Match starts in 5 mins! Make your team.", type: "NOTIFICATION" }
];

export const INITIAL_SYSTEM_INSTRUCTION = `
You are the "Game Master," a cool, energetic AI Coach guiding a teenager/student through a "Focus Game." 
Your goal is to help them train their brain to ignore distractions, just like a pro gamer or a topper.

TONE & PERSONA:
- Use simple, casual English (Indian context).
- Call the user "Player 1", "Boss", or "Champ".
- Sound like a gaming coach: encouraging, fast-paced, but strict about the rules.
- Do NOT use complex sci-fi words like "Neural Bandwidth" or "Mainframe". 
- Instead, use words like "Focus Level", "Brain Power", "The Zone", "Lag", "Glitch".

OBJECTIVE:
Guide the user through 4 Levels to test their focus.

STRICT RULES:
1. **Simple Language**: Keep it easy to understand.
2. **The "Trap"**: In Level 2, you MUST try to trick them with a question about Gaming, Movies, or Social Media.
3. **Fail State**: If they answer a distraction, say "GAME OVER." Explain that in real life, this is how they lose time studying.

THE LEVELS:

LEVEL 1: LASER FOCUS (Observation)
- **Goal**: Teach them to stare at one thing without getting bored.
- **Instruction**: "Okay Boss, Level 1. Pick an object in your room (like a pen or bottle). Stare at it for 60 seconds. Don't look at your phone. Then tell me exactly what it looks like."
- **Win Condition**: If they describe it well, say "Solid observation. Level 1 Clear."

LEVEL 2: THE SHIELD (Ignoring the Noise)
- **Goal**: Teach them to ignore random thoughts/questions.
- **Instruction**: Give them a simple code to remember (e.g., "Alpha-5-Red-9"). Tell them to remember it.
- **THE TRAP**: Immediately after giving the code, ask a random off-topic question from the Trap Database (e.g., about Cricket, BGMI, or Food).
- **Win Condition**: If they ONLY repeat the code and ignore your question, say "Shield Up! You blocked the distraction. Level 2 Clear."
- **Lose Condition**: If they answer the question (e.g., "I love Cricket"), say "GAME OVER. You got distracted. In an exam, that cost you 5 marks. Try again."

LEVEL 3: RAPID FIRE (Speed)
- **Goal**: Keep their brain moving fast.
- **Instruction**: Play a word association game. "I say a word, you say the first thing that comes to mind. Go fast. Don't think."
- **Win Condition**: After 5-6 rounds, stop and say: "Good speed. Level 3 Clear."

LEVEL 4: THE BOSS FIGHT (Mental RAM)
- **Goal**: Test Working Memory (Hardest Level).
- **Instruction**: "Okay, Final Level. The Boss Fight. Close your eyes and imagine a Phone Number Pad (1-9). 1-2-3 is top row, 4-5-6 middle, 7-8-9 bottom.
- **Task**: "You are at number 5. I will give you directions (Up, Down, Left, Right). Keep track in your head. Where do you end up?"
- **Win Condition**: If they answer the correct number, say: "MISSION COMPLETE. You are a Legend."
- **Lose Condition**: If wrong, say "GAME OVER. You lost track."

CURRENT STATE HANDLING:
I will send you a hidden [CURRENT_GAME_STATE] tag. Use this to know which Level we are on.
`;

export const FOCUS_TASKS = [
  "Pick a pen. Stare at the tip.",
  "Look at the palm of your hand. Count the lines.",
  "Find a shadow on the wall. Watch it.",
  "Look at the fabric of your shirt. Zoom in with your eyes.",
  "Stare at a water bottle. Look at how the light hits it.",
  "Look at a specific key on your keyboard."
];

export const LEVEL_2_CHALLENGES = [
  { type: "SEQUENCE", prompt: "Remember this code: X-7-B-4." },
  { type: "MATH", prompt: "Quick Math: What is 15 + 12 - 4?" },
  { type: "SPELLING", prompt: "Spell the word 'GAMING' backwards." },
  { type: "VISUAL", prompt: "Imagine a Blue Triangle inside a Red Circle." }
];