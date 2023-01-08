/**
 * Copyright (c) 2023, Lawrence Lo. All Rights Reserved
 */
import React from 'react';
import './Game.css';
import ControlButton from './ControlButton.js';
import Counter from './Counter.js';
import Tile from './Tile.js';

// Game state constants
const START_WAIT = "start_wait";
const PLAYING = "playing";
const WON = "won";
const LOST = "lost";

// Game button values
const GAME_BUTTON_VALUES = {};
GAME_BUTTON_VALUES[START_WAIT] = '\u{1F60A}';
GAME_BUTTON_VALUES[PLAYING] = '\u{1F60A}';
GAME_BUTTON_VALUES[WON] = '\u{1F60E}';
GAME_BUTTON_VALUES[LOST] = '\u{1F616}';

const GEAR_VALUE = '\u{1F6E0}';
const QUESTION_VALUE = '\u{2753}';

/**
 * Minesweeper game
 */
class Game extends React.Component {

    /**
     * Constructor
     * 
     * @param {*} props 
     */
    constructor(props) {
        super(props);
        this.state = this.createState(this.props.width, this.props.height, this.props.bombs);
    }

    /**
     * Initializes the game
     */
    createState(width, height, bombs) {
        return {
        tiles: this.fillBoard(width, height, bombs),
        bombCounter: bombs,
        elapsedSecs: 0,
        gameState: START_WAIT,
        };
    }

