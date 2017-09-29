import { Utilities } from './utilities';

export class Crossword {
    public size: number;
    public grid: String[][];

    constructor(size: number) {
        this.size = size;
        this.grid = this.getEmptyGrid(size);
    }

    public getEmptyGrid(size: number): String[][] {
        return new Array(size).fill(null).map(u => {
            const line = new Array(size).fill(null).map(u => {
                return ' ';
            });
            return line;
        });
    }

    public indexOutOfBounds(i: number): boolean {
        return i < 0 || i >= this.size;
    }

    public indexesOutOfBounds(i: number, j: number): boolean {
        return this.indexOutOfBounds(i) || this.indexOutOfBounds(j);
    }

    public addLetter(i: number, j: number, letter: string): boolean {
        if (this.indexesOutOfBounds(i, j)) {
            return false;
        }
        if (this.grid[i][j] !== ' ' && this.grid[i][j] !== letter) {
            return false;
        }
        this.grid[i][j] = letter;
        return true;
    }

    public addWord(i: number, j: number, word: string, horizontal: boolean): boolean {
        const savedState = Utilities.deepCopy(this.grid);

        for (const letter of word) {
            if (!this.addLetter(i, j, letter)) {
                this.grid = savedState; // rollback
                return false;
            } else {
                i = horizontal ? i : ++i;
                j = horizontal ? ++j : j;
            }
        }

        return true;
    }
}
