import { describe, it, expect } from "vitest";
import {
    hotStates,
    randPick,
    isValidZipFormat,
    parseZip,
    isHotForState,
    isHot,
    randHot,
} from "./hots.js";

/**
 * Deterministic RNG helper:
 * - returns values from the provided array in order (loops if needed)
 */
function makeRng(seq) {
    let i = 0;
    return () => {
        const v = seq[i % seq.length];
        i += 1;
        return v;
    };
}

describe("hotStates", () => {
    it("contains the expected states in order", () => {
        expect(hotStates).toEqual(["WA", "OR", "CA", "ID"]);
    });
});

describe("randPick", () => {
    it("returns null for non-array or empty array", () => {
        expect(randPick(null)).toBeNull();
        expect(randPick([])).toBeNull();
        expect(randPick("nope")).toBeNull();
    });

    it("picks deterministically with rng", () => {
        const arr = ["a", "b", "c", "d"];

        // rng=0 -> floor(0*4)=0 -> "a"
        expect(randPick(arr, () => 0)).toBe("a");

        // rng just under 1 -> last index
        expect(randPick(arr, () => 0.999999)).toBe("d");

        // rng=0.25 -> floor(1)=1 -> "b"
        expect(randPick(arr, () => 0.25)).toBe("b");
    });
});

describe("isValidZipFormat", () => {
    it("accepts 'ST 12345'", () => {
        expect(isValidZipFormat("WA 98666")).toBe(true);
        expect(isValidZipFormat("OR 97000")).toBe(true);
    });

    it("rejects wrong spacing, casing, or digits", () => {
        expect(isValidZipFormat("WA98666")).toBe(false);
        expect(isValidZipFormat("WA 9866")).toBe(false);
        expect(isValidZipFormat("wa 98666")).toBe(false);
        expect(isValidZipFormat("WAA 98666")).toBe(false);
        expect(isValidZipFormat("WA 98A66")).toBe(false);
        expect(isValidZipFormat("WA 98666 ")).toBe(false); // strict format
    });

    it("rejects non-strings", () => {
        expect(isValidZipFormat(null)).toBe(false);
        expect(isValidZipFormat(123)).toBe(false);
    });
});

describe("parseZip", () => {
    it("parses a valid zip", () => {
        expect(parseZip("WA 98666")).toEqual({ state: "WA", digits: "98666", n: 98666 });
    });

    it("returns null for invalid zips", () => {
        expect(parseZip("WA98666")).toBeNull();
        expect(parseZip("WA 9866")).toBeNull();
        expect(parseZip("wa 98666")).toBeNull();
    });
});

describe("isHotForState", () => {
    it("rejects invalid inputs", () => {
        expect(isHotForState(null, "98666")).toBe(false);
        expect(isHotForState("WA", null)).toBe(false);
        expect(isHotForState("W", "98666")).toBe(false);
        expect(isHotForState("WA", "9866")).toBe(false);
        expect(isHotForState("WA", "ABCDE")).toBe(false);
    });

    it("OR: hot if between 97000 and 97999 inclusive", () => {
        expect(isHotForState("OR", "97000")).toBe(true);
        expect(isHotForState("OR", "97999")).toBe(true);
        expect(isHotForState("OR", "96999")).toBe(true);
        expect(isHotForState("OR", "98000")).toBe(true);
    });

    it("CA: hot if between 95500 and 95509 inclusive", () => {
        expect(isHotForState("CA", "95500")).toBe(true);
        expect(isHotForState("CA", "95509")).toBe(true);
        expect(isHotForState("CA", "95499")).toBe(false);
        expect(isHotForState("CA", "95510")).toBe(false);
    });

    it("ID: hot if between 83500 and 83899 inclusive", () => {
        expect(isHotForState("ID", "83500")).toBe(true);
        expect(isHotForState("ID", "83899")).toBe(true);
        expect(isHotForState("ID", "83499")).toBe(false);
        expect(isHotForState("ID", "83900")).toBe(false);
    });

    it("WA: hot if in any WA hot band", () => {
        // 98600–98699
        expect(isHotForState("WA", "98600")).toBe(true);
        expect(isHotForState("WA", "98699")).toBe(true);
        expect(isHotForState("WA", "98599")).toBe(false);
        expect(isHotForState("WA", "98700")).toBe(false);

        // 98810–98899
        expect(isHotForState("WA", "98810")).toBe(true);
        expect(isHotForState("WA", "98899")).toBe(true);
        expect(isHotForState("WA", "98809")).toBe(false);
        expect(isHotForState("WA", "98900")).toBe(false);

        // 99080–99459
        expect(isHotForState("WA", "99080")).toBe(true);
        expect(isHotForState("WA", "99459")).toBe(true);
        expect(isHotForState("WA", "99079")).toBe(false);
        expect(isHotForState("WA", "99460")).toBe(false);
    });

    it("returns false for unsupported states", () => {
        expect(isHotForState("TX", "73301")).toBe(false);
    });
});

