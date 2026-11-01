/**
 * HauntScript — Infocom-style parser IF
 * Kiroween 2026 · Resurrection category
 */
(function () {
  "use strict";

  const DIR_ALIASES = {
    n: "north", s: "south", e: "east", w: "west",
    u: "up", d: "down",
    north: "north", south: "south", east: "east", west: "west",
    up: "up", down: "down",
  };

  const SYNONYMS = {
    get: "take", grab: "take", pick: "take",
    drop: "drop", put: "drop",
    i: "inventory", inv: "inventory",
    l: "look", examine: "look", x: "look", inspect: "look",
    open: "open", unlock: "unlock",
    light: "light", ignite: "light",
    read: "read",
    use: "use",
    help: "help", "?": "help",
    quit: "quit", restart: "restart",
    go: "go", walk: "go", move: "go",
  };

  /** @type {Record<string, object>} */
  const ROOMS = {
    porch: {
      name: "Front Porch",
      desc: "Rotting boards creak underfoot. A carved pumpkin grins with a dead candle. The heavy oak door of BLACKTHORN MANOR stands north. Fog swallows the road south.",
      exits: { north: "foyer" },
    },
    foyer: {
      name: "Foyer",
      desc: "A chandelier hangs by a single chain. Dusty portraits watch the staircase up. Doors lead east to a library, west to a dining room, and south back to the porch.",
      exits: { south: "porch", east: "library", west: "dining", up: "hall" },
    },
    library: {
      name: "Library",
      desc: "Shelves lean like drunkards. A cold fireplace dominates the north wall. One volume on a lectern looks undisturbed.",
      exits: { west: "foyer", north: "study" },
      items: ["journal"],
    },
    dining: {
      name: "Dining Room",
      desc: "A long table is set for a feast that never came. Cobwebs lace the silverware. The kitchen waits west; the foyer is east.",
      exits: { east: "foyer", west: "kitchen" },
      items: ["candle"],
    },
    kitchen: {
      name: "Kitchen",
      desc: "Pots hang like gibbets. A trapdoor in the floor leads down into darkness. The dining room is east.",
      exits: { east: "dining", down: "cellar" },
      items: ["matches"],
    },
    cellar: {
      name: "Wine Cellar",
      desc: "Damp stone. Racked bottles clouded with age. Without light, the shadows feel thick enough to choke.",
      dark: true,
      exits: { up: "kitchen", east: "crypt_door" },
      items: ["lantern"],
    },
    crypt_door: {
      name: "Sealed Archway",
      desc: "An iron door set in an ancient arch. A keyhole stares like an empty eye. The cellar is west.",
      dark: true,
      exits: { west: "cellar" },
      lockedExit: { dir: "east", to: "crypt", needs: "key", flag: "cryptUnlocked" },
    },
    crypt: {
      name: "Hidden Crypt",
      desc: "Bone-white walls. At the center, a pedestal holds a pulsing amulet of black glass. This is the heart of the manor's curse.",
      dark: true,
      exits: { west: "crypt_door" },
      items: ["amulet"],
    },
    study: {
      name: "Study",
      desc: "A desk littered with unfinished letters. A brass key rests in a cracked inkstand. The library is south.",
      exits: { south: "library" },
      items: ["key"],
    },
    hall: {
      name: "Upstairs Hall",
      desc: "Wallpaper peels in long strips. A bedroom door stands east. The attic stairs climb up. The foyer is down.",
      exits: { down: "foyer", east: "bedroom", up: "attic" },
    },
    bedroom: {
      name: "Master Bedroom",
      desc: "A four-poster bed draped in moth-eaten velvet. A cracked mirror reflects a room that isn't quite this one.",
      exits: { west: "hall" },
      items: ["cross"],
    },
    attic: {
      name: "Attic",
      desc: "Moonlight slants through a broken dormer. Dust motes swirl like restless spirits. Something skitters in the rafters.",
      exits: { down: "hall" },
    },
  };

  const ITEMS = {
    lantern: {
      name: "brass lantern",
      portable: true,
      desc: "An old brass lantern. It needs a match to light.",
    },
    matches: {
      name: "box of matches",
      portable: true,
      desc: "A nearly empty matchbox. One good strike left, maybe.",
    },
    candle: {
      name: "stub of candle",
      portable: true,
      desc: "A short wax stub. Too weak alone for the deep dark.",
    },
    key: {
      name: "brass key",
      portable: true,
      desc: "A heavy brass key, cold to the touch.",
    },
    journal: {
      name: "old journal",
      portable: true,
      desc: "A leather-bound journal. The last entry is smudged with something dark.",
      readable:
        "October 31 — The amulet in the crypt feeds on fear. Light the way below, unlock the iron door, take the amulet, and flee before midnight. — E. Blackthorn",
    },
    cross: {
      name: "silver cross",
      portable: true,
      desc: "A small silver cross on a chain. It feels faintly warm.",
    },
    amulet: {
      name: "obsidian amulet",
      portable: true,
      desc: "Black glass that drinks the light. Holding it, the manor seems to exhale.",
    },
  };

  const state = {
    room: "porch",
    inventory: [],
    flags: {
      lanternLit: false,
      cryptUnlocked: false,
      won: false,
      dead: false,
    },
    moves: 0,
    score: 0,
    scored: {},
  };

  const outEl = document.getElementById("output");
  const locEl = document.getElementById("loc");
  const movesEl = document.getElementById("moves");
  const scoreEl = document.getElementById("score");
  const form = document.getElementById("cmd-form");
  const input = document.getElementById("cmd");

  function print(text, cls) {
    const p = document.createElement("div");
    p.className = "line" + (cls ? " " + cls : "");
    p.textContent = text;
    outEl.appendChild(p);
    outEl.scrollTop = outEl.scrollHeight;
  }

  function refreshStatus() {
    const room = ROOMS[state.room];
    locEl.textContent = room ? room.name : "—";
    movesEl.textContent = String(state.moves);
    scoreEl.textContent = String(state.score);
  }

  function bumpScore(id, points) {
    if (state.scored[id]) return;
    state.scored[id] = true;
    state.score = Math.min(100, state.score + points);
  }

  function roomItems(id) {
    const r = ROOMS[id];
    if (!r.items) r.items = [];
    return r.items;
  }

  function isDark() {
    const room = ROOMS[state.room];
    return !!(room && room.dark && !state.flags.lanternLit);
  }

  function describeRoom(full) {
    const room = ROOMS[state.room];
    if (!room) return;
    if (isDark()) {
      print("It is pitch black. You are likely to be eaten by a grue… or worse.", "bad");
      print("You hear something scrape along the stone. Light a lantern if you can.", "sys");
      return;
    }
    print(room.name, "room");
    if (full) print(room.desc);
    const items = roomItems(state.room).filter((id) => ITEMS[id]);
    if (items.length) {
      print("You can see: " + items.map((id) => ITEMS[id].name).join(", ") + ".");
    }
    const exits = Object.keys(room.exits || {});
    if (room.lockedExit && !state.flags[room.lockedExit.flag]) {
      exits.push(room.lockedExit.dir + " (locked)");
    } else if (room.lockedExit && state.flags[room.lockedExit.flag]) {
      exits.push(room.lockedExit.dir);
    }
    if (exits.length) print("Exits: " + exits.join(", ") + ".", "sys");
  }

  function parse(raw) {
    const cleaned = raw.trim().toLowerCase().replace(/[.,!?]+$/g, "");
    if (!cleaned) return null;
    let parts = cleaned.split(/\s+/);

    // "pick up X" / "put down X"
    if (parts[0] === "pick" && parts[1] === "up") {
      parts = ["take"].concat(parts.slice(2));
    }
    if (parts[0] === "put" && parts[1] === "down") {
      parts = ["drop"].concat(parts.slice(2));
    }
    if (parts[0] === "turn" && parts[1] === "on") {
      parts = ["light"].concat(parts.slice(2));
    }

    let verb = SYNONYMS[parts[0]] || parts[0];
    let rest = parts.slice(1);

    // bare direction
    if (DIR_ALIASES[verb] && rest.length === 0) {
      return { verb: "go", args: [DIR_ALIASES[verb]], raw };
    }

    if (verb === "go" && rest[0]) {
      const d = DIR_ALIASES[rest[0]];
      if (d) return { verb: "go", args: [d], raw };
    }

    // strip "the" / "a" / "an"
    rest = rest.filter((w) => !["the", "a", "an", "at", "to", "with"].includes(w));

    return { verb, args: rest, raw };
  }

  function findItem(token, list) {
    if (!token) return null;
    const t = token.toLowerCase();
    for (const id of list) {
      const it = ITEMS[id];
      if (!it) continue;
      if (id === t || it.name.includes(t) || t.includes(id)) return id;
    }
    // multi-word: join args checked by caller
    return null;
  }

  function resolveTarget(args, pools) {
    if (!args.length) return null;
    const joined = args.join(" ");
    for (const pool of pools) {
      for (const id of pool) {
        const it = ITEMS[id];
        if (!it) continue;
        if (joined === id || joined === it.name || it.name.includes(joined) || joined.includes(id)) {
          return id;
        }
      }
      // try last word
      const last = args[args.length - 1];
      const hit = findItem(last, pool);
      if (hit) return hit;
    }
    return null;
  }

  function doLook(args) {
    if (!args.length) {
      describeRoom(true);
      return;
    }
    const id = resolveTarget(args, [state.inventory, roomItems(state.room)]);
    if (!id) {
      print("You don't see that here.", "bad");
      return;
    }
    if (isDark() && !state.inventory.includes(id)) {
      print("It's too dark to examine anything on the ground.", "bad");
      return;
    }
    print(ITEMS[id].desc);
  }

  function doGo(dir) {
    if (isDark() && Math.random() < 0.35) {
      print("In the dark you stumble. Something cold brushes your ankle. You freeze — then force yourself still.", "bad");
      state.moves += 1;
      return;
    }
    const room = ROOMS[state.room];
    let next = room.exits && room.exits[dir];

    if (!next && room.lockedExit && room.lockedExit.dir === dir) {
      if (!state.flags[room.lockedExit.flag]) {
        print("The iron door is locked.", "bad");
        return;
      }
      next = room.lockedExit.to;
    }

    if (!next) {
      print("You can't go that way.", "bad");
      return;
    }
    state.room = next;
    state.moves += 1;
    if (next === "crypt") bumpScore("enter_crypt", 20);
    if (next === "attic") bumpScore("attic", 5);
    describeRoom(true);
    refreshStatus();
  }

  function doTake(args) {
    if (isDark()) {
      print("It's too dark to find anything.", "bad");
      return;
    }
    const id = resolveTarget(args, [roomItems(state.room)]);
    if (!id) {
      print("You don't see that here.", "bad");
      return;
    }
    const it = ITEMS[id];
    if (!it.portable) {
      print("You can't take that.", "bad");
      return;
    }
    roomItems(state.room).splice(roomItems(state.room).indexOf(id), 1);
    state.inventory.push(id);
    print("Taken: " + it.name + ".", "ok");
    if (id === "lantern") bumpScore("lantern", 10);
    if (id === "key") bumpScore("key", 15);
    if (id === "amulet") {
      bumpScore("amulet", 40);
      checkWin();
    }
    if (id === "journal") bumpScore("journal", 5);
    refreshStatus();
  }

  function doDrop(args) {
    const id = resolveTarget(args, [state.inventory]);
    if (!id) {
      print("You aren't carrying that.", "bad");
      return;
    }
    state.inventory.splice(state.inventory.indexOf(id), 1);
    roomItems(state.room).push(id);
    print("Dropped: " + ITEMS[id].name + ".", "ok");
    if (id === "amulet" && state.flags.won) {
      // still won
    }
  }

  function doInventory() {
    if (!state.inventory.length) {
      print("You are empty-handed.", "sys");
      return;
    }
    const names = state.inventory.map((id) => {
      let n = ITEMS[id].name;
      if (id === "lantern" && state.flags.lanternLit) n += " (lit)";
      return n;
    });
    print("You are carrying: " + names.join(", ") + ".");
  }

  function doLight(args) {
    const id = resolveTarget(args, [state.inventory, roomItems(state.room)]) ||
      (args.length === 0 ? (state.inventory.includes("lantern") ? "lantern" : null) : null);
    if (!id) {
      print("Light what?", "bad");
      return;
    }
    if (id !== "lantern" && id !== "candle") {
      print("That won't make a useful light.", "bad");
      return;
    }
    if (id === "candle") {
      print("The candle sputters and dies almost immediately. You need something sturdier — the lantern.", "bad");
      return;
    }
    if (!state.inventory.includes("lantern") && !roomItems(state.room).includes("lantern")) {
      print("You don't have the lantern.", "bad");
      return;
    }
    if (!state.inventory.includes("matches") && !roomItems(state.room).includes("matches")) {
      print("You have nothing to light it with.", "bad");
      return;
    }
    if (state.flags.lanternLit) {
      print("The lantern is already lit.", "sys");
      return;
    }
    // take lantern into inventory if lighting from floor
    if (!state.inventory.includes("lantern")) {
      roomItems(state.room).splice(roomItems(state.room).indexOf("lantern"), 1);
      state.inventory.push("lantern");
    }
    state.flags.lanternLit = true;
    bumpScore("lit", 15);
    print("You strike a match. The brass lantern flares to life, pushing back the dark.", "ok");
    if (isDark() === false && ROOMS[state.room].dark) {
      describeRoom(true);
    }
    refreshStatus();
  }

  function doUnlock(args) {
    const room = ROOMS[state.room];
    if (!room.lockedExit) {
      print("There's nothing to unlock here.", "bad");
      return;
    }
    if (state.flags[room.lockedExit.flag]) {
      print("It's already unlocked.", "sys");
      return;
    }
    if (!state.inventory.includes("key")) {
      print("You need a key.", "bad");
      return;
    }
    // optional: "unlock door" / "unlock east"
    state.flags[room.lockedExit.flag] = true;
    bumpScore("unlock", 15);
    print("The brass key turns with a shriek of rust. The iron door swings inward.", "ok");
    refreshStatus();
  }

  function doOpen(args) {
    // treat open door as unlock attempt at crypt
    if (ROOMS[state.room].lockedExit) {
      doUnlock(args);
      return;
    }
    print("You find nothing special to open.", "sys");
  }

  function doRead(args) {
    const id = resolveTarget(args, [state.inventory, roomItems(state.room)]);
    if (!id) {
      print("Read what?", "bad");
      return;
    }
    const it = ITEMS[id];
    if (!it.readable) {
      print("There's nothing to read on that.", "bad");
      return;
    }
    print('"' + it.readable + '"', "ok");
  }

  function doUse(args) {
    const id = resolveTarget(args, [state.inventory]);
    if (!id) {
      print("Use what?", "bad");
      return;
    }
    if (id === "key") {
      doUnlock(args);
      return;
    }
    if (id === "matches" || id === "lantern") {
      doLight(["lantern"]);
      return;
    }
    if (id === "cross") {
      print("You raise the silver cross. The shadows recoil for a moment — then settle again. It may help you leave safely.", "ok");
      return;
    }
    if (id === "amulet") {
      checkWin();
      return;
    }
    print("You're not sure how to use that right now.", "sys");
  }

  function checkWin() {
    if (state.flags.won || state.flags.dead) return;
    if (!state.inventory.includes("amulet")) return;
    // Win if player has amulet; bonus if they reach porch
    if (state.room === "porch" || state.room === "foyer" || state.inventory.includes("cross")) {
      state.flags.won = true;
      bumpScore("win", state.score >= 80 ? 0 : 100 - state.score);
      state.score = 100;
      print("", "sys");
      print("*** YOU HAVE BROKEN THE CURSE ***", "ok");
      print(
        "The amulet's pulse fades. Somewhere above, a clock strikes an impossible thirteenth hour — then silence. Blackthorn Manor will sleep again… until next Halloween.",
        "ok"
      );
      print("Final score: " + state.score + "/100 in " + state.moves + " moves. Type restart to play again.", "sys");
      refreshStatus();
    } else {
      print("The amulet thrums in your hand. Get it out of the depths — toward the foyer or porch — before the manor notices.", "sys");
    }
  }

  function doHelp() {
    print(
      "Commands: look [thing], go <dir> (n/s/e/w/up/down), take/drop <item>, inventory, light lantern, unlock door, read <item>, use <item>, help, restart.",
      "sys"
    );
    print("Hint: explore, read the journal, light the cellar, unlock the crypt, claim the amulet, escape upward.", "sys");
  }

  function restart() {
    state.room = "porch";
    state.inventory = [];
    state.flags = { lanternLit: false, cryptUnlocked: false, won: false, dead: false };
    state.moves = 0;
    state.score = 0;
    state.scored = {};
    // restore items to original rooms
    Object.keys(ROOMS).forEach((id) => {
      ROOMS[id].items = [];
    });
    ROOMS.library.items = ["journal"];
    ROOMS.dining.items = ["candle"];
    ROOMS.kitchen.items = ["matches"];
    ROOMS.cellar.items = ["lantern"];
    ROOMS.study.items = ["key"];
    ROOMS.bedroom.items = ["cross"];
    ROOMS.crypt.items = ["amulet"];
    outEl.innerHTML = "";
    boot();
  }

  function handle(raw) {
    if (state.flags.dead) {
      print("You are dead. Type restart.", "bad");
      return;
    }
    const parsed = parse(raw);
    if (!parsed) return;
    print("> " + raw, "cmd");

    if (state.flags.won && parsed.verb !== "restart" && parsed.verb !== "help" && parsed.verb !== "look" && parsed.verb !== "inventory") {
      print("The curse is broken. Type restart to play again.", "sys");
      return;
    }

    switch (parsed.verb) {
      case "look":
        doLook(parsed.args);
        break;
      case "go":
        if (!parsed.args[0]) print("Go where?", "bad");
        else doGo(parsed.args[0]);
        break;
      case "take":
        doTake(parsed.args);
        break;
      case "drop":
        doDrop(parsed.args);
        break;
      case "inventory":
        doInventory();
        break;
      case "light":
        doLight(parsed.args);
        break;
      case "unlock":
        doUnlock(parsed.args);
        break;
      case "open":
        doOpen(parsed.args);
        break;
      case "read":
        doRead(parsed.args);
        break;
      case "use":
        doUse(parsed.args);
        break;
      case "help":
        doHelp();
        break;
      case "restart":
        restart();
        break;
      case "quit":
        print("Close the browser tab to quit. Or type restart.", "sys");
        break;
      default:
        print("I don't understand that. Type help.", "bad");
    }

    // After taking amulet in crypt, nudge
    if (state.inventory.includes("amulet") && !state.flags.won) {
      if (state.room === "porch" || state.room === "foyer") checkWin();
    }
  }

  function boot() {
    print("HAUNTSCRIPT", "room");
    print("An Infocom-style Halloween text adventure.", "sys");
    print("You stand before Blackthorn Manor on All Hallows' Eve. Legend says an amulet in the crypt binds a restless spirit. Find it. End the curse.", "sys");
    print("Type help for commands.", "sys");
    print("");
    describeRoom(true);
    refreshStatus();
    input.focus();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    handle(v);
  });

  boot();
})();
