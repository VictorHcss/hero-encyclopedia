import { QUIZ_QUESTIONS } from './data.js';
import Utils from './utils.js';

let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let incorrectCount = 0;
let answered = false;

document.addEventListener('DOMContentLoaded', async () => {
    Utils.showLoader();
    initTheme();
    initNavbar();
    initBackToTop();
    updateFavoritesCount();
    renderQuizStart();
    Utils.hideLoader();
});

function initTheme() {
    const savedTheme = Utils.getTheme();
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    document.getElementById('themeToggle').addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        Utils.setTheme(newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navOverlay.classList.toggle('open');
    });

    navOverlay.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navOverlay.classList.remove('open');
    });
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    backToTopBtn.addEventListener('click', Utils.scrollToTop);
}

function updateFavoritesCount() {
    const count = Utils.getFavorites().length;
    document.getElementById('favoritesCount').textContent = count;
}

function renderQuizStart() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = `
        <div class="quiz-start glass-card" style="text-align:center;">
            <h1><i class="fas fa-question-circle"></i> Quiz de Heróis!</h1>
            <p style="margin-top:1rem; font-size:1.2rem; color: var(--text-muted);">Teste seus conhecimentos sobre heróis, vilões e mais!</p>
            <button class="start-btn" id="startBtn">Iniciar Quiz</button>
        </div>
    `;
    document.getElementById('startBtn').addEventListener('click', startQuiz);
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    incorrectCount = 0;
    renderQuestion();
}

function renderQuestion() {
    const question = QUIZ_QUESTIONS[currentQuestionIndex];
    const container = document.getElementById('quizContainer');
    answered = false;
    container.innerHTML = `
        <div class="quiz-question glass-card">
            <p class="question-number">Pergunta ${currentQuestionIndex + 1} de ${QUIZ_QUESTIONS.length}</p>
            <h2 class="question-text">${question.question}</h2>
            <ul class="options-list">
                ${question.options.map((option, index) => `
                    <li><button class="option-btn" data-index="${index}">${option}</button></li>
                `).join('')}
            </ul>
            <div class="quiz-progress">
                <div class="progress-fill" style="width: ${((currentQuestionIndex + 1)/QUIZ_QUESTIONS.length)*100}%;"></div>
            </div>
        </div>
    `;
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', handleAnswer);
    });
}

function handleAnswer(e) {
    if (answered) return;
    answered = true;
    const selectedIndex = parseInt(e.target.dataset.index);
    const question = QUIZ_QUESTIONS[currentQuestionIndex];
    
    document.querySelectorAll('.option-btn').forEach((btn, idx) => {
        if (idx === question.correct) {
            btn.classList.add('correct');
        } else if (idx === selectedIndex && idx !== question.correct) {
            btn.classList.add('incorrect');
        }
    });

    if (selectedIndex === question.correct) {
        score += 100;
        correctCount++;
    } else {
        incorrectCount++;
    }

    setTimeout(() => {
        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
        } else {
            renderResults();
        }
    }, 1500);
}

function renderResults() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = `
        <div class="quiz-results glass-card" style="text-align:center;">
            <h1><i class="fas fa-trophy"></i> Fim do Quiz!</h1>
            <div class="results-grid">
                <div class="result-card">
                    <div class="result-number correct">${correctCount}</div>
                    <div class="result-label">Acertos</div>
                </div>
                <div class="result-card">
                    <div class="result-number incorrect">${incorrectCount}</div>
                    <div class="result-label">Erros</div>
                </div>
                <div class="result-card">
                    <div class="result-number score">${score}</div>
                    <div class="result-label">Pontos</div>
                </div>
            </div>
            <button class="start-btn" id="restartBtn">Tentar Novamente</button>
        </div>
    `;
    document.getElementById('restartBtn').addEventListener('click', startQuiz);
}