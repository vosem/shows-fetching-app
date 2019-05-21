import React from 'react';
import Show from "./Show";
import no_poster from "../assets/no_poster.jpg";

class Shows extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        let shows = this.props.shows;
        let posterUrl,
            poster,
            posterAlt,
            postersFetchingQuantity = "store max count of (un)fetched posters",
            showIndex = this.props.queries ? 10 * (this.props.queries.page - 1) : 1;
        shows = shows && shows.map((show, i) => {
            showIndex++;
            if (this.props.posters) { // TODO: check store count of posters === 0
                poster = this.props.posters.filter(poster => {
                    return poster.poster.thetvdb_id === show.ids.tvdb.toString();
                });
                if(poster[0] && poster[0].poster.tvposter) {
                    posterUrl = poster[0].poster.tvposter[0].url;
                    posterAlt = posterUrl;
                } else{
                    posterUrl = { no_poster }.no_poster;
                    posterAlt = 'no poster'
                }
            }
            const posterLoad = () => {
                postersFetchingQuantity--;
                if (!postersFetchingQuantity) {
                    // console.log('loaded');
                }
            };
            return (<Show
                posters = {this.props.posters}
                posterUrl = {posterUrl}
                posterAlt = {posterAlt}
                key={i+1}
                showNumber={showIndex}
                show={show}
                load={posterLoad}
                error={posterLoad}
            />)}

        );
        return(
            <tbody>{shows}</tbody>
        )
    }

}

export default Shows;