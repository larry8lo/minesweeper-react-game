/**
 * Copyright (c) 2023, Lawrence Lo. All Rights Reserved
 */
import React from 'react';
import './Choice.css';

/**
 * Choice is like a radio button but in the form of a regular button
 */
class Choice extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const className = this.props.selected ? 'choiceSel' : 'choice';
        return (
            <button className={className} onClick={this.props.onClick}>{this.props.label}</button>
        );
    }

}

export default Choice;
