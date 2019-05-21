import React from 'react';
import store from '../store/index';
import {connect} from 'react-redux';
import {
    fetchShowsSuccess,
    fetchShowsError,
    fetchPosterSuccess,
    fetchPosterError,
    generateYearQuery,
    generateTitleQuery,
    fetchCurrentPage,
    fetchPagesTotal,
    generateSortingQuery,
    generatePageQuery
} from '../actions';
import SearchByTitle from "./SearchByTitle";
import SearchByYear from "./SearchByYear";
import SortShows from "./SortShows";
import Pagination from "./Pagination";
import Shows from "./Shows";
import './App.css';

async function fetchShows(options) {

    const { title, year, sorting, page, limit, } = options || {};
    const path = ( sorting && sorting !== 'popular' ? [ 'shows', sorting, ] : ['search', 'show', ] ).join('/');
    const query = {
        extended: 'full',
        query: title || '',
        fields: 'title',
        years: year,
        page: page || 0,
        limit: limit || 10,
    };
    const q = Object.keys(query)
        .filter(_ => _==='query' || query[_] )
        .map(_ => [ _, query[_] ].map(_ => encodeURIComponent(_)).join('=') )
        .join('&');
    const url = `https://api.trakt.tv/${ path }?${ q }`;
    const headers = {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": "31f15cbdee3e55e2ceca6cd2e0e3ba9791b4f1feb1f7bab08c3d8ca6e018609a"
    };
    const response = await fetch(url, { headers });
    let json = await response.json();
    json = json.map(_ => {
        const { score, show, type } = _ || {};
        return { score, type, ...show };
    });
    const currentPage = response.headers.get('x-pagination-page');
    const pagesTotal = response.headers.get('x-pagination-page-count');
    return { json, currentPage, pagesTotal };
}

async function fetchPoster(showId) {
    const path = [ 'v3', 'tv', showId, ].join('/');
    const query = {
        api_key: 'ab75dec43906f846e6200633b9ad43c7',
        client_key: '4c61b1676e8869c4553df95839f5a827',
    };
    const q = Object.keys(query)
        .filter(_ => query[_] )
        .map(_ => [ _, query[_] ].map(_ => encodeURIComponent(_)).join('=') )
        .join('&');
    const url = `http://private-anon-d2c67a30e4-fanarttv.apiary-proxy.com/${ path }?${ q }`;
    // const url = `https://api.thetvdb.com/series/${showId}/images/query?keyType=poster`;              //tvdb
    const headers = {
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTc5MDE4MDcsImlkIjoiZGF0YS1mZXRjaGluZy1hcHAiLCJvcmlnX2lhdCI6MTU1NzgxNTQwNywidXNlcmlkIjo1Mjc5NTIsInVzZXJuYW1lIjoiYW5uYS5wb3BvdnNrYS5maXJlZmx5YjM2In0.nBj-hDm7l4eLQHxCjhiNLc8UeZQZseiw5fKNpssGm1gF8twwGHsOjA7ra7qGZDMwKwo6sLw9egVw2jPUR4xV_WMJ4o02X7x15Ksk5WUXQ1k__7UzvW3vqfkzfXgq93kZW5dknZ97sYh1R06flr0pxICq1QIpOu2JjK3XeXS2VhkPAAzKXdHcEIW_t2ssRnOZe_Cx5l9JrZS-KzvfB-ckEMCdS1YMldTey6GTmllJSYg1ZsgfVWTivAsJKe0OV-4Z40hIDJi2rp4SrfCafyrWS3p3zV4yFhdwpdigc-F0sRQ823cUqoyg54QEmmNQtD5QUPHrlnC3t449gfgVrNlAuw'
    };
    const response = await fetch(url, {
        headers,
        // mode: 'no-cors'
    });

    const json = await response.json();
    return json;
}

function fetchShowsWithRedux(options) {
    return async (dispatch) => {
        try {
            const { json, currentPage, pagesTotal } = await fetchShows(options);
            dispatch(fetchShowsSuccess(json));
            dispatch(fetchCurrentPage(currentPage));
            dispatch(fetchPagesTotal(pagesTotal));
        } catch (e) {
            dispatch(fetchShowsError());
        }
    }
}

function fetchPosterWithRedux(showId) {
    return async ( dispatch ) => {
        try {
            const json = await fetchPoster(showId);
            dispatch(fetchPosterSuccess(json));
        } catch (e) {
            dispatch(fetchPosterError());
        }
        // TODO: decrement store count of posters async load calls
    }
}

///////////////////////// React component //////////////////////

class App extends React.Component {

