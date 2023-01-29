/**
 * Copyright (c) 2023, Lawrence Lo. All Rights Reserved
 */
import React from 'react';
import * as ReactDOM from 'react-dom';
import './Modal.css';

/**
 * Modal component
 */
class Modal extends React.Component {

    constructor(props) {
        super(props);
        this.elem = document.createElement('div');
    }

    componentDidMount() {
        this.props.container.appendChild(this.elem);
    }

    componentWillUnmount() {
        this.props.container.removeChild(this.elem);
    }

    render() {
        const overlayStyle = { width: this.props.overlayWidth, height: this.props.overlayHeight };
        const content = (
            <div className="modalOverlay" style={overlayStyle}>
                <div className="modalRoot">
                    <div className="modalTitle">
                        {this.props.title}
                        <button className="modalCloseButton" onClick={this.props.onClose}>&#x2715;</button>
                    </div>
                    <div className="modalContent">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
        return ReactDOM.createPortal(content, this.elem);
    }

}

export default Modal;
