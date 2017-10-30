import { TestBed } from '@angular/core/testing';

import { CrosswordGridService } from './crossword-grid.service';
import { CrosswordPointsService } from '../crossword-points/crossword-points.service';

let gridService: CrosswordGridService;

const grid = [
    ['a', 'p', 'p', 'e', 'a', 'l', '#', 'r', 'a', 't'],
    ['#', ' ', ' ', '#', ' ', ' ', ' ', 'i', ' ', 'e'],
    ['s', '#', 'a', 'p', 'p', 'e', 'n', 'd', 'i', 'x'],
    ['t', ' ', ' ', 'r', ' ', ' ', '#', 'e', ' ', 't'],
    ['a', '#', 'w', 'a', 'r', '#', 'p', '#', ' ', 'b'],
    ['f', ' ', ' ', 'c', '#', 'r', 'a', 'd', 'i', 'o'],
    ['f', 'i', 's', 't', '#', ' ', 's', ' ', ' ', 'o'],
    ['#', ' ', ' ', 'i', ' ', ' ', '#', ' ', ' ', 'k'],
    ['f', 'l', 'i', 'c', 'k', '#', ' ', ' ', ' ', '#'],
    [' ', ' ', ' ', 'e', ' ', ' ', ' ', ' ', ' ', ' ']
];

const wordsWithIndex = [
    { 'i': 0, 'j': 0, 'word': 'appeal', 'horizontal': true },
    { 'i': 0, 'j': 9, 'word': 'textbook', 'horizontal': false },
    { 'i': 2, 'j': 2, 'word': 'appendix', 'horizontal': true },
    { 'i': 0, 'j': 7, 'word': 'ride', 'horizontal': false },
    { 'i': 0, 'j': 7, 'word': 'rat', 'horizontal': true },
    { 'i': 5, 'j': 5, 'word': 'radio', 'horizontal': true },
    { 'i': 4, 'j': 6, 'word': 'pas', 'horizontal': false },
    { 'i': 2, 'j': 3, 'word': 'practice', 'horizontal': false },
    { 'i': 4, 'j': 2, 'word': 'war', 'horizontal': true },
    { 'i': 6, 'j': 0, 'word': 'fist', 'horizontal': true },
    { 'i': 8, 'j': 0, 'word': 'flick', 'horizontal': true },
    { 'i': 2, 'j': 0, 'word': 'staff', 'horizontal': false }
];

describe('#CrosswordGridService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CrosswordPointsService,
                CrosswordGridService
            ]
        });
        gridService = TestBed.get(CrosswordGridService);
    });

    it('should construct', () => {
        expect(gridService).toBeDefined();
    });

    describe('initialize()', () => {
        describe('construction', () => {
            it('should initialize the grid of CrosswordSquares', () => {
                expect(gridService.grid).toBeUndefined();
                gridService.initialize(grid, wordsWithIndex);
                expect(gridService.grid).toBeDefined();
            });
        });

        describe('behaviour', () => {
            beforeEach(() => {
                gridService.initialize(grid, wordsWithIndex);
            });

            it('should initialize the answers of the grid', () => {
                gridService.grid.map((row, i) => {
                    row.map((square, j) => {
                        expect(square.answer).toEqual(grid[i][j]);
                    });
                });
            });

            it('should initialize the words contributing to each index', () => {
                expect(gridService.grid[1][0].words.length).toEqual(0);

                expect(gridService.grid[0][0].words.length).toEqual(1);
                gridService.grid[0][0].words.map((word) => {
                    expect(word).toEqual('appeal');
                });

                expect(gridService.grid[0][9].words.length).toEqual(2);
                gridService.grid[0][9].words.map((word) => {
                    expect(['rat', 'textbook']).toContain(word);
                });
            });

            it('should identify empty squares', () => {
                expect(gridService.grid[0][0].empty).toBeTruthy();
                expect(gridService.grid[1][0].empty).toBeFalsy();
            });

            it('should identify black squares as # or " "', () => {
                expect(gridService.grid[0][0].black).toBeFalsy();
                expect(gridService.grid[1][0].black).toBeTruthy();
                expect(gridService.grid[1][1].black).toBeTruthy();
            });

            it('should have no initial input on empty squares', () => {
                expect(gridService.grid[0][0].empty).toBeTruthy();
                expect(gridService.grid[0][0].input).toEqual('');
            });

            it('should not select anything at initialization', () => {
                for (const row of gridService.grid) {
                    for (const square of row) {
                        expect(square.selected).toBeFalsy();
                        expect(square.player1Selected).toBeFalsy();
                        expect(square.player2Selected).toBeFalsy();
                    }
                }
            });
        });
    });

    describe('insertLetter()', () => {

        beforeEach(() => {
            gridService.initialize(grid, wordsWithIndex);
        });

        it('should insert a letter when the square is empty', () => {
            expect(gridService.grid[0][0].empty).toBeTruthy();
            gridService.insertLetter('A', 0, 0);
            expect(gridService.grid[0][0].input).toEqual('a');
        });

        it('should not insert a letter when the square is black', () => {
            expect(gridService.grid[1][0].black).toBeTruthy();
            gridService.insertLetter('A', 1, 0);
            expect(gridService.grid[1][0].input).toEqual('');
        });

        it('should allow overwriting if the letter is not found', () => {
            gridService.insertLetter('A', 0, 0);
            expect(gridService.grid[0][0].input).toEqual('a');
            gridService.insertLetter('B', 0, 0);
            expect(gridService.grid[0][0].input).toEqual('b');
        });

        it('should not allow overwriting if the letter is found', () => {
            gridService.insertLetter('A', 0, 0);
            expect(gridService.grid[0][0].input).toEqual('a');

            gridService.grid[0][0].found = true;
            gridService.insertLetter('B', 0, 0);
            expect(gridService.grid[0][0].input).toEqual('a');
        });
    });
});