    constructor(props) {
        super(props);
        this.generateTitleQuery = this.props.generateTitleQuery.bind(this);
        this.generateYearQuery = this.props.generateYearQuery.bind(this);
        this.generatePageQuery = this.props.generatePageQuery.bind(this);
        this.typingTimer = 0;
        this.state = { contentReady: false }
    }

    async componentDidMount() {
        await this.props.fetchShowsWithRedux();
        await this.fetchPosters();
        this.setState({ contentReady: true });
        // console.log(this.state.contentReady);
    }

    fetchPosters = async () => {
        const shows = store.getState().showsState.shows || [];
        const posters = store.getState().postersState.posters;
        // TODO: store max count of posters async load calls
        await shows.forEach( (show) => {
            if (posters)
            {
                if (posters.filter((item) => +item.poster.thetvdb_id === show.ids.tvdb).length !== 0){
                    return;
                } else return this.props.fetchPosterWithRedux(show.ids.tvdb);
            } else return this.props.fetchPosterWithRedux(show.ids.tvdb);
        })
    }

    fetchShowsByTitle = (title) => {
        clearTimeout(this.typingTimer);
        if (title) {
            this.typingTimer = setTimeout(
                async () => {
                    this.generateTitleQuery(title);
                    this.generatePageQuery(1);
                    const options = store.getState().queryState.queries;
                    await this.props.fetchShowsWithRedux(options);
                    this.fetchPosters();
                }, 1000);
        }
    }

    fetchShowsByYear = (year) => {
        clearTimeout(this.typingTimer);
        if (year) {
            this.typingTimer = setTimeout(
                async () => {
                    if (isNaN(year)) {
                        alert("Sorry. There should be a four-digit-number!")
                    } else {
                        this.generateYearQuery(year);
                        this.generatePageQuery(1);
                        const options = store.getState().queryState.queries;
                        await this.props.fetchShowsWithRedux(options);
                        this.fetchPosters();
                    }
                }, 1000);
        }
    }

    fetchShowsBySorting = async (sorting) => {
        this.props.generateSortingQuery(sorting);
        this.props.generatePageQuery(1);
        const options = store.getState().queryState.queries;
        await this.props.fetchShowsWithRedux(options);
        this.fetchPosters();
    }

    fetchShowsByPage = async (page) => {
        this.props.generatePageQuery(page);
        const options = store.getState().queryState.queries;
        await this.props.fetchShowsWithRedux(options);
        this.fetchPosters();
    }

    fetchShowsByEnteredPage = (page) => {
        clearTimeout(this.typingTimer);
        if (page) {
            this.typingTimer = setTimeout(
                async () => {
                    if (isNaN(page)) {
                        alert("Sorry. There should be a number!")
                    } else {
                        const lastPage = +store.getState().queryState.queries.pagesTotal;
                        page = +page > lastPage ? lastPage : page;
                        page = +page < 1 ? 1 : page;
                        this.generatePageQuery(page);
                        let options = store.getState().queryState.queries;
                        await this.props.fetchShowsWithRedux(options);
                        this.fetchPosters();
                    }
                }, 1000);
        }
    }

    render(){
        return (
            <div>
                <Pagination
                    fetchShowsByPage={this.fetchShowsByPage}
                    fetchShowsByEnteredPage={this.fetchShowsByEnteredPage}
                />
                <table>
                    <thead>
                        <tr>
                            <td colSpan="2">
                                <SortShows fetchShowsBySorting={this.fetchShowsBySorting} />
                            </td>
                            <td>
                                <SearchByTitle fetchShowsByTitle={this.fetchShowsByTitle} />
                            </td>
                            <td>Rank</td>
                            <td>
                                <SearchByYear fetchShowsByYear={this.fetchShowsByYear} />
                            </td>
                            <td>TVDB Id</td>
                            <td>No of<br/>Episodes</td>
                        </tr>
                    </thead>
                    <Shows
                        posters={this.props.posters}
                        shows={this.props.shows}
                        queries={this.props.queries}
                    />
                </table>
                <Pagination
                    fetchShowsByPage={this.fetchShowsByPage}
                    fetchShowsByEnteredPage={this.fetchShowsByEnteredPage}
                />
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        posters: state.postersState.posters,
        shows: state.showsState.shows,
        queries: state.queryState.queries
    }
}

let Container = connect(mapStateToProps, {
    fetchPosterWithRedux,
    fetchShowsWithRedux,
    generateTitleQuery,
    generateYearQuery,
    generateSortingQuery,
    generatePageQuery
})(App);

export default Container;
