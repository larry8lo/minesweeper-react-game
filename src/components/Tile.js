/**
 * Copyright (c) 2023, Lawrence Lo. All Rights Reserved
 */
import React from 'react';
import './Tile.css';

export const BOMB_VALUE = '\u{1F4A3}';
export const FLAG_VALUE = '\u{1F6A9}';

/**
 * A tile in the game board
 */
class Tile extends React.Component {

    constructor(props) {
        super(props);
    }
  
    /**
     * Renders a tile
     * @returns rendered tile
     */
    render() {
        const ts = this.props.tileState;
        const id = ts.key;
        if (ts.revealed) {
            if (ts.isBomb) {
                return (
                    <button data-testid={id} className="revealedTile bomb">{BOMB_VALUE}</button>
                );
            } else {
                const value = ts.value == 0 ? "" : ts.value;
                const className = "revealedTile tile" + ts.value;
                return (
                    <button data-testid={id} className={className} onClick={this.props.onLeftClick} 
                        onContextMenu={e => this.preventDefault(e, this.props.onLeftClick)}>{value}</button>
                );
            }
        } else if (this.props.tileState.flagged) {
            return (
                <button data-testid={id} className="flaggedTile" 
                    onContextMenu={e => this.preventDefault(e, this.props.onRightClick)}>{FLAG_VALUE}</button>
            );
        } else {
            return (
                <button data-testid={id} className="hiddenTile" onClick={this.props.onLeftClick} 
                    onContextMenu={e => this.preventDefault(e, this.props.onRightClick)} />
            );
        }
    }

    preventDefault(event, handler) {
        event.preventDefault();
        handler();
    }
}

export default Tile;
