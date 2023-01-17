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
  
    render() {
        const id = this.props.tileState.key;
        if (this.props.tileState.revealed) {
            if (this.props.tileState.isBomb) {
                return (
                    <button data-testid={id} className="revealedTile bomb">{BOMB_VALUE}</button>
                );
            } else if (this.props.tileState.value === 0) {
                return (
                    <button data-testid={id} className="revealedTile" />
                );
            } else {
                const className = "revealedTile tile" + this.props.tileState.value;
                return (
                    <button data-testid={id} className={className} onClick={this.props.onClick}>{this.props.tileState.value}</button>
                );
            }
        } else if (this.props.tileState.flagged) {
            return (
                <button data-testid={id} className="flaggedTile" onContextMenu={this.props.onContextMenu}>{FLAG_VALUE}</button>
            );
        } else {
            return (
                <button data-testid={id} className="hiddenTile" onClick={this.props.onClick} onContextMenu={this.props.onContextMenu} />
            );
        }
    }
}

export default Tile;
