import { StringSimilarityResults } from "../string-similarity-result";
import type { SimilarityAlgorithm } from "../string-similarity";
import type { validOrder } from "../string-similarity-result"

export class SorensenDice implements SimilarityAlgorithm {
    private createBigram = (value: string) => {
        let acc = "";
        let lastChar = "";
        for (const s of value) {
            if (lastChar.trim().length !== 0 && s.trim().length !== 0) {
                acc += lastChar + s;
            }
            lastChar = s;
        }

        // word in bigram
        return acc.match(/..?/g) ?? [""];
    }

    private tokenize = (value: string) => {
        const bigram = this.createBigram(value);
        const map = new Map<string, number>();

        for (const token of bigram) {
            const totalTokensInBigram = map.get(token);
            if (totalTokensInBigram === undefined) {
                map.set(token, 1);
            } else {
                map.set(token, totalTokensInBigram + 1);
            }
        }

        return {
            map, bigram
        }
    }

    private intersection(tokens1: Map<string, number>, tokens2: Map<string, number>) {
        let totalIntersections = 0;
        for (const key of tokens1.keys()) {
            if (tokens2.has(key)) {
                const minTokens = Math.min(tokens2.get(key)!, tokens1.get(key)!);
                totalIntersections += minTokens;
            }
        }

        return totalIntersections;
    }

    compare = (target: string, compare: string) => {
        const targetToken = this.tokenize(target.toLowerCase());
        const compareToken = this.tokenize(compare.toLowerCase());
        const totalIntersections = this.intersection(targetToken.map, compareToken.map);

        return (2 * totalIntersections) / (targetToken.bigram.length + compareToken.bigram.length);
    };

    compareOneToMany = (target: string, compare: string[], order: validOrder = "descending") => {
        const ssr = new StringSimilarityResults(order);
        for (const c of compare) {
            const result = this.compare(target, c);
            ssr.add(target, c, result);
        }

        return ssr;
    };

    compareMany = (target: string[], compare: string[], order: validOrder = "descending") => {
        const ssr = new StringSimilarityResults(order);
        for (const t of target) {
            for (const c of compare) {
                const result = this.compare(t, c);
                ssr.add(t, c, result);
            }
        }

        return ssr;
    };
}

export const sorensenDice = new SorensenDice();