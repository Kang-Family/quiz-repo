import React, { Component } from 'react'
import QuestionCreator from './QuestionCreator'
import QuestionListDisplay from './QuestionListDisplay'
import axios from 'axios';
import styled from 'styled-components';


export default class QuizCreatorDisplay extends Component {
    constructor(props){
        super(props)
        this.state = {
            questionList: [],
            status: 'initial',
        };
        this.doneSubmitting = this.doneSubmitting.bind(this);
        this.getQuestionsFromDB = this.getQuestionsFromDB.bind(this);
        this.renderSwitch = this.renderSwitch.bind(this);
        this.updateDisplay = this.updateDisplay.bind(this);
    }

    getQuestionsFromDB() {
        const currentQuiz = this.props.currentQuiz;
        axios.get('http://localhost:3001/question/getQuestions', { 
            params: {
                containingQuiz: currentQuiz
            }
        })
        .then((response)=>{
            this.setState({ questionList: response.data.questions });
            console.log('length:',this.state.questionList.length);

        });
    }

    componentDidMount() {
        this.getQuestionsFromDB();
    }

    doneSubmitting(){
        this.getQuestionsFromDB();
        if (this.state.questionList.length<1){
            window.alert("Need to submit at least one question!");
            return;
        }
        else{this.setState({status: 'doneQuestions'});}
    }

    renderSwitch(status, questionList, currentQuiz) {
        switch( status ) {
            case 'initial':
                if (this.state.questionList.length === 5){
                    this.setState({status: 'fiveQuestions'});
                }    
                return(
                    <>
                        {questionList.length > 0 ? 
                        <>
                        <QuestionListDisplay updateDisplay={this.updateDisplay} questions={questionList} />
                    </> 
                    : <>
                        <div>Make some new Questions!</div>
                        <p></p>
                    </>
                        }
                    <QuestionCreator 
                        updateDisplay={this.updateDisplay} 
                        numQuestions={this.state.questionList.length}
                        currentQuiz={currentQuiz}
                    />
                    <button 
                        onClick={this.doneSubmitting}>
                        Done Submitting Questions
                    </button>
                </>
                );
            case 'fiveQuestions':
                return(
                <>
                    <QuestionListDisplay updateDisplay={this.updateDisplay} questions={questionList} />
                    <div>You've reached the limit of five questions!</div>
                    <button onClick={this.doneSubmitting}>Done Submitting Questions</button>

                </>);
            case 'doneQuestions':
                return <div>Submitted! Thank you</div>;
            default:
                return <div>Status is not defined properly, check your logs :(</div>;
                
        }
    }
   
    updateDisplay() {
        this.getQuestionsFromDB();
    }

    render() {
        const { currentQuiz } = this.props;
        const { questionList, status } = this.state;
        
        return (
            <PadDiv>
                {this.renderSwitch(status, questionList, currentQuiz )}
            </PadDiv>
        )
    }
}


const PadDiv = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    input[type=text]{
        border: 5px dashed white;
        padding: 5px;
        margin-bottom: 5px;
        width: 30vw;
    }
    font-family: arial;
    font-weight: bold;
    padding: 1rem;
    >div{
        
        display:flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
    }
`;