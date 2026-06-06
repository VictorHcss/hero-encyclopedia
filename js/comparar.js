import { HEROES_DATA } from './data.js';
import heroService from './services/heroService.js';
import Utils from './utils.js';

let allHeroes = [];
let hero1 = null;
let hero2 = null;

document.addEventListener('DOMContentLoaded', async () => {
    Utils.showLoader();
    initTheme();
    initNavbar();
    initBackToTop();
    updateFavoritesCount();

    allHeroes = await heroService.getHeroes();
    const urlParams = new URLSearchParams(window.location.search);
    const hero1Id = urlParams.get('hero1');
    if (hero1Id) hero1 = allHeroes.find(h => h.id === parseInt(hero1Id));
    renderCompare();

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

function renderCompare() {
    const container = document.getElementById('compareContainer');
    container.innerHTML = `
        <div class="compare-hero">
            ${hero1 ? `
                <img src="${hero1.image}" class="compare-hero-image" alt="${hero1.name}">
                <h2>${hero1.name}</h2>
                <p style="color: var(--text-muted); margin-bottom: 1rem;">${hero1.universe}</p>
            ` : ''}
            <select class="hero-select-dropdown" id="selectHero1">
                <option value="">Selecione um herói</option>
                ${allHeroes.map(h => `<option value="${h.id}" ${hero1 && hero1.id === h.id ? 'selected' : ''}>${h.name}</option>`).join('')}
            </select>
        </div>
        <div class="compare-middle">
            <div class="vs">VS</div>
        </div>
        <div class="compare-hero">
            ${hero2 ? `
                <img src="${hero2.image}" class="compare-hero-image" alt="${hero2.name}">
                <h2>${hero2.name}</h2>
                <p style="color: var(--text-muted); margin-bottom: 1rem;">${hero2.universe}</p>
            ` : ''}
            <select class="hero-select-dropdown" id="selectHero2">
                <option value="">Selecione um herói</option>
                ${allHeroes.map(h => `<option value="${h.id}" ${hero2 && hero2.id === h.id ? 'selected' : ''}>${h.name}</option>`).join('')}
            </select>
        </div>
        ${hero1 && hero2 ? `
            <div class="compare-stats" style="grid-column: 1 / -1; margin-top: 3rem;">
                ${['strength', 'intelligence', 'speed', 'durability', 'combat', 'power', 'popularity'].map(stat => {
                    const labels = { strength: 'Força', intelligence: 'Inteligência', speed: 'Velocidade', durability: 'Resistência', combat: 'Combate', power: 'Poder', popularity: 'Popularidade' };
                    const val1 = stat === 'popularity' ? hero1.popularity : hero1.stats[stat];
                    const val2 = stat === 'popularity' ? hero2.popularity : hero2.stats[stat];
                    return `
                        <div class="stat-row">
                            <div>
                                <div class="compare-bar">
                                    <div class="compare-bar-fill left" style="width: ${val1}%;"></div>
                                </div>
                                <div style="text-align: right; margin-top: 0.5rem; font-weight: bold;">${val1}</div>
                            </div>
                            <div class="stat-label">${labels[stat]}</div>
                            <div>
                                <div class="compare-bar">
                                    <div class="compare-bar-fill right" style="width: ${val2}%;"></div>
                                </div>
                                <div style="text-align: left; margin-top: 0.5rem; font-weight: bold;">${val2}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        ` : ''}
    `;

    document.getElementById('selectHero1').addEventListener('change', (e) => {
        hero1 = e.target.value ? allHeroes.find(h => h.id === parseInt(e.target.value)) : null;
        renderCompare();
    });
    document.getElementById('selectHero2').addEventListener('change', (e) => {
        hero2 = e.target.value ? allHeroes.find(h => h.id === parseInt(e.target.value)) : null;
        renderCompare();
    });
}