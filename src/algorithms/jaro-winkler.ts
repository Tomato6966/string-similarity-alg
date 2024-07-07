import { StringSimilarityResults } from "../string-similarity-result";
import type { SimilarityAlgorithm } from "../string-similarity";
import type { validOrder } from "../string-similarity-result"
import { JaroSimilarity } from "./jaro-similarity";


const sameStartingCharacters = (target: string, compare: string) => {
    let total = 0;

    for (const [index, char] of Object.entries(target)) {
        if (char === compare[Number(index)]) {
            total++;
        }

        if (total === 4) {
            return total;
        }
    }

    return total;
}

export class JaroWinkler implements SimilarityAlgorithm {
    public scalingFactor = 0.1;

    compare = (target: string, compare: string) => {
        const js = new JaroSimilarity();
        const jSim = js.compare(target, compare);

        const lp = sameStartingCharacters(target, compare) * this.scalingFactor;
        return jSim + lp * (1 - jSim);
    };

    compareOneToMany = (target: string, compare: string[], order: validOrder = "descending") => {
        const ssr = new StringSimilarityResults(order);
        for (const word of compare) {
            const result = this.compare(target, word);
            ssr.add(target, word, result);
        }

        return ssr;
    };

    compareMany = (target: string[], compare: string[], order: validOrder = "descending") => {
        const ssr = new StringSimilarityResults(order);
        for (const c of compare) {
            for (const t of target) {
                const result = this.compare(t, c);
                ssr.add(t, c, result);
            }
        }

        return ssr;
    };
}

export const jaroWinkler = new JaroWinkler();