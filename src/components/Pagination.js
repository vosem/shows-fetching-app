import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import './Pagination.css';

class Pagination extends React.Component {

    clearInput = () => {ReactDOM.findDOMNode(this.refs.currentPageInput).value=""};

    render() {
        let lastPage = this.props.queries && this.props.queries.pagesTotal || 1;
        let currentPage = this.props.queries && this.props.queries.page || 1;
        let placeholder = `Current page: ${currentPage}`;
        return (
            <div className="pagination">
                <button
                    disabled={currentPage < 2}
                    value={currentPage}
                    onClick={() => {this.props.fetchShowsByPage(+currentPage - 1); this.clearInput()}}
                >
                    {'<'}
                </button>
                <button
                    disabled={currentPage === "1"}
                    onClick={() => {this.props.fetchShowsByPage(1); this.clearInput()}}
                >
                    1
                </button>
                <input
                    ref="currentPageInput"
                    type="text"
                    placeholder={placeholder}
                    onFocus={(e) => e.target.placeholder = ""}
                    onBlur={(e) => e.target.placeholder = placeholder}
                    onKeyUp={event => {
                            this.props.fetchShowsByEnteredPage(event.target.value);
                            setTimeout(() => {
                                this.clearInput();
                            }, 5000)
                        }
                    }
                />
                <button
                    value={ lastPage }
                    onClick={() => {this.props.fetchShowsByPage(lastPage); this.clearInput()}}
                >
                    Last page: { lastPage }
                </button>
                <button
                    disabled={currentPage > lastPage - 1}
                    value={currentPage}
                    onClick={() => {
                        this.props.fetchShowsByPage(+currentPage + 1); this.clearInput()}}
                >
                    {'>'}
                </button>
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        queries: state.queryState.queries
    }
}

export default connect(mapStateToProps)(Pagination);