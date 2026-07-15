// Simple word pools
const adjectives = [
  "brave", "calm", "clever", "bright", "swift", "silent", "gentle", "mighty",
  "bold", "curious", "happy", "kind", "lively", "noble", "proud", "quick",
  "sharp", "strong", "wise", "wild", "cool", "fast", "bright", "nova", "orbit",
  "silent", "wild", "epic", "stellar", "cosmic", "radiant", "vivid", "dynamic",
  "serene", "fiery", "frozen", "stormy", "sunny", "shadow", "golden", "silver",
  "crimson", "emerald", "sapphire", "onyx", "amber", "ivory", "jade", "pearl",
  "iron", "steel", "cobalt", "titan", "atomic", "quantum", "galactic", "lunar",
  "solar", "stellar", "nebula", "meteor", "comet", "asteroid", "plasma", "fusion"
];

const nouns = [
  "star", "cloud", "wave", "spark", "pixel", "stone", "flare", "river", "mountain",
  "forest", "ocean", "desert", "island", "valley", "sky", "sun", "moon", "planet",
  "galaxy", "nebula", "comet", "meteor", "asteroid", "nova", "orbit", "eclipse",
  "storm", "thunder", "lightning", "rain", "snow", "ice", "fire", "flame", "ember",
  "shadow", "phantom", "ghost", "dragon", "phoenix", "wolf", "lion", "tiger",
  "hawk", "eagle", "falcon", "owl", "bear", "fox", "serpent", "whale", "dolphin",
  "shark", "coral", "reef", "shell", "pearl", "crystal", "gem", "diamond", "ruby",
  "sapphire", "emerald", "onyx", "amber", "jade", "iron", "steel", "copper",
  "bronze", "silver", "gold", "platinum", "cobalt", "titan", "atom", "quantum",
  "fusion", "plasma", "pulse", "signal", "echo", "sound", "song", "melody",
  "rhythm", "beat", "note", "chord", "verse", "poem", "story", "legend", "myth",
  "dream", "vision", "hope", "spirit", "soul", "mind", "heart", "flame", "sparkle"
];


function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function generateUniqueUsername() {
    const noun = randomElement(nouns);
    const adj = randomElement(adjectives);
    const number = Math.floor(1000 + Math.random() * 9000); // 4-digit suffix
    const username = `${adj}_${noun}_${number}`;
    
    return username;
}

export default generateUniqueUsername;
