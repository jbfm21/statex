import React from 'react'
import { SetFilterAction } from '../action/todo-action'

// import {
// data,
// inject,
// } from 'statex/react'

// class Props {

//   @data((state: AppState) => state.filter)
//   filter?: Filter
// }

// interface State { }

// @inject(Props)
export default class Filter extends React.Component {

  setAllFilter() {
    new SetFilterAction('ALL').dispatch()
  }

  setActiveFilter() {
    new SetFilterAction('ACTIVE').dispatch()
  }

  setCompletedFilter() {
    new SetFilterAction('COMPLETED').dispatch()
  }

  render() {
    const { filter } = this.props
    return <ul id="filters">
      <li>
        <a className={filter == null || filter === 'ALL' ? 'selected' : undefined}
          onClick={this.setAllFilter.bind(this)}>All</a>
      </li>
      <li>
        <a className={filter === 'ACTIVE' ? 'selected' : undefined}
          onClick={this.setActiveFilter.bind(this)}>Active</a>
      </li>
      <li>
        <a className={filter === 'COMPLETED' ? 'selected' : undefined}
          onClick={this.setCompletedFilter.bind(this)}>Completed</a>
      </li>
    </ul>
  }
}