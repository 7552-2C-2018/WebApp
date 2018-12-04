import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import checkboxHOC from "react-table/lib/hoc/selectTable";
const CheckboxTable = checkboxHOC(ReactTable);
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
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
      selection: [],
      selectAll: false,
      lastState: null,
      instance: null,
      modal: false,
      postData: {},
    };
    this.fetchData = this.fetchData.bind(this);
    this.renderEditable = this.renderEditable.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.toggleSelection = this.toggleSelection.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }

  fetchData(state, instance) {
    this.setState({
      loading: true,
      lastState: state,
      instance
    });
    const { requestGet } = this.props;
    requestGet(state.pageSize, state.page, state.sortered, state.filtered)
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


  renderEditable(cellInfo) {
    const { requestPut } = this.props;
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const oldValue = cellInfo.value;
          const originalElement = cellInfo.original;
          const newValue = e.target.innerHTML;
          if (oldValue !== newValue) {
            originalElement[cellInfo.column.id] = newValue;
            requestPut(originalElement)
              .then(response => {
                const data = [...this.state.data];
                data[cellInfo.index][cellInfo.column.id] = newValue;
                this.setState({ data });
              })
              .catch(err => {
                console.log(err);
              });
          }
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.data[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }

  isSelected(key) {
    return this.state.selection.includes(key);
  };

  toggleSelection(key, shift, row) {
    /*
      Implementation of how to manage the selection state is up to the developer.
      This implementation uses an array stored in the component state.
      Other implementations could use object keys, a Javascript Set, or Redux... etc.
    */
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  };

  toggleAll() {
    /*
      'toggleAll' is a tricky concept with any filterable table
      do you just select ALL the records that are in your data?
      OR
      do you only select ALL the records that are in the current filtered data?
      
      The latter makes more sense because 'selection' is a visual thing for the user.
      This is especially true if you are going to implement a set of external functions
      that act on the selected information (you would not want to DELETE the wrong thing!).
      
      So, to that end, access to the internals of ReactTable are required to get what is
      currently visible in the table (either on the current page or any other page).
      
      The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
      ReactTable and then get the internal state and the 'sortedData'. 
      That can then be iterrated to get all the currently visible records and set
      the selection state.
    */
    const selectAll = this.state.selectAll ? false : true;
    const selection = [];
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        selection.push(item._original._id);
      });
    }
    this.setState({ selectAll, selection });
  };

  onDelete() {
    const { selection } = this.state;
    const { requestDelete } = this.props;
    this.setState({
      loading: true,
    })
    const promises = selection.map(id => {
      return new Promise((resolve, reject) => resolve(requestDelete(id)))
    });
    Promise.all(promises)
      .then(responses => {
        this.fetchData(this.state.lastState, this.state.instance);
      })
      .catch(error => {
        this.setState({
          loading: false,
        });
      })
  }

  onCreate() {
    const { requestPost } = this.props;
    this.toggleModal();
    requestPost(this.state.postData)
      .then(response => {
        this.fetchData(this.state.lastState, this.state.instance);
      })
      .catch(err => {
        console.log(err);
      });
  }

  toggleModal() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  onModalChange(key, value) {
    const postData = this.state.postData;
    postData[key] = value;
    this.setState({
      postData
    });
  }

  render() {
    const { columns, requestDelete, requestPost, requestEditable, keyField, subcomponentGenerator } = this.props;
    const { data, pages, loading, pageSize, selectAll, selection } = this.state;
    const { isSelected, toggleSelection, toggleAll } = this;
    const columnsToShow = columns.map(column => {
      if (column.isEditable) {
        column.Cell = this.renderEditable;
      }
      return column;
    });
    const checkboxProps = {
      selectAll,
      isSelected,
      toggleSelection,
      toggleAll,
      selectType: 'checkbox',
      keyField,
    };
    return (
      <React.Fragment>
        <div className="" style={{ marginBottom: '5px'}}>  
          {selection.length > 0 && <Button color="danger" onClick={this.onDelete} style={{ marginRight: '5px'}}>Eliminar</Button>}
          {requestPost && <Button color="primary" onClick={this.toggleModal}>Crear</Button>}
        </div>
        <div className="table">
          <CheckboxTable
            columns={columnsToShow}
            manual // Forces table not to paginate or sort automatically, so we can handle it server-side
            data={data}
            pages={pages} // Display the total number of pages
            loading={loading} // Display the loading overlay when we need it
            onFetchData={this.fetchData} // Request new data when things change
            filterable
            defaultPageSize={pageSize}
            className="-striped -highlight"
            ref={r => (this.checkboxTable = r)}
            SubComponent={subcomponentGenerator}
            {...checkboxProps}
          />
        </div>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Crear</ModalHeader>
          <ModalBody>
            <Form>  
            {columns.map(column => {
              if (column.requiredAtCreation && requestPost) {
                return (
                  <FormGroup>
                    <Label>{column.Header}</Label>
                    <Input type="text" name={column.id || column.accessor} onChange={(event) => {
                      this.onModalChange(column.id || column.accessor, event.target.value);
                    }}></Input>
                  </FormGroup>  
                );
              }
              })}
            </Form>  
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onCreate}>Guardar</Button>
            <Button color="secondary" onClick={this.toggleModal}>Cancelar</Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
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
  requestGet: PropTypes.func.isRequired,
  requestPut: PropTypes.func.isRequired,
  keyField: PropTypes.string,
  subcomponentGenerator: PropTypes.func,
}

Table.defaultProps = {
  pageSize: 30,
  keyField: 'id',
  subcomponentGenerator: null,
}