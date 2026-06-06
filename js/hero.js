import heroService from './services/heroService.js';
import Utils from './utils.js';

let allHeroes = [];
let currentHero = null;
let currentHeroIndex = -1;

document.addEventListener('DOMContentLoaded', async () => {
    Utils.showLoader();
    
    initTheme();
    initNavbar();
    initBackToTop();
    
    allHeroes = await heroService.getHeroes();
    await loadHero();
    
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

async function loadHero() {
    const urlParams = new URLSearchParams(window.location.search);
    const heroId = parseInt(urlParams.get('id'));
    
    currentHero = allHeroes.find(h => h.id === heroId);
    currentHeroIndex = allHeroes.findIndex(h => h.id === heroId);
    
    if (!currentHero) {
        document.getElementById('heroDetails').innerHTML = '<h2>Herói não encontrado</h2>';
        return;
    }
    
    updateViewHistory(currentHero);
    updatePageMeta(currentHero);
    renderHeroDetails(currentHero);
    updateFavoritesCount();
    initNavigationButtons();
}

function updateViewHistory(hero) {
    const history = Utils.getViewHistory();
    const newHistory = [hero.id, ...history.filter(id => id !== hero.id)].slice(0, 10);
    Utils.setViewHistory(newHistory);
}

function updatePageMeta(hero) {
    document.getElementById('pageTitle').textContent = `${hero.name} - Enciclopédia de Heróis`;
    document.getElementById('pageDescription').textContent = `Detalhes sobre ${hero.name}, personagem de ${hero.universe}`;
}

function renderHeroDetails(hero) {
    const raw = hero.raw;
    const isFav = Utils.isFavorite(hero.id);
    const favCount = Utils.getFavorites().filter(id => id === hero.id).length;
    
    const getVal = (v) => v || 'Informação não disponível';
    const getHeight = () => raw.appearance.height ? raw.appearance.height[1] : 'Informação não disponível';
    const getWeight = () => raw.appearance.weight ? raw.appearance.weight[1] : 'Informação não disponível';
    
    let themeClass = 'theme-hero';
    if (hero.alignment === 'Vilão') themeClass = 'theme-villain';
    else if (hero.alignment === 'Anti-herói') themeClass = 'theme-antihero';
    
    document.getElementById('heroBody').className = themeClass;
    
    const related = getRelatedHeroes(hero);
    const history = getViewHistoryHeroes();
    
    document.getElementById('heroDetails').innerHTML = `
        <div class="hero-banner" style="background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('${hero.image}') center/cover;"></div>
        
        <div class="hero-content-container">
            <div class="hero-content">
                <div class="hero-main">
                    <img src="${hero.image}" alt="${hero.name}" class="hero-large-image" loading="lazy">
                    <div class="hero-info-section">
                        <div class="hero-header">
                            <h1 class="hero-name">${hero.name}</h1>
                            <button class="favorite-btn-large ${isFav ? 'active' : ''}" id="favoriteBtn">
                                <i class="fas fa-heart"></i>
                                <span>${isFav ? 'Favoritado' : 'Favoritar'}</span>
                            </button>
                        </div>
                        <p class="hero-real-name">${getVal(raw.biography.fullName)}</p>
                        <p class="hero-universe">${hero.universe} • ${hero.alignment}</p>
                        
                        <div class="stats-grid">
                            <div class="info-card">
                                <h3><i class="fas fa-info-circle"></i> Dados Básicos</h3>
                                <p><strong>Alter Ego:</strong> ${getVal(raw.biography.alterEgos)}</p>
                                <p><strong>Local de Nascimento:</strong> ${getVal(raw.biography.placeOfBirth)}</p>
                                <p><strong>Primeira Aparição:</strong> ${getVal(raw.biography.firstAppearance)}</p>
                                <p><strong>Publicador:</strong> ${getVal(raw.biography.publisher)}</p>
                            </div>
                            <div class="info-card">
                                <h3><i class="fas fa-user"></i> Aparência</h3>
                                <p><strong>Gênero:</strong> ${getVal(raw.appearance.gender)}</p>
                                <p><strong>Raça:</strong> ${getVal(raw.appearance.race)}</p>
                                <p><strong>Altura:</strong> ${getHeight()}</p>
                                <p><strong>Peso:</strong> ${getWeight()}</p>
                                <p><strong>Cor dos Olhos:</strong> ${getVal(raw.appearance.eyeColor)}</p>
                                <p><strong>Cor do Cabelo:</strong> ${getVal(raw.appearance.hairColor)}</p>
                            </div>
                            <div class="info-card">
                                <h3><i class="fas fa-briefcase"></i> Vida Pessoal</h3>
                                <p><strong>Ocupação:</strong> ${getVal(raw.work.occupation)}</p>
                                <p><strong>Base:</strong> ${getVal(raw.work.base)}</p>
                            </div>
                            <div class="info-card">
                                <h3><i class="fas fa-users"></i> Conexões</h3>
                                <p><strong>Afilições:</strong> ${getVal(raw.connections.groupAffiliation)}</p>
                                <p><strong>Parentes:</strong> ${getVal(raw.connections.relatives)}</p>
                            </div>
                        </div>
                        
                        <div class="power-stats-section">
                            <h2><i class="fas fa-chart-bar"></i> Estatísticas</h2>
                            <div class="power-stats">
                                <div class="power-stat">
                                    <div class="power-stat-header">
                                        <span>Inteligência</span>
                                        <span>${hero.stats.intelligence}%</span>
                                    </div>
                                    <div class="power-bar">
                                        <div class="power-bar-fill" style="width: 0%" data-width="${hero.stats.intelligence}"></div>
                                    </div>
                                </div>
                                <div class="power-stat">
                                    <div class="power-stat-header">
                                        <span>Força</span>
                                        <span>${hero.stats.strength}%</span>
                                    </div>
                                    <div class="power-bar">
                                        <div class="power-bar-fill" style="width: 0%" data-width="${hero.stats.strength}"></div>
                                    </div>
                                </div>
                                <div class="power-stat">
                                    <div class="power-stat-header">
                                        <span>Velocidade</span>
                                        <span>${hero.stats.speed}%</span>
                                    </div>
                                    <div class="power-bar">
                                        <div class="power-bar-fill" style="width: 0%" data-width="${hero.stats.speed}"></div>
                                    </div>
                                </div>
                                <div class="power-stat">
                                    <div class="power-stat-header">
                                        <span>Durabilidade</span>
                                        <span>${hero.stats.durability}%</span>
                                    </div>
                                    <div class="power-bar">
                                        <div class="power-bar-fill" style="width: 0%" data-width="${hero.stats.durability}"></div>
                                    </div>
                                </div>
                                <div class="power-stat">
                                    <div class="power-stat-header">
                                        <span>Poder</span>
                                        <span>${hero.stats.power}%</span>
                                    </div>
                                    <div class="power-bar">
                                        <div class="power-bar-fill" style="width: 0%" data-width="${hero.stats.power}"></div>
                                    </div>
                                </div>
                                <div class="power-stat">
                                    <div class="power-stat-header">
                                        <span>Combate</span>
                                        <span>${hero.stats.combat}%</span>
                                    </div>
                                    <div class="power-bar">
                                        <div class="power-bar-fill" style="width: 0%" data-width="${hero.stats.combat}"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="related-section">
                    <h2><i class="fas fa-link"></i> Personagens Relacionados</h2>
                    <div class="hero-grid" id="relatedHeroes">
                        ${related.map(h => renderSmallHeroCard(h)).join('')}
                    </div>
                </div>
                
                <div class="history-section">
                    <h2><i class="fas fa-history"></i> Visualizados Recentemente</h2>
                    <div class="hero-grid" id="viewHistory">
                        ${history.map(h => renderSmallHeroCard(h)).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        document.querySelectorAll('.power-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
        });
    }, 100);
    
    document.getElementById('favoriteBtn').addEventListener('click', () => {
        Utils.toggleFavorite(hero.id);
        loadHero();
    });
}

function renderSmallHeroCard(hero) {
    return `
        <div class="hero-card" data-id="${hero.id}" onclick="window.location.href='hero.html?id=${hero.id}'">
            <img src="${hero.imageMd || hero.image}" alt="${hero.name}" loading="lazy">
            <div class="hero-info">
                <h3>${hero.name}</h3>
                <p>${hero.universe}</p>
            </div>
        </div>
    `;
}

function getRelatedHeroes(hero) {
    return allHeroes
        .filter(h => h.id !== hero.id)
        .filter(h => h.universe === hero.universe || h.alignment === hero.alignment)
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
}

function getViewHistoryHeroes() {
    const history = Utils.getViewHistory();
    return history
        .map(id => allHeroes.find(h => h.id === id))
        .filter(Boolean);
}

function initNavigationButtons() {
    const prevBtn = document.getElementById('prevHero');
    const nextBtn = document.getElementById('nextHero');
    
    prevBtn.addEventListener('click', () => {
        if (currentHeroIndex > 0) {
            window.location.href = `hero.html?id=${allHeroes[currentHeroIndex - 1].id}`;
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentHeroIndex < allHeroes.length - 1) {
            window.location.href = `hero.html?id=${allHeroes[currentHeroIndex + 1].id}`;
        }
    });
}

function updateFavoritesCount() {
    const count = Utils.getFavorites().length;
    const el = document.getElementById('favoritesCount');
    if (el) el.textContent = count;
}