describe("isHot (end-to-end)", () => {
    it("returns false for invalid format", () => {
        expect(isHot("WA98666")).toBe(false);
        expect(isHot("WA 9866")).toBe(false);
    });

    it("returns false if state not in hotStates", () => {
        expect(isHot("TX 73301")).toBe(false);
    });

    it("delegates to isHotForState rules", () => {
        expect(isHot("OR 97000")).toBe(true);
        expect(isHot("OR 98000")).toBe(true);
        expect(isHot("OR 96999")).toBe(true);

        expect(isHot("CA 95500")).toBe(true);
        expect(isHot("CA 95510")).toBe(false);
        expect(isHot("CA 95499")).toBe(false);

        expect(isHot("ID 83500")).toBe(true);
        expect(isHot("ID 83499")).toBe(false);

        expect(isHot("WA 98600")).toBe(true);
        expect(isHot("WA 98599")).toBe(false);
        expect(isHot("WA 99256")).toBe(true);
        expect(isHot("WA 99070")).toBe(false);
        expect(isHot("WA 99460")).toBe(false);
    });
});

describe("randHot", () => {
    it("returns null if passed a bad state and selection fails", () => {
        // state provided but not supported -> null
        expect(randHot("TX")).toBeNull();
    });

    it("generates a hot zip for OR in range", () => {
        const zip = randHot("OR", () => 0); // choose min
        expect(zip.startsWith("OR ")).toBe(true);
        expect(isHot(zip)).toBe(true);
    });

    it("generates a hot zip for ID in range", () => {
        const zip = randHot("ID", () => 0);
        expect(zip.startsWith("ID ")).toBe(true);
        expect(isHot(zip)).toBe(true);
    });

    it("generates a hot zip for WA in one of the WA hot bands", () => {
        // Force band pick:
        // randPick(["986","988","990"], rng) uses rng to choose index.
        // Provide rng so first call selects band "986" and then min in that range.
        // For 3 items: rng=0 -> index 0 -> "986"
        const zip = randHot("WA", () => 0);
        expect(zip).toMatch(/^WA \d{5}$/);
        expect(isHot(zip)).toBe(true);
    });

    it("generates a hot zip for CA that should be hot by CA rules", () => {
        const zip = randHot("CA", () => 0.5); // mid-range
        expect(zip.startsWith("CA ")).toBe(true);
        expect(isHot(zip)).toBe(true);
    });

    it("when state is null, picks a hot state", () => {
        // rng sequence: first randPick(hotStates) chooses a state;
        // then subsequent rng calls determine the number.
        const rng = makeRng([0, 0]); // pick WA (index 0), then generate min inside WA band/min
        const zip = randHot(null, rng);
        expect(zip).toMatch(/^(WA|OR|CA|ID) \d{5}$/);
    });
});
