import React from 'react';
import './SearchByYear.css';

function SearchByYear(props){
    return (
        <input
            className={ 'search-by-year' }
            type={ 'text' }
            placeholder={ 'Year' }
            onFocus={ event => event.target.placeholder = "" }
            onBlur={ event => event.target.placeholder = "Year" }
            onKeyUp={ event => props.fetchShowsByYear(event.target.value) }
        />
    );
}

export default SearchByYear;