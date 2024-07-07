import { JaroSimilarity } from "./algorithms/jaro-similarity";
import { JaroWinkler } from "./algorithms/jaro-winkler";
import { Levenshtein } from "./algorithms/levenshtein";
import { SorensenDice } from "./algorithms/sorensen-dice";

import type { StringSimilarityResults, validOrder } from "./string-similarity-result";

type SimilarityAlgorithmsNames = "jaro-winkler" | "jaro-similarity" | "dice-coefficient" | "levenshtein";

export interface SimilarityAlgorithm {
    /**
     * Compare 2 strings against each other
     * @param {string} target The searchString to match
     * @param {string} compare The StringToMatch to compare to
     * @returns {number} the similarity-percentage amount (if algo is levenshtein it's the amount of differences)
     */
    compare: (target: string, compare: string) => number
    /**
     * 
     * @param {string} target The searchString to match
     * @param {string[]} compare an array of stringToMatches to compare to
     * @param {[validOrder]} order How to sort it, for levenshtein it's ascending on default, else it's descending
     * @returns {StringSimilarityResults} the results class to get the bestMatch or bestMatches from.
     */
    compareOneToMany: (target: string, compare: string[], order?:validOrder) => StringSimilarityResults
    /**
     * 
     * @param {string[]} target an array of searchStrings to match
     * @param {string[]} compare an array of stringToMatches to compare to
     * @param {[validOrder]} order How to sort it, for levenshtein it's ascending on default, else it's descending
     * @returns {StringSimilarityResults} the results class to get the bestMatch or bestMatches from.
     */
    compareMany: (target: string[], compare: string[], order?:validOrder) => StringSimilarityResults
}

class StringSimilarity {
    /**
     * Match similarities by a specific algorithm
     * @param {SimilarityAlgorithmsNames} name 
     * @returns {SimilarityAlgorithm} algorithm class to perform functions upon it
     */
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
