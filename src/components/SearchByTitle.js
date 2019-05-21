import React from 'react';
import ReactDOM from "react-dom";
import './SearchByTitle.css';

function SearchByTitle (props) {

     // clearInput() {ReactDOM.findDOMNode(this.refs.currentPageInput).value=""};

    return (
        <input
            className="search-by-title"
            type="text"
            placeholder="Title"
            onFocus={event => event.target.placeholder = ""}
            onBlur={event => event.target.placeholder = "Title"}
            onKeyUp={event => {props.fetchShowsByTitle(event.target.value)/*; console.log('input ref: ', ReactDOM.findDOMNode(this.refs.currentPageInput))*/}}
        />
    )
}

export default SearchByTitle;