import React from "react";
import CardModal from "./CardModal";
import { Grid, Row, PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap'
import '../styles/Edit.css'
import axios from 'axios'

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      showCards: false, 
      sentences: null, 
      currentSentence: 0, 
      indicesToHide: [] 
    };
    this.incrementCurrentSentence = this.incrementCurrentSentence.bind(this);
    this.decrementCurrentSentence = this.decrementCurrentSentence.bind(this);
    this.determineIndicesToHide = this.determineIndicesToHide.bind(this);
    this.handleWordClick = this.handleWordClick.bind(this);
  }

  componentDidMount() {
    console.log(this.props.stackId)
    axios(`http://localhost:8080/stacks/${this.props.stackId}`)
    .then(stack => {
      console.log(stack)
      let sentences = stack.data[0].sentences
      this.setState({ sentences })
    })
    .catch(error => alert(error))
  }

  incrementCurrentSentence() {
    this.setState({
      currentSentence:
        (this.state.currentSentence + 1) % this.state.sentences.length,
    }, () => {
      this.determineIndicesToHide(this.state.sentences[this.state.currentSentence].selectedToken);
    });
  }

  decrementCurrentSentence() {
    this.setState({
      currentSentence:
        this.state.currentSentence == 0
          ? this.state.sentences.length - 1
          : this.state.currentSentence - 1,
    }, () => {
      this.determineIndicesToHide(this.state.sentences[this.state.currentSentence].selectedToken);
    });
  }

  determineIndicesToHide(startIndex) {
    let indicesToHide = [];

    let sentence = this.state.sentences[this.state.currentSentence];
    if ('hoverable' in sentence.tokens[startIndex]) {
      indicesToHide = this.buildHideSubTree(startIndex)
    }

    this.setState({
      indicesToHide,
    })
  }

  // Build the list of indexes to hide: from a starting index, look at all of its children, and for
  // each one, call the function recursively; propagate the result back up
  buildHideSubTree(index) {
    let result = [index];
    let sentence = this.state.sentences[this.state.currentSentence];
    for (let child of sentence.tokens[index].hoverInfo.children) {
      result = result.concat(this.buildHideSubTree(child));
    }
    return result;
  }

  // TODO####
  handleReceiveStack = (sentences) => {
    for (let sentence of sentences) {
      sentence.selectedToken = sentence.chefsRecommendation;
    }
    this.setState({ sentences }, () => {
      this.determineIndicesToHide(this.state.sentences[this.state.currentSentence].selectedToken)
    })
  }

  handleWordClick = index => {
    this.state.sentences[this.state.currentSentence].selectedToken = index;
  };

  makeCardList() {
    console.log("this.state.sentences", this.state.sentences)
    return this.state.sentences.map(sentence => (
      <ListGroupItem>{sentence.text.content}</ListGroupItem>
    ))
  }

  render() {
    let cardList = this.state.sentences === null ? <ListGroupItem>NOPE</ListGroupItem> : this.makeCardList() 
    
    console.log(cardList)
    
    return(
      <Grid>
        <Row>
          <PageHeader id="smallerHeader">
            <small>Cards:</small>
          </PageHeader>
        </Row>
        <Row>
          <ListGroup>
            {cardList}
          </ListGroup>
        </Row>
      </Grid>
    )
  }
}


export default Edit