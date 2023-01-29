/**
 * Copyright (c) 2023, Lawrence Lo. All Rights Reserved
 */
import React from 'react';
import './Game.css';
import ControlButton from './ControlButton.js';
import Counter from './Counter.js';
import Tile, { BOMB_VALUE } from './Tile.js';
import Modal from './Modal.js';
import Slider from './Slider.js';
import Choice from './Choice.js';

// Game state constants
export const START_WAIT = "start_wait";
export const PLAYING = "playing";
export const WON = "won";
export const LOST = "lost";

// Game button values
export const GAME_BUTTON_VALUES = {};
GAME_BUTTON_VALUES[START_WAIT] = '\u{1F60A}';
GAME_BUTTON_VALUES[PLAYING] = '\u{1F60A}';
GAME_BUTTON_VALUES[WON] = '\u{1F60E}';
GAME_BUTTON_VALUES[LOST] = '\u{1F616}';

export const GEAR_VALUE = '\u{1F6E0}';
export const QUESTION_VALUE = '\u{2753}';

const SMALL = "small";
const MEDIUM = "medium";
const LARGE = "large";
const CUSTOM = "custom";
const GAME_SIZE = {};
GAME_SIZE[SMALL] = { width: 9, height: 9, bombs: 10 };
GAME_SIZE[MEDIUM] = { width: 16, height: 16, bombs: 40 };
GAME_SIZE[LARGE] = { width: 30, height: 16, bombs: 99 };