    /**
     * Populates board with bombs and numeric values
     * @param {*} width 
     * @param {*} height 
     * @param {*} bombs 
     * @returns 
     */
    fillBoard(width, height, bombs) {

        // create 2-d array
        const board = Array(height);
        for (let y = 0; y < height; y++) {
            board[y] = Array(width);
        }

        // create a tile state for each cell
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                board[y][x] = this.createTileState(x, y, false, -1, false, false);
            }
        }

        // put bombs into the board
        for (let i = 0; i < bombs; i++) {
            let x, y;
            do {
                x = randomInt(width);
                y = randomInt(height);
            } while (board[y][x].isBomb)
            board[y][x].isBomb = true;  
        }

        // compute adjacent bomb count
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (!board[y][x].isBomb) {
                board[y][x].value = this.countAdjacentBombs(x, y, board, width, height);
                }
            }
        }
        return board;
    }

    /**
     * Is game state a ended state
     * @param {*} gameState 
     * @returns 
     */
    isGameEnded(gameState) {
        return gameState === WON || gameState === LOST;
    }

    /**
     * Restarts game
     */
    restartGame() {
        if (this.state.timerInterval) {
            clearInterval(this.state.timerInterval);
        }
        this.setState(this.createState(this.props.width, this.props.height, this.props.bombs));
    }

    /**
     * Determines if game is won
     * @param {*} tiles 
     * @param {*} width 
     * @param {*} height 
     * @returns 
     */
    isGameWon(tiles, width, height) {
        let revealedCount = 0;
        let bombCount = 0;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                revealedCount += tiles[y][x].revealed ? 1 : 0;
                bombCount += tiles[y][x].isBomb ? 1 : 0;
            }
        }
        return revealedCount + bombCount == width * height;
    }

    /**
     * Update elapsed time display
     */
    updateTimer() {
        const t = Math.floor((Date.now() - this.state.startTime) / 1000);
        this.setState({
            elapsedSecs: t
        });
    }

    /**
     * Renders elements
     * 
     * @returns rendered elements
     */
    render() {
        return (
        <div className="gameContainer">
            <div className="statusContainer">
            <Counter key="bombCounter" value={this.state.bombCounter} float="left"/>
            <ControlButton value={GAME_BUTTON_VALUES[this.state.gameState]} float="left" onClick={() => this.restartGame()} />
            <Counter key="timer" value={this.state.elapsedSecs} float="left" />
            <ControlButton value={QUESTION_VALUE} float="right" />
            <ControlButton value={GEAR_VALUE} float="right" />
            </div>
            <div className="boardContainer">
            {this.state.tiles.map(row => (
                <div className="boardRow">
                {row.map(tile => (
                    <Tile 
                        key={tile.key} 
                        tileState={tile} 
                        onClick={() => this.revealTile(tile)} 
                        onContextMenu={(e) => { e.preventDefault();this.flagTile(tile); }}/>
                ))}
                </div>  
            ))}
            </div>
        </div>
        )
    }

    /**
     * Reveal a tile
     * 
     * @param {*} tile 
     */
    revealTile(tile) {

        // if tile is flagged, exit
        if (tile.flagged) {
            return;
        }

        // if game has ended then exit
        if (this.isGameEnded(this.state.gameState)) {
            return;
        }

        // game state
        let gameState = this.state.gameState;

        // check for timer start
        const newState = {};
        if (gameState == START_WAIT) {
            gameState = PLAYING;
            newState.startTime = Date.now();
            newState.timerInterval = setInterval(() => {this.updateTimer()}, 100);
        }

        // create new board
        const newTiles = this.state.tiles.slice();
        const queue = Array();
        queue.push(tile);
        
        // loop over "empty" patches
        while (queue.length > 0) {
            const t = queue.pop();

            // check for end game
            if (t.isBomb) {
                // lose!
                gameState = LOST;
            }

            // reveal a hidden tile
            if (!t.revealed) {
                if (newTiles[t.y] === this.state.tiles[t.y]) {
                    newTiles[t.y] = this.state.tiles[t.y].slice();
                }
                newTiles[t.y][t.x] = this.createTileState(t.x, t.y, t.isBomb, t.value, true, t.flagged);
            }

            // propagate the reveal under two conditions:
            // (1) the revealed tile has value 0
            // (2) the tile value is larger than zero and matches number of flags in adjacent tiles
            const propagateReveal = (t.value == 0) || (t.value > 0 && this.countAdjacentFlags(newTiles, t) == t.value);
            if (propagateReveal) {
                for (let y = Math.max(t.y - 1, 0); y <= Math.min(t.y + 1, this.props.height - 1); y++) {
                    for (let x = Math.max(t.x - 1, 0); x <= Math.min(t.x + 1, this.props.width - 1); x++) {
                        if (!newTiles[y][x].revealed && !newTiles[y][x].flagged) {
                            queue.push(newTiles[y][x]);
                        }
                    }
                }
            }
        }

        if (gameState != LOST) {
            // check for game winning condition
            if (this.isGameWon(newTiles, this.props.width, this.props.height)) {
                gameState = WON;
                this.flagAllTiles(newTiles);
            }
        } else {
            // game lost, reveal all bombs
            this.revealAllBombs(newTiles);
        }

        if (this.isGameEnded(gameState)) {
            clearInterval(this.state.timerInterval);
        }

        // update state of the game
        newState.tiles = newTiles;
        newState.gameState = gameState;
        this.setState(newState);
    }

    /**
     * Flag all tiles
     * @param {*} tiles 
     */
    flagAllTiles(tiles) {
        for (let y = 0; y < this.props.height; y++) {
            for (let x = 0; x < this.props.width; x++) {
                if (tiles[y][x].isBomb && !tiles[y][x].flagged) {
                    tiles[y][x].flagged = true;
                }
            }
        }
    }

    /**
     * Reveal all bombs
     * @param {*} tiles 
     */
    revealAllBombs(tiles) {
        for (let y = 0; y < this.props.height; y++) {
            for (let x = 0; x < this.props.width; x++) {
                if (tiles[y][x].isBomb && !tiles[y][x].flagged) {
                    tiles[y][x].revealed = true;
                }
            }
        }
    }

    /**
     * Count bombs
     * @param {*} x 
     * @param {*} y 
     * @param {*} board 
     * @param {*} width 
     * @param {*} height 
     * @returns 
     */
    countAdjacentBombs(x, y, board, width, height) {
        let count = 0;
        for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, width - 1); j++) {
            for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, height - 1); i++) {
                if (board[j][i].isBomb) {
                    count++;
                }
            }
        }
        return count;
    }  

    /**
     * Count adjacent flags
     * @param {*} tiles 
     * @param {*} tile 
     * @returns 
     */
    countAdjacentFlags(tiles, tile) {
        let count = 0;
        for (let y = Math.max(tile.y - 1, 0); y <= Math.min(tile.y + 1, this.props.height - 1); y++) {
            for (let x = Math.max(tile.x - 1, 0); x <= Math.min(tile.x + 1, this.props.width - 1); x++) {
                count += tiles[y][x].flagged ? 1 : 0;
            }
        }
        return count;
    }

    /**
     * Toggle flag on a tile
     * @param {*} tile 
     */
    flagTile(tile) {
        if (this.isGameEnded(this.state.gameState)) {
            return;
        }
        const flagged = !this.state.tiles[tile.y][tile.x].flagged;
        const newTiles = this.state.tiles.slice();
        newTiles[tile.y] = this.state.tiles[tile.y].slice();
        newTiles[tile.y][tile.x] = this.createTileState(tile.x, tile.y, tile.isBomb, tile.value, tile.revealed, flagged);
        let counter = parseInt(this.state.bombCounter) + (flagged ? -1 : 1);
        this.setState({ tiles: newTiles, bombCounter: counter });
    }

    /**
     * Create tile state
     * @param {*} x 
     * @param {*} y 
     * @param {*} isBomb 
     * @param {*} value 
     * @param {*} revealed 
     * @param {*} flagged 
     * @returns 
     */
    createTileState(x, y, isBomb, value, revealed, flagged) {
        return { 
            key: "(" + x + "," + y + ")",
            x: x,
            y: y, 
            isBomb: isBomb, 
            value: value, 
            revealed: revealed,
            flagged: flagged,
        };
    }
  
}

/**
 * Generate random integer
 * @param {*} value 
 * @returns 
 */
function randomInt(value) {
    return Math.floor(Math.random() * value);
}

export default Game;
