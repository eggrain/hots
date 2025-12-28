import { describe, it, expect } from "vitest";
import { randPick, randHot, isHot } from "./hots.js";

describe("randPick", () => {
    it("returns a random element from an array", () => {
        const arr = ["a", "b", "c"];
        const result = randPick(arr);
        expect(arr).toContain(result);
    });

    it("returns null for empty array", () => {
        expect(randPick([])).toBeNull();
    });
});

describe("isHot", () => {
    it("returns true for hots", () => {
        expect(isHot("WA 98666")).toBe(true);
        expect(isHot("OR 97405")).toBe(true);
        expect(isHot("CA 95501")).toBe(true);
        expect(isHot("ID 83539")).toBe(true);
    });
    it("returns false for not hots", () => {
        expect(isHot("WA 98634")).toBe(false);
        expect(isHot("OR 97035")).toBe(false);
        expect(isHot("CA 90001")).toBe(false);
        expect(isHot("ID 83201")).toBe(false);
    });
    it("returns false for invalid zip formats", () => {
        expect(isHot("WA98666")).toBe(false);
        expect(isHot("W 98666")).toBe(false);
        expect(isHot("WA 9866")).toBe(false);
        expect(isHot("WASHINGTON 98666")).toBe(false);
    });
});

describe("randHot", () => {
    it("returns a hot", () => {
        const result = randHot();
        expect(isHot(result)).toBe(true);
    });
});