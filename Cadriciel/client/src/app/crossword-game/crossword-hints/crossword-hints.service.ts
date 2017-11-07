import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { LexiconService } from '../lexicon.service';
import { CrosswordWordsService } from '../crossword-words.service';
import { CrosswordFoundWordsService } from '../crossword-found-words.service';

import { Hint } from '../shared-classes/hint';
import { Word } from '../../../../../commun/word';

@Injectable()
export class CrosswordHintsService {
    public selectedWord: string;
    public hints: Array<Hint>;
    private selectedWordSubject: Subject<any>;

    constructor(
        private lexiconService: LexiconService,
        private wordsService: CrosswordWordsService,
        public foundWordsService: CrosswordFoundWordsService
    ) {
        this.selectedWordSubject = new Subject();
    }

    public selectedWordAlerts(): Observable<any> {
        return this.selectedWordSubject.asObservable();
    }

    public newGame(wordsWithIndex: Array<Word>) {
        this.selectedWord = undefined;
        this.initializeHints(wordsWithIndex);
    }

    public selectWord(word: string) {
        const wordWithIndex = this.wordsService.getWordWithIndex(word);
        if (wordWithIndex === undefined || this.selectedWord === word) {
            return;
        }
        this.alertNewSelectedWord(wordWithIndex);
        this.selectedWord = word;
    }

    public unselectHint() {
        this.selectedWord = undefined;
    }

    public markHintAsFound(word: string) {
        this.hints.find((hint) => {
            return hint.word === word;
        }).found = true;
    }

    private initializeHints(wordsWithIndex: Array<Word>) {
        this.hints = new Array<Hint>();
        this.lexiconService.getWordDefinitions(
            wordsWithIndex.map(wordWithIndex => wordWithIndex.word)
        ).subscribe((definitions) => {
            definitions.map((definition, i) => {
                this.hints.push(new Hint(wordsWithIndex[i].word, definition));
            });
        });
    }

    private alertNewSelectedWord(word: Word) {
        this.selectedWordSubject.next(
            {
                'previous': this.selectedWord,
                'current': word
            }
        );
    }
}
