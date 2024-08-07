import { StringSimilarityResults } from "../string-similarity-result";
import type { SimilarityAlgorithm } from "../string-similarity";
import type { validOrder } from "../string-similarity-result"


/**
 * Implements Levenshtein
 * 
 * Notice that this is a **distance** algorithm, the result values will be absolute instead of relative
 * to the target as other algorithms
 * 
 * Works very well for small inputs
 */

export class Levenshtein implements SimilarityAlgorithm {
    private tail(value: string) {
        return value.slice(1, value.length);
    }

    private head(value: string) {
        return value[0];
    }

    compare(target: string, compare: string): number {
        if (target.length === 0) {
            return compare.length;
        }

        if (compare.length === 0) {
            return target.length;
        }

        if (this.head(target) === this.head(compare)) {
            return this.compare(this.tail(target), this.tail(compare));
        }

        const a = 1 + Math.min(
            this.compare(this.tail(target), compare),
            this.compare(target, this.tail(compare)),
            this.compare(this.tail(target), this.tail(compare))
        );
        return a;
    };

    compareOneToMany = (target: string, compare: string[], order: validOrder = "ascending") => {
        const ssr = new StringSimilarityResults(order);
        for (const c of compare) {
            const result = this.compare(target, c);
            ssr.add(target, c, result);
        }

        return ssr;
    };
    compareMany = (target: string[], compare: string[], order: validOrder = "ascending") => {
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

export const levenshtein = new Levenshtein();