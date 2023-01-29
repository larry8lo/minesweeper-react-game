/**
 * Copyright (c) 2023, Lawrence Lo. All Rights Reserved
 */
import React from 'react';
import './Slider.css';

/**
 * Slider component
 */
class Slider extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="sliderContainer">
                <span className="sliderLabel">{this.props.label}</span>
                <input type="range" className="sliderRange"
                    min={this.props.min} max={this.props.max} value={this.props.value} 
                    onChange={(event) => this.props.onChange(event.target.value)} />
                <span className="sliderValue">{this.props.value}</span>
            </div>
        )
    }

}

export default Slider;
