export type validOrder = "ascending" | "descending";

const Compare = {
    BIGGER: 1,
    LESSER_OR_EQUAL: -1
}

type Match = {
    value: string;
    match: number;
}

type SimilaritySingleResult = {
    [key: string]: Match;
}

type SimilarityMultipleResults = {
    [key: string]: Match[];
}

interface StringSimilarityResult {
    add: (s1: string, s2: string, similarity: number) => void
    bestMatch: () => SimilaritySingleResult | Match | null;
    bestMatches: (length?: number) => SimilarityMultipleResults | Match[] | null;
}

export class StringSimilarityResults implements StringSimilarityResult {
    /** The similarities Map-Store */
    private similarities = new Map<string, Match[]>();
    // Multiplied by matches to toggle sorting from descending (1) to ascending (-1)
    private orderMultiplier: 1 | -1;

    /**
     * 
     * @param {validOrder} order @default "descending" How to sort similarities. Is "descending" by default, which will sort best matching first. Conversely, "ascending" will sort worst matching first
     */
    constructor(order: validOrder = "descending") {
        this.orderMultiplier = order === "descending" ? -1 : 1;
    }

    /**
     * Adds an algorithm result to the results map
     * @param {string} s1 searchQueryString to add
     * @param {string} s2 stringToMatch to add
     * @param {number} similarity amount of similarity to add (calculated from the algorithm)
     */
    add(s1: string, s2: string, similarity: number) {
        if (!this.similarities.has(s1)) {
            this.similarities.set(s1, []);
        }

        const stringSimilarity = this.similarities.get(s1);

        if (stringSimilarity !== undefined) {
            stringSimilarity.push({
                value: s2,
                match: similarity
            });
            this.similarities.set(s1, stringSimilarity);
        }
    }

    /**
     * Returns the first "best match" of the bestMatches
     * Default order-Types are declared to always return the best Match(es) first
     * If sort is ascending then it's the least best match..
     * (If algo is levenshtein it's reverse, so there it's descending for the least best match)
     * @returns 
     */
    bestMatch() {
        return this.bestMatches(1, true);
    }

    /**
     * Returns all matches sorted by the "best match" first
     * Default order-Types are declared to always return the best Match(es) first
     * 
     * ! If sort is ascending then it's the least best match..
     * ! (If algo is levenshtein it's reverse, so there it's descending for the least best match)
     * @param {[number]} length Amount of matches to return if left empty, it will be all matches
     * @param {[boolean]} bestMatchOnly wether to return just the best match or not
     */
    bestMatches(length?: number, bestMatchOnly?:false): SimilarityMultipleResults;
    bestMatches(length?: number, bestMatchOnly?:true): SimilaritySingleResult;
    bestMatches(length?: number, bestMatchOnly?:boolean): SimilarityMultipleResults | SimilaritySingleResult {
        const similarity: SimilarityMultipleResults | SimilaritySingleResult = {};
        for (const [key, matches] of this.similarities.entries()) {
            if (matches === undefined) {
                throw new Error("Key not found");
            }

            matches.sort((curr, next) => {
                if (curr.match * this.orderMultiplier < next.match * this.orderMultiplier) {
                    return Compare.LESSER_OR_EQUAL;
                }

                return Compare.BIGGER;
            });

            similarity[key] = bestMatchOnly ? matches[0] : matches.slice(0, length ?? matches.length);
        }

        return similarity;
    }
}