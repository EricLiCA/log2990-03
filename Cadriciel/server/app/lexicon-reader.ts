import * as fs from 'fs';
import * as request from 'request';
import * as async from 'async';

export class LexiconReader {

    public readWords(file: string): string[] {
        return fs.readFileSync(file, 'utf8').split('\r\n');
    }

    public readWordsOfLength(lexicon: string[], wordLength: number): string[] {
        return lexicon.filter((word) => {
            return wordLength === word.length;
        });
    }

    public getWordsWithChar(lexicon: string[], character: string, position: number) {
        const wordsWithChar: string[] = [];

        for (const word of lexicon) {
            if (position < word.length && word.charAt(position) === character) {
                wordsWithChar.push(word);
            }
        }

        return wordsWithChar;
    }

    public getWordsMatchingPattern(lexicon: string[], pattern: string) {
        const wordsWithChar: string[] = [];
        const wordsPatternLength: string[] = this.readWordsOfLength(lexicon, pattern.length);

        for (let i = 0; i < wordsPatternLength.length; i++) {
            let match = true;
            for (let j = 0; j < pattern.length; j++) {
                if (wordsPatternLength[i][j] !== pattern[j] && pattern[j] !== ' ') {
                    match = false;
                }
            }
            if (match) {
                wordsWithChar.push(wordsPatternLength[i]);
            }
        }

        return wordsWithChar;
    }

    public async getUncommonWords(lexicon: string[]): Promise<any> {
        const randomWords = Array(40).fill(null).map((value) => {
            const randomWord = lexicon[Math.floor(Math.random() * lexicon.length)];
            return randomWord;
        });
        return new Promise(
            (resolve) => {
                async.filter(randomWords, (word, callback) => {
                    this.getWordFrequency(word).then((frequency) => {
                        callback(null, frequency < 1);
                    });
                }, (err, results: string[]) => {
                    resolve(results);
                });
            });
    }

    public async getCommonWords(lexicon: string[]): Promise<any> {
        const randomWords = Array(40).fill(null).map((value) => {
            const randomWord = lexicon[Math.floor(Math.random() * lexicon.length)];
            return randomWord;
        });
        return new Promise(
            (resolve) => {
                async.filter(randomWords, (word, callback) => {
                    this.getWordFrequency(word).then((frequency) => {
                        callback(null, frequency >= 1);
                    });
                }, (err, results: string[]) => {
                    resolve(results);
                });
            });
    }

    public getWordFrequency(word: string): Promise<number> {
        const uri = 'http://api.wordnik.com:80/v4/word.json';
        const options = 'frequency?useCanonical=false&startYear=2012&endYear=' +
            '2012&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';

        return new Promise<number>(resolve => {
            request(`${uri}/${word}/${options}`, (error, response, body) => {
                body = JSON.parse(body);
                resolve(body.totalCount);
            });
        });
    }

    public getWordDefinitions(word: string): Promise<string[]> {
        const uri = 'http://api.wordnik.com:80/v4/word.json';
        const options = 'definitions?limit=200&includeRelated=true&useCanonical=false' +
            '&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
        let definitions: string[] = [];

        return new Promise<string[]>(resolve => {
            request(`${uri}/${word}/${options}`, (error, response, body) => {
                if (body === '[]') {
                    definitions = [];
                } else {
                    body = JSON.parse(body);
                    for (let i = 0; i < body.length; i++) {
                        definitions.push(body[i].text);
                    }
                }
                resolve(definitions);
            });
        });
    }
}