const WIDTH_EMOJI = '\u{2194}';
const HEIGHT_EMOJI = '\u{2195}';

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
        this.settings = {
            width: this.props.width,
            height: this.props.height,
            bombs: this.props.bombs,
        };
        this.state = this.createState(this.settings.width, this.settings.height, this.settings.bombs);
    }

    /**
     * Initializes the game
     */
    createState(width, height, bombs) {
        return {
            width: width,
            height: height,
            tiles: this.fillBoard(width, height, bombs),
            bombCount: bombs,
            elapsedSecs: 0,
            gameState: START_WAIT,
            showAbout: false,
            showSettings: false,
            settingsModal: {
                widthSlider: width,
                heightSlider: height,
                bombSlider: bombs,
            },
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
                board[y][x] = createTileState(x, y, false, -1, false, false);
            }
        }

        // put bombs into the board
        const bombPlanter = this.props.bombPlanter ? this.props.bombPlanter : randomlyPlantBombs;
        bombPlanter(width, height, bombs).forEach(pt => {
            board[pt.y][pt.x].isBomb = true; 
        });

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
     * Resizes the game
     * @param {*} width 
     * @param {*} height 
     * @param {*} bombs 
     */
    resizeGame(width, height, bombs) {
        this.settings = {
            width: width,
            height: height,
            bombs: bombs,
        };
        this.restartGame();
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
        this.setState(this.createState(this.settings.width, this.settings.height, this.settings.bombs));
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

        let modal = null;
        if (this.state.showAbout || this.state.showSettings) {
            if (this.state.showAbout) {
                modal = this.renderAboutModal();
            } else if (this.state.showSettings) {
                modal = this.renderSetingsModal();
            }
        }

        return (
            <div id="game" className="gameContainer">
                <div key="modal" id="modal" className="modalContainer" />
                {modal}
                <div key="status" id="status" className="statusContainer">
                    <Counter key="bombCounter" value={this.state.bombCount} float="left"/>
                    <ControlButton key="restartButton" 
                        value={GAME_BUTTON_VALUES[this.state.gameState]} 
                        float="left" onClick={() => this.restartGame()} />
                    <Counter key="timer" value={this.state.elapsedSecs} float="left" />
                    <ControlButton key="aboutButton" value={QUESTION_VALUE} float="right"  
                        onClick={() => this.showAbout()}/>
                    <ControlButton key="settingsButton" value={GEAR_VALUE} float="right" 
                        onClick={() => this.showSettings()}/>
                </div>
                <div key="board" id="board" className="boardContainer" onContextMenu={e => e.preventDefault()}>
                {this.state.tiles.map(row => (
                    <div key={"r" + row[0].y} className="boardRow">
                    {row.map(tile => (
                        <Tile 
                            key={tile.key} 
                            tileState={tile} 
                            onLeftClick={() => this.revealTile(tile)} 
                            onRightClick={() => this.flagTile(tile)}/>
                    ))}
                    </div>  
                ))}
                </div>
            </div>
        )
    }

    /**
     * Renders the About modal
     * @returns 
     */
    renderAboutModal() {
        const modalContainer = document.getElementById('modal');
        const overlayWidth = document.getElementById('game').offsetWidth;
        const overlayHeight = document.getElementById('game').offsetHeight;
        return (
            <Modal key="aboutModal" container={modalContainer} overlayWidth={overlayWidth} 
                overlayHeight={overlayHeight} title="About..." onClose={() => this.hideAbout()}>
                <div style={{fontSize: 36}}>{BOMB_VALUE}</div>
                <p>Minesweeper React Game</p>
                <p>Author: Larry Lo</p>
            </Modal>
        );
    }

    showAbout() {
        this.setState({showAbout: true});
    }

    hideAbout() {
        this.setState({showAbout: false});
    }

    /**
     * Renders the Settings Modal
     * @returns 
     */
    renderSetingsModal() {
        const modalContainer = document.getElementById('modal');
        const overlayWidth = document.getElementById('game').offsetWidth;
        const overlayHeight = document.getElementById('game').offsetHeight;
        const settings = this.state.settingsModal;
        const selected = this.findSelected(settings.widthSlider, settings.heightSlider, settings.bombSlider);
        const boardMax = Math.min(250, settings.widthSlider * settings.heightSlider);
        return (
            <Modal key="settingsModal" container={modalContainer} overlayWidth={overlayWidth} 
                overlayHeight={overlayHeight} title="Settings..." onClose={() => this.hideSettings()}>
                <div className="settingsSizePane">
                    <Choice key="k_s" label="Small" selected={selected == SMALL} onClick={() => this.chooseSize(SMALL)} /> 
                    <Choice key="k_m" label="Medium" selected={selected == MEDIUM} onClick={() => this.chooseSize(MEDIUM)} /> 
                    <Choice key="k_l" label="Large" selected={selected == LARGE} onClick={() => this.chooseSize(LARGE)} /> 
                    <Choice key="k_c" label="Custom" selected={selected == CUSTOM} onClick={() => this.chooseSize(CUSTOM)} />
                </div>
                <div className="settingsSliderPane">
                    <Slider key="s_w" min="9" max="30" label={WIDTH_EMOJI}
                        value={settings.widthSlider} 
                        onChange={v => this.updateSlider('widthSlider', v)} />
                    <Slider key="s_h" min="9" max="30" label={HEIGHT_EMOJI}
                        value={settings.heightSlider} 
                        onChange={v => this.updateSlider('heightSlider', v)} />
                    <Slider key="s_b" min="10" max={boardMax} label={BOMB_VALUE}
                        value={settings.bombSlider} 
                        onChange={v => this.updateSlider('bombSlider', v)} />
                </div>
            </Modal>
        );
    }

    findSelected(width, height, bombs) {
        let selected = CUSTOM;
        for (const [key, value] of Object.entries(GAME_SIZE)) {
            if (value.width == width && value.height == height && value.bombs == bombs) {
                selected = key;
            }
        }
        return selected;
    }

    showSettings() {
        this.setState({showSettings: true});
    }

    hideSettings() {
        const settingsChanged = 
           this.state.settingsModal.widthSlider != this.state.width || 
           this.state.settingsModal.heightSlider != this.state.height || 
           this.state.settingsModal.bombSlider != this.state.bombCount;
        if (settingsChanged) {
            const width = parseInt(this.state.settingsModal.widthSlider);
            const height = parseInt(this.state.settingsModal.heightSlider);
            const bombs = parseInt(this.state.settingsModal.bombSlider);
            setTimeout(() => this.resizeGame(width, height, bombs), 5);
        }
        this.setState({showSettings: false});
    }

    chooseSize(size) {
        if (size === CUSTOM) {
            return;
        }
        const obj = { 
            widthSlider: GAME_SIZE[size].width,
            heightSlider: GAME_SIZE[size].height,
            bombSlider: GAME_SIZE[size].bombs
        };
        this.setState({settingsModal: obj});
    }

    updateSlider(key, value) {
        const obj = Object.assign({}, this.state.settingsModal);
        obj[key] = value;
        const boardMax = Math.min(250, obj.widthSlider * obj.heightSlider);
        obj.bombSlider = Math.min(obj.bombSlider, boardMax);
        this.setState({settingsModal: obj});
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
                newTiles[t.y][t.x] = createTileState(t.x, t.y, t.isBomb, t.value, true, t.flagged);
            }

            // propagate the reveal under two conditions:
            // (1) the revealed tile has value 0
            // (2) the tile value is larger than zero and matches number of flags in adjacent tiles
            const propagateReveal = (t.value == 0) || (t.value > 0 && this.countAdjacentFlags(newTiles, t, this.state.width, this.state.height) == t.value);
            if (propagateReveal) {
                for (let y = Math.max(t.y - 1, 0); y <= Math.min(t.y + 1, this.settings.height - 1); y++) {
                    for (let x = Math.max(t.x - 1, 0); x <= Math.min(t.x + 1, this.settings.width - 1); x++) {
                        if (!newTiles[y][x].revealed && !newTiles[y][x].flagged) {
                            queue.push(newTiles[y][x]);
                        }
                    }
                }
            }
        }

        if (gameState != LOST) {
            // check for game winning condition
            if (this.isGameWon(newTiles, this.settings.width, this.settings.height)) {
                gameState = WON;
                this.flagAllTiles(newTiles);
                newState.bombCount = 0;
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
        for (let y = 0; y < this.settings.height; y++) {
            for (let x = 0; x < this.settings.width; x++) {
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
        for (let y = 0; y < this.settings.height; y++) {
            for (let x = 0; x < this.settings.width; x++) {
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
        for (let j = Math.max(y - 1, 0); j <= Math.min(y + 1, height - 1); j++) {
            for (let i = Math.max(x - 1, 0); i <= Math.min(x + 1, width - 1); i++) {
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
    countAdjacentFlags(tiles, tile, width, height) {
        let count = 0;
        for (let y = Math.max(tile.y - 1, 0); y <= Math.min(tile.y + 1, height - 1); y++) {
            for (let x = Math.max(tile.x - 1, 0); x <= Math.min(tile.x + 1, width - 1); x++) {
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
        newTiles[tile.y][tile.x] = createTileState(tile.x, tile.y, tile.isBomb, tile.value, tile.revealed, flagged);
        let bombCount = parseInt(this.state.bombCount) + (flagged ? -1 : 1);
        this.setState({ tiles: newTiles, bombCount: bombCount });
    }

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
export function createTileState(x, y, isBomb, value, revealed, flagged) {
    return { 
        key: "t" + y + "_" + x,
        x: x,
        y: y, 
        isBomb: isBomb, 
        value: value, 
        revealed: revealed,
        flagged: flagged,
    };
}
  
/**
 * Get a list of randomly placed bombs
 * @param {*} bombs 
 */
function randomlyPlantBombs(width, height, bombs) {
    const array = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            array.push({x: x, y: y});
        }
    }
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.slice(0, bombs);
}

export default Game;
