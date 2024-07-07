<h1 align="center">String Similarity Algorithms</h1>

### Usage
This package can be used when need to check how similar two words are. You can choose among some implemented algorithms that suits your best use case.

[Below](###Algorithms) you will find all the implemented algorithms and when to use each. You can import a specific algorithm or use the strinSimilarity function.

It is very useful when you need different parameters for the same algorithm, such as `jaroWinkler`.
```js
import stringSimilarity, { sorensenDice } from "string-similarity-alg";

const jaroWinklerResult = stringSimilarity("jaro-winkler").compare("game of thrones", "lord of the rings");
const sorensenDiceResult = sorensenDice.compare("game of thrones", "lord of the rings");
```

### Installation

You can install this package using populars package managers:

#### npm
```
npm install string-similarity-alg
```

#### yarn
```
yarn add string-similarity-alg
```

#### pnpm
```
pnpm add string-similarity-alg
```

### Algorithms
| Algorithm       | Since | Best use case                                                                          | Default Sort Order                  | Example                                   |
|-----------------|-------|----------------------------------------------------------------------------------------| ------------------------------------|-------------------------------------------|
| Levenshtein     | 1.0.0 | Small strings / similar words                                                          | ascending (lowest difference first) | farmville / faremviel                     |
| Soresen-Dice    | 1.0.0 | Fuzzy matching, very mispelled words or poorly written                                 | descending (highest match first)    | user-home-page.component.ts / usrhompcomp |
| Jaro-Winkler    | 1.0.0 | Same as Jaro similarity, gives more weight to strings that have the same first letters | descending (highest match first)    |     -                                     |
| Jaro Similarity | 1.0.0 | General purpose, use this if you don't think any of the others are valid               | descending (highest match first)    |     -                                     |

### Info

The **`"Levenshtein"`** Algorithm is an absolute algorithm. 
Instead of a similarity percentage, it returns the **"amount" of differences**.
- Therefore the compareMany and compareOneToMany functions have the default order as `'ascending'` instead of `'descending'`, because the lower the number the closer the similarity is!

All other Algorithms, return the similarity "percentage", this means the bigger the number, the closer the similarity is!

### Examples

- Comparing 2 strings

```js
import stringSimilarity from "string-similarity-alg";
const [searchQuery, stringToMatch] = ["ello", "Hello"]; // sample data for comparing

stringSimilarity("jaro-winkler").compare(searchQuery, stringToMatch); 
// -> 0.94 

stringSimilarity("jaro-similarity").compare(searchQuery, stringToMatch); 
// -> 0.9333333333333332

stringSimilarity("dice-coefficient").compare(searchQuery, stringToMatch); 
// -> 0.8571428571428571

stringSimilarity("levenshtein").compare(searchQuery, stringToMatch); 
// -> 1

```

- Comparing 1 string against an array of strings and return the bestMatches of it

```js
import stringSimilarity from "string-similarity-alg";
const [searchQuery, dataToMatch] = ["ello",  ["Hello", "el1o", "Hella", "€11o" ] ]; // sample data for comparing

// default sort is descending (highest matches first)
stringSimilarity("jaro-winkler").compareOneToMany(searchQuery, dataToMatch).bestMatches();
// -> { ello: [  { value: "Hello", match: 0.94 }, { value: "el1o", match: 0.8833333333333333 }, { value: "Hella", match: 0.8049999999999999 }, { value: "€11o", match: 0.55 }  ] }

stringSimilarity("jaro-similarity").compareOneToMany(searchQuery, dataToMatch).bestMatches();
// -> { ello: [  { value: "Hello", match: 0.9333333333333332 }, { value: "el1o", match: 0.8333333333333333 }, { value: "Hella", match: 0.7833333333333333 }, { value: "€11o", match: 0.5 }  ] }

stringSimilarity("dice-coefficient").compareOneToMany(searchQuery, dataToMatch).bestMatches();
// -> { ello: [  { value: "Hello", match: 1 }, { value: "el1o", match: 1 }, { value: "Hella", match: 2 }, { value: "€11o", match: 3 }  ] }

stringSimilarity("levenshtein").compareOneToMany(searchQuery, dataToMatch).bestMatches();
// -> { ello: [  { value: "Hello", match: 0.8571428571428571 }, { value: "Hella", match: 0.5714285714285714 }, { value: "el1o", match: 0.3333333333333333 }, { value: "€11o", match: 0 }  ] }
```

- Comparing 1 string against an array of strings and return the absolute best match of it

```js
import stringSimilarity from "string-similarity-alg";
const [searchQuery, dataToMatch] = ["ello",  ["Hello", "el1o", "Hella", "€11o" ] ]; // sample data for comparing

// default sort is descending (highest matches first)
stringSimilarity("jaro-winkler").compareOneToMany(searchQuery, dataToMatch).bestMatch();
// -> { ello: { value: "Hello", match: 0.94 } }

stringSimilarity("jaro-similarity").compareOneToMany(searchQuery, dataToMatch).bestMatch();
// -> { ello: { value: "Hello", match: 0.9333333333333332 } }

stringSimilarity("dice-coefficient").compareOneToMany(searchQuery, dataToMatch).bestMatch();
// -> { ello: { value: "Hello", match: 1 } }

stringSimilarity("levenshtein").compareOneToMany(searchQuery, dataToMatch).bestMatch();
// -> { ello: { value: "Hello", match: 0.8571428571428571 } }
```

- Comparing multiple string inputs
instead of using `compareOneToMany(string, string[])` you'd do `compareMany(string[], string[])` with the difference that you'd get multiple keys for each searchQuery String..


### Docs:

- **` stringSimilarity(name:SimilarityAlgorithmsNames) `** *static-class function* | **returns `SimilarityAlgorithm class`**

`SimilarityAlgorithmsNames`: "jaro-winkler" | "jaro-similarity" | "dice-coefficient" | "levenshtein"

**` SimilarityAlgorithm`** *class*
| Functions                                                              | Returnvalue                   |
|------------------------------------------------------------------------|-------------------------------|
| compare(target: string, compare: string)                               | number                        |
| compareOneToMany(target: string, compare: string[], order?:validOrder) | StringSimilarityResults class |
| compareMany(target: string[], compare: string[], order?:validOrder)    | StringSimilarityResults class |

`compare`: **returns `number`**
| Param   | Type   | Description                         |
|---------|--------|-------------------------------------|
| target  | string | the searchQuery string to use       |
| compare | string | the String to compare it against to |

```js
stringSimilarity("jaro-winkler").compare("ello", "Hello"); 
// -> 0.94
```

**`compareOneToMany`**: **returns `StringSimilarityResults class`**
| Param   | Type       | Description                                                                          |
|---------|------------|--------------------------------------------------------------------------------------|
| target  | string     | the searchQuery string to use                                                        |
| compare | string[]   | the String__s__ to compare it against to                                             |
| order   | validOrder | How to order it *(default: descending, except for levenshtein where it's ascending)* |

```js
stringSimilarity("jaro-winkler").compare("ello", ["Hello", "el1o", "Hella", "€11o" ]).bestMatches();
// -> { ello: [  { value: "Hello", match: 0.94 }, { value: "el1o", match: 0.8833333333333333 }, { value: "Hella", match: 0.8049999999999999 }, { value: "€11o", match: 0.55 }  ] }
```

`compareOneToMany`: **returns `StringSimilarityResults class`**
| Param   | Type       | Description                                                                          |
|---------|------------|--------------------------------------------------------------------------------------|
| target  | string[]   | the searchQuery strings to use                                                       |
| compare | string[]   | the String__s__ to compare it against to                                             |
| order   | validOrder | How to order it *(default: descending, except for levenshtein where it's ascending)* |

```js
// you could do multiple string checks at once
stringSimilarity("jaro-winkler").compare(["ello"], ["Hello", "el1o", "Hella", "€11o" ]).bestMatches(); 
// -> { ello: [  { value: "Hello", match: 0.94 }, { value: "el1o", match: 0.8833333333333333 }, { value: "Hella", match: 0.8049999999999999 }, { value: "€11o", match: 0.55 }  ] }
```

**` StringSimilarityResults`**

Utilize the functions (returned by compareMany or compareOneToMany) to get either the bestMatch or an array of bestMatches, which is optionally limitable by length.
| Function                                           | returns                   |
|----------------------------------------------------|---------------------------|
| add(s1: string, s2: string, similarity: number)    | void                      |
| bestMatch()                                        | SimilaritySingleResult    |
| bestMatches(length?: number, bestMatchOnly?:false) | SimilarityMultipleResults |

Types:
```ts
type SimilaritySingleResult = {
    [key: string]: Match;
}

type SimilarityMultipleResults = {
    [key: string]: Match[];
}

type Match = {
    value: string;
    match: number;
}
```

### Contributing
Anyone is welcome contribute to [this project](https://github.com/leodsc/string-similarity-alg/), implementing new algorithms or fixing something.
