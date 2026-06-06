import { HEROES_DATA, FUN_FACTS } from './data.js';
import heroService from './services/heroService.js';
import Utils from './utils.js';

let currentSlide = 0;
let allHeroes = [];
let selectedSuggestionIndex = -1;
let filteredHeroes = [];

document.addEventListener('DOMContentLoaded', async () => {
    Utils.showLoader();
    
    initTheme();
    initCarousel();
    initNavbar();
    initBackToTop();
    
    allHeroes = await heroService.getHeroes();
    
    populateFilters();
    renderHeroOfTheDay();
    renderFunFact();
    renderFeaturedHeroes();
    renderStats();
    renderAllHeroes(allHeroes);
    updateFavoritesCount();
    initSearchAndFilters();
    
    Utils.hideLoader();
});

function populateFilters() {
    const universeFilter = document.getElementById('universeFilter');
    const uniqueUniverses = [...new Set(allHeroes.map(h => h.universe).filter(u => u))];
    
    universeFilter.innerHTML = '<option value="">Todos os Universos</option>' +
        uniqueUniverses.map(u => `<option value="${u}">${u}</option>`).join('');
}

function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span style="background: var(--primary-color); color: white; padding: 0 4px; border-radius: 3px;">$1</span>');
}

function renderSuggestions(suggestions, query) {
    const container = document.getElementById('searchSuggestions');
    
    if (!suggestions.length || !query) {
        container.style.display = 'none';
        selectedSuggestionIndex = -1;
        return;
    }
    
    container.style.display = 'block';
    container.innerHTML = suggestions.slice(0, 6).map((hero, index) => `
        <div class="suggestion-item ${index === selectedSuggestionIndex ? 'active' : ''}" data-id="${hero.id}">
            <img src="${hero.imageMd || hero.image}" alt="${hero.name}" loading="lazy">
            <div class="suggestion-info">
                <h4>${highlightText(hero.name, query)}</h4>
                <p>${hero.universe} • ${hero.alignment}</p>
            </div>
        </div>
    `).join('');
    
    container.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            window.location.href = `hero.html?id=${item.dataset.id}`;
        });
    });
}

function initSearchAndFilters() {
    const searchInput = document.getElementById('searchInput');
    const universeFilter = document.getElementById('universeFilter');
    const alignmentFilter = document.getElementById('alignmentFilter');
    const suggestionsContainer = document.getElementById('searchSuggestions');

    const filterHeroes = () => {
        let filtered = [...allHeroes];
        const search = searchInput.value.toLowerCase();
        const universe = universeFilter.value;
        const alignment = alignmentFilter.value;

        if (search) {
            filtered = filtered.filter(h => 
                h.name.toLowerCase().includes(search) ||
                h.realName.toLowerCase().includes(search) ||
                h.universe.toLowerCase().includes(search) ||
                (h.creator && h.creator.toLowerCase().includes(search)) ||
                h.powers.some(p => p.toLowerCase().includes(search)) ||
                h.team.some(t => t.toLowerCase().includes(search))
            );
        }

        if (universe) {
            filtered = filtered.filter(h => h.universe === universe);
        }

        if (alignment) {
            filtered = filtered.filter(h => h.alignment === alignment);
        }

        filteredHeroes = filtered;
        renderAllHeroes(filtered);
        renderSuggestions(filtered, search);
    };

    searchInput.addEventListener('input', () => {
        filterHeroes();
        selectedSuggestionIndex = -1;
    });

    searchInput.addEventListener('keydown', (e) => {
        const suggestions = document.querySelectorAll('.suggestion-item');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
            suggestions.forEach((s, i) => s.classList.toggle('active', i === selectedSuggestionIndex));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, 0);
            suggestions.forEach((s, i) => s.classList.toggle('active', i === selectedSuggestionIndex));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
                window.location.href = `hero.html?id=${suggestions[selectedSuggestionIndex].dataset.id}`;
            }
        }
    });

    universeFilter.addEventListener('change', filterHeroes);
    alignmentFilter.addEventListener('change', filterHeroes);

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

function getWeeklyKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const weekNumber = Math.ceil(now.getDate() / 7);
    return `weekly-highlights-${year}-${month}-${weekNumber}`;
}

