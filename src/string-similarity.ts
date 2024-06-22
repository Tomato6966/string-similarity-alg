import { JaroSimilarity } from "./algorithms/jaro-similarity";
import { JaroWinkler } from "./algorithms/jaro-winkler";
import { Levenshtein } from "./algorithms/levenshtein";
import { SorensenDice } from "./algorithms/sorensen-dice";
import { StringSimilarityResults } from "./string-similarity-result";

type SimilarityAlgorithmsNames = "jaro-winkler" | "jaro-similarity" | "dice-coefficient" | "levenshtein";

export interface SimilarityAlgorithm {
  compare: (target: string, compare: string) => number
  compareOneToMany: (target: string, compare: string[]) => StringSimilarityResults
  compareMany: (target: string[], compare: string[]) => StringSimilarityResults
}

class StringSimilarity {
  static algorithm(name: SimilarityAlgorithmsNames): SimilarityAlgorithm {
    switch (name) {
      case "jaro-similarity":
        return new JaroSimilarity();
      case "jaro-winkler":
        return new JaroWinkler();
      case "dice-coefficient":
        return new SorensenDice();
      case "levenshtein":
        return new Levenshtein();
      default:
        throw new Error("Unknown algorithm");
    }
  }
}

export default StringSimilarity.algorithm;

