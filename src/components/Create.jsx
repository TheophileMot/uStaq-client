import React from 'react'
import {Row, Col, PageHeader, Table} from 'react-bootstrap'
import {Route, Switch, Link} from 'react-router-dom' 
import FormExample from './UrlInput'

class Create extends React.Component {
  render() {

    return (
      <div>
        <h2>uStaq</h2>
        <FormExample />
      </div>
    )
  }
}

export default Create