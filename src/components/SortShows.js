import React from 'react';
import './SortShows.css';

function SortShows (props){
    return (
        <select
            className="sort-shows"
            name = "sortShows"
            defaultValue={"popular"}
            onChange={event => props.fetchShowsBySorting(event.target.value) }
            style={{width: 100 + '%'}}
        >
            <option value={"popular"}>popular</option>
            <option value={"trending"}>trending</option>
            <option value={"played"}>played</option>
            <option value={"watched"}>watched</option>
            <option value={"anticipated"}>anticipated</option>
        </select>
    )
}

export default SortShows;