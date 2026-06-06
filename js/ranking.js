import { HEROES_DATA } from './data.js';
import heroService from './services/heroService.js';
import Utils from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    Utils.showLoader();
    initTheme();
    initNavbar();
    initBackToTop();
    updateFavoritesCount();

    const allHeroes = await heroService.getHeroes();
    renderRankings(allHeroes);

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

function renderRankingList(title, heroes, color) {
    return `
        <div class="ranking-list">
            <div class="ranking-header" style="background: linear-gradient(135deg, ${color}, ${color}aa);">
                <h2>${title}</h2>
            </div>
            ${heroes.map((hero, index) => {
                const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
                return `
                    <div class="ranking-item" onclick="window.location.href='hero.html?id=${hero.id}'">
                        <div class="rank-number ${rankClass}">${index + 1}</div>
                        <img src="${hero.image}" alt="${hero.name}">
                        <div class="ranking-info">
                            <h3>${hero.name}</h3>
                            <p>${hero.universe}</p>
                        </div>
                        <div class="ranking-stats">
                            <div class="rating-display">${hero.rating} ⭐</div>
                            <div style="color: var(--text-muted); font-size:0.9rem;">${hero.ratingCount} votos</div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderRankings(allHeroes) {
    const heroes = [...allHeroes].filter(h => h.alignment === 'Herói').sort((a, b) => b.rating - a.rating).slice(0, 10);
    const villains = [...allHeroes].filter(h => h.alignment === 'Vilão').sort((a, b) => b.rating - a.rating).slice(0, 10);
    const antiheroes = [...allHeroes].filter(h => h.alignment === 'Anti-herói').sort((a, b) => b.rating - a.rating).slice(0, 10);
    const container = document.getElementById('rankingContainer');
    container.innerHTML = `
        ${renderRankingList('Top 10 Heróis', heroes, '#e62429')}
        ${renderRankingList('Top 10 Vilões', villains, '#4a4a4a')}
        ${antiheroes.length ? renderRankingList('Top 10 Anti-Heróis', antiheroes, '#ffd700') : ''}
    `;
}