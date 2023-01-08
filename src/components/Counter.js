/**
 * Copyright (c) 2023, Lawrence Lo. All Rights Reserved
 */
import React from 'react';
import './Counter.css';

/**
 * Counter class
 * 
 * Displays a 3-digit counter
 */
class Counter extends React.Component {

    /**
     * Renders counter
     * @returns rendered counter
     */
    render() {
        const fs = this.props.float == 'right' ? { float: 'right' } : { float : 'left' };
        return (
            <div className="counter" style={fs}>{this.formatValue(this.props.value)}</div>
        )
    }

    /**
     * Formats the numerical value
     * @param {*} value 
     * @returns 
     */
    formatValue(value) {
        if (value < 10) {
            return "00" + value;
        } else if (value < 100) {
            return "0" + value;
        } else if (value < 1000) {
            return value;
        } else {
            return "XXX";
        }
    }
}


export default Counter;