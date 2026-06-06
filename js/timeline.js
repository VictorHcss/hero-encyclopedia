import { TIMELINE_EVENTS } from './data.js';
import Utils from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    Utils.showLoader();
    initTheme();
    initNavbar();
    initBackToTop();
    updateFavoritesCount();
    renderTimeline();
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

function renderTimeline() {
    const container = document.getElementById('timeline');
    container.innerHTML = TIMELINE_EVENTS.sort((a, b) => a.year - b.year).map(event => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-card">
                <div class="timeline-year">${event.year}</div>
                <p style="margin-top: 0.5rem;">${event.event}</p>
            </div>
        </div>
    `).join('');
}