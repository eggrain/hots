export const hotStates = ["WA", "OR", "CA", "ID"];

/** Random pick from array */
export function randPick(arr, rng = Math.random) {
  if (!Array.isArray(arr) || arr.length === 0) return null;
  return arr[Math.floor(rng() * arr.length)];
}

/** "ST 12345" */
export function isValidZipFormat(zip) {
  return typeof zip === "string" && /^[A-Z]{2} \d{5}$/.test(zip);
}

/** Parse "WA 98666" -> { state: "WA", digits: "98666", n: 98666 } or null */
export function parseZip(zip) {
  if (!isValidZipFormat(zip)) return null;
  const state = zip.slice(0, 2);
  const digits = zip.slice(3, 8);
  return { state, digits, n: Number(digits) };
}

/** Inclusive random int helper */
function randInt(min, max, rng = Math.random) {
  // min/max inclusive
  return Math.floor(rng() * (max - min + 1)) + min;
}

function formatZip(state, n) {
  return `${state} ${String(n).padStart(5, "0")}`;
}

/**
 * Per-state: is this 5-digit zip hot for that state?
 * digits must be exactly 5 digits.
 */
export function isHotForState(state, digits) {
  if (typeof state !== "string" || typeof digits !== "string") return false;
  if (!/^[A-Z]{2}$/.test(state)) return false;
  if (!/^\d{5}$/.test(digits)) return false;

  const n = Number(digits);

  switch (state) {
    case "OR":
      // "all OR" — interpret as all Oregon zips: 97000–97999
      return n >= 97000 && n <= 97999;

    case "CA":
      return n >= 95500 && n <= 95509;

    case "ID":
      // 835–838 => 83500–83899
      return n >= 83500 && n <= 83899;

    case "WA":
      // Your WA rules from earlier:
      // - 986xx => 98600–98699
      // - 9881–9889 => 98810–98899
      // - 9908–9945 => 99080–99459
      if (n >= 98600 && n <= 98699) return true;
      if (n >= 98810 && n <= 98899) return true;
      if (n >= 99080 && n <= 99459) return true;
      return false;

    default:
      return false;
  }
}

/**
 * Top-level: takes "ST 12345"
 * Returns true if that zip is hot for that state.
 */
export function isHot(zip) {
  const parsed = parseZip(zip);
  if (!parsed) return false;

  // If the state isn't one we care about, it's not hot.
  if (!hotStates.includes(parsed.state)) return false;

  return isHotForState(parsed.state, parsed.digits);
}

/**
 * Generate a hot zip for a given state.
 * If no state passed, chooses a random hot state.
 */
export function randHot(state = null, rng = Math.random) {
  const st = state ?? randPick(hotStates, rng);
  if (!st) return null;

  switch (st) {
    case "OR": {
      // 97000–97999
      const n = randInt(97000, 97999, rng);
      return formatZip("OR", n);
    }
    case "CA": {
      // 95500–95509
      const n = randInt(95500, 95509, rng);
      return formatZip("CA", n);
    }
    case "ID": {
      // 83500–83899
      const n = randInt(83500, 83899, rng);
      return formatZip("ID", n);
    }
    case "WA": {
      // choose one WA hot band, then generate within it
      const band = randPick(["986", "988", "990"], rng);
      if (band === "986") return formatZip("WA", randInt(98600, 98699, rng));
      if (band === "988") return formatZip("WA", randInt(98810, 98899, rng));
      return formatZip("WA", randInt(99080, 99459, rng));
    }
    default:
      return null;
  }
}
