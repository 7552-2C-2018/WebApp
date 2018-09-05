import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import './Table.scss';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    const { pageSize } = props;
    this.state = {
      data: [],
      pages: null,
      loading: true,
      pageSize,
    };
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(state, instance) {
    this.setState({
      loading: true,
    });
    const { requestData } = this.props;
    requestData(state.pageSize, state.page, state.sortered, state.filtered)
      .then(response => {
        this.setState({
          data: response.rows,
          pages: response.pages,
          loading: false,
        })
      })
      .catch(error => {
        console.log("Error", error);
        this.setState({
          loading: false,
        })
      });
  }

  render() {
    const { columns } = this.props;
    const { data, pages, loading, pageSize } = this.state;
    return (
      <div className="table">
        <ReactTable
          columns={columns}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          data={data}
          pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          filterable
          defaultPageSize={pageSize}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

Table.propTypes = {
  pageSize: PropTypes.number,
  columns: PropTypes.arrayOf(PropTypes.shape({
    Header: PropTypes.string.isRequired,
    accessor: PropTypes.any.isRequired,
    id: PropTypes.string,
  })).isRequired,
  requestData: PropTypes.func.isRequired,
}

Table.defaultProps = {
  pageSize: 30,
}