import { jaroSimilarity, jaroWinkler, levenshtein, sorensenDice } from "../index";

describe("Algorithms", () => {
  describe("Jaro-Winkler", () => {
    it("martha and marhta should be 94% similar", () => {
      const result = jaroWinkler.compare("MARTHA", "MARHTA");
      expect(result).toBeCloseTo(0.966);
    });

    it("dwayne and duane should be 82% similar", () => {
      const result = jaroWinkler.compare("dwayne", "duane");
      expect(result).toBeCloseTo(0.857);
    });

    it("jellyfish and smellyfish should be 89% similar", () => {
      const result = jaroWinkler.compare("jellyfish", "smellyfish");
      expect(result).toBeCloseTo(0.906);
    });
  });

  describe("Jaro similarity", () => {
    it("martha and marhta should be 94% similar", () => {
      const result = jaroSimilarity.compare("MARTHA", "MARHTA");
      expect(result).toBeCloseTo(0.944);
    });

    it("dwayne and duane should be 82% similar", () => {
      const result = jaroSimilarity.compare("dwayne", "duane");
      expect(result).toBeCloseTo(0.822);
    });

    it("jellyfish and smellyfish should be 89% similar", () => {
      const result = jaroSimilarity.compare("jellyfish", "smellyfish");
      expect(result).toBeCloseTo(0.896);
    });

    it("farmville and faremviel should be 88% similar", () => {
      const result = jaroSimilarity.compare("faremviel", "farmville");
      expect(result).toBeCloseTo(0.884);
    });

    it("minecraft and farmville should be 31% similar", () => {
      const result = jaroSimilarity.compare("farmville", "minecraft");
      expect(result).toBeCloseTo(0.315);
    });

    it("dixon and dicksonx should be 76% similar", () => {
      const result = jaroSimilarity.compare("dixon", "dicksonx");
      expect(result).toBeCloseTo(0.766);
    });
  });

  describe("Levenshtein", () => {
    it("find best match", () => {
      const target = "qwertyuiop";
      const mostSimilar = levenshtein.compareOneToMany(target, ["qwertyuiop", "asdfghjkl"]).bestMatch()[target];
      expect(mostSimilar.value).toEqual(target);
      expect(mostSimilar.match).toEqual(0);
    });
  });
})
