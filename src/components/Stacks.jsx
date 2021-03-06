import React, { Component } from 'react'
import { Row, Col, PageHeader, Table, Grid, Clearfix, Modal, Dialog, Body, Button, ButtonGroup } from 'react-bootstrap'
import { Route, Switch, Link } from 'react-router-dom'
import axios from 'axios'

// Stack details modal dialog
import Card from './Card'

// Client-side model
import Resource from '../models/resource'
const StackStore = Resource('stacks')
// const db = require('mongodb');


class Stacks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stacks: this.props.stacks,
      input: '',
      userObj: {_id: null}
    }
    this.filterStacksHandle = this.filterStacksHandle.bind(this);
    this.deleteStackHandle = this.deleteStackHandle.bind(this);
  }

  deleteStackHandle(_id) {
    if(window.confirm("Are you sure you want to delete this stack?")){
      return axios.post(`http://localhost:8080/stacks/delete/${_id}`)
        .then(response => {
          console.log(response)
          this.props.getUserStacks(this.props.userObj._id)
        })
        .catch(error => console.log(error));
    };
  };

  filterStacksHandle() {
    let input = document.getElementById('filterStacks');
    let filter = input.value.toUpperCase();
    let ul = document.getElementById('myUL');
    let li = ul.getElementsByTagName('li');
    for (let i = 0; i < li.length; i++) {
      let a = li[i].getElementsByTagName('a')[0];
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = '';
      } else {
        li[i].style.display = 'none';
      }
    }
  }

  handleEdit = (event) => {
    let stackId = event.target.getAttribute("data-id")
    this.props.toggleEdit(stackId)
  }

  stacksData() {
    if (this.props.stacks) {
      return (
          this.props.stacks.map((stack, index) => (
            <li key={index} style={{ listStyleType: 'none' }}>
              <tr className='tile' data-toggle='modal' data-target='#exampleModal'>
                <Col sm={6} md={3} className='eachTile eachTile:hover imgResponsive'>
                  <Row>
                    <ButtonGroup className="edit-delete-btn-group" bsSize="xsmall">
                      <Button onClick={this.handleEdit} bsStyle="info" data-id={stack._id}>
                        <span className="glyphicon glyphicon-edit" data-id={stack._id}></span>
                      </Button>
                      <Button onClick={() => this.deleteStackHandle(stack._id)} bsStyle="danger">
                        <span className="glyphicon glyphicon-trash"></span>
                      </Button>
                    </ButtonGroup>
                  </Row>
                  <Row className="stack-summary">
                    <Link to={`/stacks/${stack._id}`}>
                      <strong>{stack.title}</strong> <br/> <strong>{stack.sentences.length}</strong> cards
                </Link>
                  </Row>
                </Col>
              </tr>
            </li>
          ))
        )
    } else {
      return <p>EMPTY</p>
    }
  }

  render() {
    let stacksData = this.stacksData()

    return (
      <div>
        <Row className='show-grid'>
          <Table>
            <tbody>
              <input
                type='text'
                id="filterStacks"
                onChange={this.filterStacksHandle}
                placeholder='Search in your stacks...'
              />
              <ul id='myUL'>
                {stacksData}
              </ul>
            </tbody>
            <Route exact path="/stacks/:_id" component={(routeprops) => <Card {...routeprops} {...this.props} stack={this.stack}/>}/>
          </Table>
        </Row>
      </div>
    )
  }
}

export default Stacks
