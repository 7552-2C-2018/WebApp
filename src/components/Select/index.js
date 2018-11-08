import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './Select.scss';

export default class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currentValue: props.currentValue,
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  toggleDropdown() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  onChange(index, newDescription) {
    this.props.onChange(index);
    this.setState({
      currentValue: newDescription,
    });
    this.toggleDropdown();
  }

  render() {
    const { options } = this.props;
    return (
      <Dropdown isOpen={this.state.isOpen} toggle={this.toggleDropdown}>
        <DropdownToggle caret>
          {this.state.currentValue}
        </DropdownToggle>
        <DropdownMenu>
          {options.map((option, index) => <DropdownItem onClick={() => this.onChange(index, option)}>{option}</DropdownItem>)}
        </DropdownMenu>
      </Dropdown>
    );
  }
};