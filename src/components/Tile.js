/**
 * Copyright (c) 2023, Lawrence Lo. All Rights Reserved
 */
import React from 'react';
import './Tile.css';

const BOMB_VALUE = '\u{1F4A3}';
const FLAG_VALUE = '\u{1F6A9}';

class Tile extends React.Component {

    constructor(props) {
        super(props);
    }
  
    render() {
        if (this.props.tileState.revealed) {
            if (this.props.tileState.isBomb) {
                return (
                    <div className="revealedTile bomb">{BOMB_VALUE}</div>
                );
            } else if (this.props.tileState.value === 0) {
                return (
                    <div className="revealedTile" />
                );
            } else {
                const className = "revealedTile tile" + this.props.tileState.value;
                return (
                    <div className={className} onClick={this.props.onClick}>{this.props.tileState.value}</div>
                );
            }
        } else if (this.props.tileState.flagged) {
            return (
                <div className="flaggedTile" onContextMenu={this.props.onContextMenu}>{FLAG_VALUE}</div>
            );
        } else {
            return (
                <div className="hiddenTile" onClick={this.props.onClick} onContextMenu={this.props.onContextMenu} />
            );
        }
    }
}

export default Tile;
