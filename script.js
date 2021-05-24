const quizData = [
    {
        question: 'How old is London?',
        a: '1491 yrs old',
        b: '1974 yrs old',
        c: '1940 yrs old',
        d: '1707 yrs old',
        correct: 'b',
    },
    {
        question: 'What was the first London name in ancient Rome?',
        a: 'Londinium',
        b: 'Londonium',
        c: 'Londiniumm',
        d: 'Londyniuum',
        correct: 'a',
    },
    {
        question: "In which century London became the biggest city of Europe?",
        a: '15th century',
        b: '16th century',
        c: '17th century',
        d: '18th century',
        correct: 'd',
    },
    {
        question: "How many boroughs is in London? ",
        a: '15',
        b: '24',
        c: '33',
        d: '31',
        correct: 'c',
    },
    {
        question: "What is the biggest religion in London? ",
        a: 'Christians',
        b: 'Muslims',
        c: 'Hindus',
        d: 'Jews',
        correct: 'a',
    }
]

const questionEl = document.getElementById('question')
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const answersEls = document.querySelectorAll('.answer');
const quiz = document.getElementById('quiz');
// const background = document.getElementsByTagName('body'); bardzo bym chciala dodac zmiane tla przy kliknieciu;

// function loadBackground(){
    
// }

let currentQuiz=0;
let score = 0;

loadQuiz();

function loadQuiz(){
    deselectAnswers();
    const currentQuizData = quizData[currentQuiz];
    questionEl.innerText= currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
}

function getSelected() {
    

    let answer = undefined;

    answersEls.forEach((answersEl) => {
        if(answersEl.checked){
           answer = answersEl.id;
        }
    });

    return answer;
}

function deselectAnswers() {
    answersEls.forEach((answersEl) => {
        answersEl.checked = false;
    });
}



submitBtn.addEventListener('click', () => {
    

    const answer = getSelected();
    console.log(answer);

    if(answer){  
        if(answer === quizData[currentQuiz].correct) {
            score++;
        }
        currentQuiz++;
         if(currentQuiz < quizData.length){
        loadQuiz();
        }else{
        quiz.innerHTML =`<h2>You answered correctly at ${score} / ${quizData.length} questions.</h2>
        <button onclick="location.reload()">Reload</button>`;
        }
    

    }


 
});
