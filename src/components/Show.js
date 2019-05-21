import React from 'react';
import PropTypes from 'prop-types';
import './Show.css';

function Show (props){
    return (
        <tr className="show">
            <td className="showNumber">{props.showNumber}</td>
            <td className="showPoster">
                <img
                    src={props.posterUrl}
                    alt={props.posterAlt}
                    height="50px"
                    onLoad={props.load.bind(this)}
                    onError={props.load.bind(this)}
                />
            </td>
            <td className="title">{props.show.title}</td>
            <td className="rating">{props.show.rating}</td>
            <td className="year">{props.show.year}</td>
            <td className="showId">{props.show.ids.tvdb}</td>
            <td className="episodes">{props.show.aired_episodes}</td>
        </tr>
    )
}
Show.propTypes = {
    posterUrl: PropTypes.string,
    posterAlt: PropTypes.string,
    show: PropTypes.object

};

export default Show;