/**
 * Copyright (c) 2023, Lawrence Lo. All Rights Reserved
 */
import React from 'react';
import './ControlButton.css';

class ControlButton extends React.Component {
    render() {
        const fs = this.props.float == 'right' ? { float: 'right' } : { float : 'left' };
        return (
            <button className="controlButton" style={fs} onClick={this.props.onClick}>{this.props.value}</button>
        )
    }
}

export default ControlButton;
