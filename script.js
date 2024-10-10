// 1. declare global variable
    // -constants
    // -global variable
// 2. fetch quiz questions

// 100 seconds
const QuizTime = 100;
// question points
const QuizQuestionPoints=1;
// pass percentage
const PassPercent=50;

// global variable
let quiz=[];
let timer=0;
let setIntervalId;

let timerAudio=document.getElementById('timerAudio');
let cheerAudio =document.getElementById('cheerAudio');
let booAudio =document.getElementById('booAudio');

async function fetchQuizQuestion(){
    const response =await fetch("quiz.json");
    const data = await response.json();
    quiz=data.quiz;
    console.log(quiz);

    showModule('start-module');
    
}
fetchQuizQuestion();


function showModule(moduleName) {
    // get all module class elements 
    const moduleList = document.querySelectorAll(".module");

    for(m of moduleList){
    // check for id

        if(m.id===moduleName){
            m.style.display= "block";
        } else {
            m.style.display="none";
        }
    }
    
}


const startQuiz=()=>{
    // show quiz module
    showModule("quiz-module");
    console.log(quiz);
    

    const questionUL = document.getElementById("quizList");
    questionUL.innerHTML='';

    for( quizIndex in quiz) {
        console.log(quizIndex);
        
        const questionList = document.createElement('li');
        questionList.classList.add("quiz-question");

        const questionSpan = document.createElement('span');
        questionSpan.innerText= quiz[quizIndex].question;

        const optionsUL = document.createElement("ul");
        optionsUL.classList.add("quiz-answer");

        for( optionIndex in quiz[quizIndex].options){
            const optionList = document.createElement('li');
            const inputElement= document.createElement('input');
            inputElement.id = "q-"+ quizIndex+"-a-"+optionIndex;
            inputElement.type="radio";
            inputElement.name= "question-"+ quizIndex;

            const inputLabel= document.createElement('label');
            inputLabel.setAttribute(
                "for",
                "q-"+quizIndex+"-a-"+optionIndex
            );

            inputLabel.innerText=quiz[quizIndex].options[optionIndex];
            // q-1-a-1
            optionList.append(inputElement);
            optionList.append(inputLabel);
            optionsUL.append(optionList);
        }
        questionList.append(questionSpan);
        questionList.append(optionsUL);
        questionUL.append(questionList);
    }

    timer=QuizTime;
    setIntervalId=setInterval(checkTimer,1000);

};

const checkTimer=()=>{
    
    let timerElement=document.getElementById('timer');

    timerElement.innerText=timer;

    timer -= 1;
    console.log("timer");
    timerAudio.play();
    
    if(timer < 0){
        stopQuiz();
    }
};

const stopQuiz =()=>{
    console.log("stop Quiz");
    clearInterval(setIntervalId);
    showModule("score-module");
    calculateResult();
}


const calculateResult=()=>{

    const selectedOptionList=document.querySelectorAll('input[type="radio"]:checked')


    let score=0;
    let result= "FAILED";

    for( item of selectedOptionList){
// q-0-a-1      
//   ["q","0","a","1"];
  questionNo=item.id.split("-")[1];
  answerSelected= item.id.split("-")[3];
    

    if(quiz[questionNo].answer===quiz[questionNo].options[answerSelected]){
        score=score + QuizQuestionPoints;
    }

}

    // num / total * 100
    const resultPercent =(score/(QuizQuestionPoints*quiz.length)) * 100;
    if(resultPercent>= PassPercent){
        result= "PASSED";
        cheerAudio.play();
    }
    else{
        booAudio.play();
    }
 
    const scoreElement = document.getElementById('score');
    scoreElement.innerText=score;

    const resultElement =document.getElementById('result');
    resultElement.innerText=result;
}

const resetQuiz=()=>{
    console.log("reset");
    // reste timer
    const timerElement= document.getElementById("timer");
    timerElement.innerText="--";

    showModule("start-module");
}
