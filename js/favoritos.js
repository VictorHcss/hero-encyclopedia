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
    const favorites = Utils.getFavorites();
    const favHeroes = allHeroes.filter(h => favorites.includes(h.id));
    
    renderFavorites(favHeroes);

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

function renderHeroCard(hero) {
    const isFav = Utils.isFavorite(hero.id);
    return `
        <div class="hero-card" data-id="${hero.id}">
            <img src="${hero.image}" alt="${hero.name}">
            <div class="hero-info">
                <h3>${hero.name}</h3>
                <p>${hero.universe} • ${hero.alignment}</p>
            </div>
            <div class="hero-card-actions">
                <button class="action-btn favorite ${isFav ? 'active' : ''}" data-id="${hero.id}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="action-btn" onclick="window.location.href='hero.html?id=${hero.id}'">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `;
}

function renderFavorites(heroes) {
    const container = document.getElementById('favoritesGrid');
    if (heroes.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-muted); font-size: 1.3rem;">Você ainda não tem heróis favoritos!</p>';
        return;
    }
    container.innerHTML = heroes.map(hero => renderHeroCard(hero)).join('');
    attachCardListeners(heroes);
}

function attachCardListeners(heroes) {
    document.querySelectorAll('.hero-card img, .hero-card .hero-info').forEach(el => {
        el.addEventListener('click', (e) => {
            const card = e.target.closest('.hero-card');
            window.location.href = `hero.html?id=${card.dataset.id}`;
        });
    });

    document.querySelectorAll('.favorite').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const heroId = parseInt(btn.dataset.id);
            Utils.toggleFavorite(heroId);
            updateFavoritesCount();
            const allHeroes = await heroService.getHeroes();
            const favorites = Utils.getFavorites();
            renderFavorites(allHeroes.filter(h => favorites.includes(h.id)));
        });
    });
}