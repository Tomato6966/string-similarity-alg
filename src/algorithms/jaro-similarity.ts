import { StringSimilarityResults } from "../string-similarity-result";
import type { SimilarityAlgorithm } from "../string-similarity";
import type { validOrder } from "../string-similarity-result"

export class JaroSimilarity implements SimilarityAlgorithm {
    private maximumCharacterDistance = (target: string, compare: string) => Math.floor((Math.max(target.length, compare.length)) / 2) - 1;
    private createMatches = () => {
        return {
            target: new Map(),
            compare: new Map()
        }
    }
    private matches = this.createMatches();

    private mapToArrayKeepOrder = (map: Map<number, string>) => {
        const array = Array(map.size);
        for (const [key, value] of map.entries()) {
            array[key] = value;
        }

        return array.filter(v => v);
    }

    private transpositions = () => {
        let transpositions = 0;
        const matchesCompare = this.mapToArrayKeepOrder(this.matches.compare);
        const matchesTarget = this.mapToArrayKeepOrder(this.matches.target);

        for (const [key, value] of matchesCompare.entries()) {
            if (value !== matchesTarget[key]) {
                transpositions++;
            }
        }

        return transpositions / 2;
    }

    private totalMatchingCharacters = (target: string, compare: string) => {
        let totalMatching = 0;

        const maximumCharacterDistance = this.maximumCharacterDistance(target, compare);
        for (let i = 0; i < target.length; i++) {
            const start = Math.max(i - maximumCharacterDistance, 0);
            const end = Math.min(i + maximumCharacterDistance + 1, compare.length);

            for (let j = start; j <= end; j++) {
                if (compare[j] === target[i] && !this.matches.compare.has(j) && !this.matches.target.has(i)) {
                    totalMatching++;
                    this.matches.target.set(i, target[i]);
                    this.matches.compare.set(j, compare[j]);
                }
            }
        }

        return totalMatching;
    }

    compare = (target: string, compareTo: string) => {
        this.matches = this.createMatches();
        const totalMatching = this.totalMatchingCharacters(target, compareTo);
        const matchingTargetProportion = totalMatching / target.length;
        const matchingCompareProportion = totalMatching / compareTo.length;

        const transitionProportion = (totalMatching - this.transpositions()) / totalMatching;
        return (1 / 3) * (matchingTargetProportion + matchingCompareProportion + transitionProportion);
    }

    compareMany(target: string[], compare: string[], order: validOrder = "descending") {
        const ssr = new StringSimilarityResults(order);
        for (const c of compare) {
            for (const t of target) {
                const result = this.compare(t, c);
                ssr.add(t, c, result);
            }
        }

        return ssr;
    };

    compareOneToMany(target: string, compare: string[], order: validOrder = "descending") {
        const ssr = new StringSimilarityResults(order);
        for (const word of compare) {
            const result = this.compare(target, word);
            ssr.add(target, word, result);
        }

        return ssr;
    }
}

export const jaroSimilarity = new JaroSimilarity();