function getWeeklyHighlights() {
    const key = getWeeklyKey();
    let stored = localStorage.getItem(key);
    if (stored) {
        return JSON.parse(stored);
    } else {
        const shuffled = [...allHeroes].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);
        localStorage.setItem(key, JSON.stringify(selected.map(h => h.id)));
        return selected;
    }
}

function renderFeaturedHeroes() {
    const featuredIds = getWeeklyHighlights();
    const featured = featuredIds.map(id => allHeroes.find(h => h.id === id)).filter(Boolean);
    const container = document.getElementById('featuredHeroes');
    container.innerHTML = '';
    
    featured.forEach(hero => {
        const el = document.createElement('div');
        el.innerHTML = renderHeroCard(hero);
        container.appendChild(el.firstElementChild);
    });
    
    attachCardListeners();
}

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

function initCarousel() {
    const slides = document.getElementById('slides');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const totalSlides = slides.children.length;

    function goToSlide(index) {
        if (index >= totalSlides) currentSlide = 0;
        else if (index < 0) currentSlide = totalSlides - 1;
        else currentSlide = index;
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    setInterval(() => goToSlide(currentSlide + 1), 5000);
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

function renderHeroCard(hero, showActions = true) {
    const isFav = Utils.isFavorite(hero.id);
    return `
        <div class="hero-card" data-id="${hero.id}">
            <img src="${hero.imageMd || hero.image}" alt="${hero.name}" loading="lazy">
            <div class="hero-info">
                <h3>${hero.name}</h3>
                <p>${hero.universe} • ${hero.alignment}</p>
            </div>
            ${showActions ? `
                <div class="hero-card-actions">
                    <button class="action-btn favorite ${isFav ? 'active' : ''}" data-id="${hero.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="window.location.href='hero.html?id=${hero.id}'">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

function renderHeroOfTheDay() {
    const hero = allHeroes[Math.floor(Math.random() * allHeroes.length)];
    const container = document.getElementById('heroOfTheDay');
    container.innerHTML = `
        <h3><i class="fas fa-star"></i> ${hero.name}</h3>
        <p style="margin-top: 1rem; color: var(--text-muted);">${hero.universe}</p>
        <p style="margin-top: 1rem;">${hero.biography.slice(0, 200)}...</p>
        <button class="action-btn" style="margin-top: 1.5rem; background: var(--primary-color); color: white;" onclick="window.location.href='hero.html?id=${hero.id}'">Ver Detalhes</button>
    `;
}

function renderFunFact() {
    const fact = FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
    document.getElementById('funFact').innerHTML = `
        <h3><i class="fas fa-lightbulb"></i> Você Sabia?</h3>
        <p style="margin-top: 1rem; font-size: 1.1rem;">${fact}</p>
    `;
}

function renderStats() {
    const stats = {
        total: allHeroes.length,
        heroes: allHeroes.filter(h => h.alignment === 'Herói').length,
        villains: allHeroes.filter(h => h.alignment === 'Vilão').length,
        universes: [...new Set(allHeroes.map(h => h.universe))].length
    };
    
    document.getElementById('statsGrid').innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${stats.total}</div>
            <div class="stat-label">Total de Personagens</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.heroes}</div>
            <div class="stat-label">Heróis</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.villains}</div>
            <div class="stat-label">Vilões</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${stats.universes}</div>
            <div class="stat-label">Universos</div>
        </div>
    `;
}

function renderAllHeroes(heroes) {
    const container = document.getElementById('allHeroes');
    if (heroes.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted); font-size: 1.2rem;">Nenhum herói encontrado.</p>';
        return;
    }
    container.innerHTML = '';
    heroes.forEach(hero => {
        const el = document.createElement('div');
        el.innerHTML = renderHeroCard(hero);
        container.appendChild(el.firstElementChild);
    });
    attachCardListeners();
}

function attachCardListeners() {
    document.querySelectorAll('.hero-card img, .hero-card .hero-info').forEach(el => {
        el.addEventListener('click', (e) => {
            const card = e.target.closest('.hero-card');
            window.location.href = `hero.html?id=${card.dataset.id}`;
        });
    });

    document.querySelectorAll('.favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const heroId = parseInt(btn.dataset.id);
            Utils.toggleFavorite(heroId);
            btn.classList.toggle('active');
            updateFavoritesCount();
        });
    });
}

function updateFavoritesCount() {
    const count = Utils.getFavorites().length;
    const el = document.getElementById('favoritesCount');
    if (el) el.textContent = count;
}
