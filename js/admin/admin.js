import { HEROES_DATA } from '../data.js';
import heroService from '../services/heroService.js';
import Utils from '../utils.js';

let currentTab = 'list';
let allHeroes = [];
let editingHero = null;

document.addEventListener('DOMContentLoaded', async () => {
    Utils.showLoader();
    initTheme();
    initNavbar();
    initBackToTop();
    updateFavoritesCount();

    allHeroes = await heroService.getHeroes();
    initTabs();
    renderTab();

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

function initTabs() {
    document.querySelectorAll('.admin-menu a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.admin-menu a').forEach(x => x.classList.remove('active'));
            a.classList.add('active');
            currentTab = a.dataset.tab;
            editingHero = null;
            renderTab();
        });
    });
}

async function renderTab() {
    const container = document.getElementById('adminContent');
    allHeroes = await heroService.getHeroes();
    switch (currentTab) {
        case 'list':
            renderList(container);
            break;
        case 'add':
            renderForm(container);
            break;
        case 'stats':
            renderStats(container);
            break;
    }
}

function renderList(container) {
    container.innerHTML = `
        <h2><i class="fas fa-list"></i> Todos os Heróis</h2>
        <table class="admin-table" style="margin-top: 2rem; width:100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: left; padding:1rem; background: var(--surface-2);">ID</th>
                    <th style="text-align: left; padding:1rem; background: var(--surface-2);">Nome</th>
                    <th style="text-align: left; padding:1rem; background: var(--surface-2);">Universo</th>
                    <th style="text-align: left; padding:1rem; background: var(--surface-2);">Alinhamento</th>
                    <th style="text-align: left; padding:1rem; background: var(--surface-2);">Ações</th>
                </tr>
            </thead>
            <tbody>
                ${allHeroes.map(h => `
                    <tr style="border-bottom:1px solid var(--surface-2);">
                        <td style="padding:1rem;">${h.id}</td>
                        <td style="padding:1rem;">${h.name}</td>
                        <td style="padding:1rem;">${h.universe}</td>
                        <td style="padding:1rem;">${h.alignment}</td>
                        <td style="padding:1rem;">
                            <div class="table-actions" style="display:flex; gap:0.5rem;">
                                <button class="admin-btn secondary small-btn" data-edit="${h.id}"><i class="fas fa-edit"></i> Editar</button>
                                <button class="admin-btn danger small-btn" data-delete="${h.id}"><i class="fas fa-trash"></i> Excluir</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.querySelectorAll('[data-edit]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.edit);
            editingHero = await heroService.getHeroById(id);
            currentTab = 'add';
            document.querySelectorAll('.admin-menu a').forEach(x => x.classList.remove('active'));
            document.querySelector('[data-tab="add"]').classList.add('active');
            renderTab();
        });
    });

    container.querySelectorAll('[data-delete]').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('Tem certeza que deseja excluir este herói?')) {
                await heroService.deleteHero(parseInt(btn.dataset.delete));
                renderTab();
            }
        });
    });
}

function renderForm(container) {
    const hero = editingHero || {
        name: '', realName: '', image: '', universe: 'Marvel Comics',
        creator: '', firstAppearance: new Date().getFullYear(),
        alignment: 'Herói', powers: [], weaknesses: [],
        equipment: [], team: [], rivals: [], biography: '', curiosities: [],
        stats: { strength: 50, intelligence: 50, speed:50, durability:50, combat:50, power:50 },
        popularity:50, rating:0, ratingCount:0
    };

    container.innerHTML = `
        <h2><i class="fas fa-${editingHero ? 'edit' : 'plus'}"></i> ${editingHero ? 'Editar' : 'Adicionar'} Herói</h2>
        <form id="heroForm" style="margin-top:2rem;">
            <div class="form-grid">
                <div class="form-group">
                    <label>Nome</label>
                    <input type="text" name="name" value="${hero.name}" required>
                </div>
                <div class="form-group">
                    <label>Nome Real</label>
                    <input type="text" name="realName" value="${hero.realName}" required>
                </div>
                <div class="form-group">
                    <label>Imagem URL</label>
                    <input type="text" name="image" value="${hero.image}" required>
                </div>
                <div class="form-group">
                    <label>Universo</label>
                    <select name="universe" required>
                        <option value="Marvel Comics" ${hero.universe === 'Marvel Comics' ? 'selected' : ''}>Marvel Comics</option>
                        <option value="DC Comics" ${hero.universe === 'DC Comics' ? 'selected' : ''}>DC Comics</option>
                        <option value="Anime" ${hero.universe === 'Anime' ? 'selected' : ''}>Anime</option>
                        <option value="Games" ${hero.universe === 'Games' ? 'selected' : ''}>Games</option>
                        <option value="Filmes" ${hero.universe === 'Filmes' ? 'selected' : ''}>Filmes</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Criador</label>
                    <input type="text" name="creator" value="${hero.creator}" required>
                </div>
                <div class="form-group">
                    <label>Ano de Primeira Aparição</label>
                    <input type="number" name="firstAppearance" value="${hero.firstAppearance}" required>
                </div>
                <div class="form-group">
                    <label>Alinhamento</label>
                    <select name="alignment" required>
                        <option value="Herói" ${hero.alignment === 'Herói' ? 'selected' : ''}>Herói</option>
                        <option value="Vilão" ${hero.alignment === 'Vilão' ? 'selected' : ''}>Vilão</option>
                        <option value="Anti-herói" ${hero.alignment === 'Anti-herói' ? 'selected' : ''}>Anti-herói</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Poderes (separados por vírgula)</label>
                    <input type="text" name="powers" value="${hero.powers.join(', ')}">
                </div>
                <div class="form-group">
                    <label>Fraquezas (separados por vírgula)</label>
                    <input type="text" name="weaknesses" value="${hero.weaknesses.join(', ')}">
                </div>
                <div class="form-group">
                    <label>Equipamento (separados por vírgula)</label>
                    <input type="text" name="equipment" value="${hero.equipment.join(', ')}">
                </div>
                <div class="form-group">
                    <label>Equipe (separados por vírgula)</label>
                    <input type="text" name="team" value="${hero.team.join(', ')}">
                </div>
                <div class="form-group">
                    <label>Rivais (separados por vírgula)</label>
                    <input type="text" name="rivals" value="${hero.rivals.join(', ')}">
                </div>
                <div class="form-group">
                    <label>Força</label>
                    <input type="number" name="strength" min="0" max="100" value="${hero.stats.strength}">
                </div>
                <div class="form-group">
                    <label>Inteligência</label>
                    <input type="number" name="intelligence" min="0" max="100" value="${hero.stats.intelligence}">
                </div>
                <div class="form-group">
                    <label>Velocidade</label>
                    <input type="number" name="speed" min="0" max="100" value="${hero.stats.speed}">
                </div>
                <div class="form-group">
                    <label>Resistência</label>
                    <input type="number" name="durability" min="0" max="100" value="${hero.stats.durability}">
                </div>
                <div class="form-group">
                    <label>Combate</label>
                    <input type="number" name="combat" min="0" max="100" value="${hero.stats.combat}">
                </div>
                <div class="form-group">
                    <label>Poder</label>
                    <input type="number" name="power" min="0" max="100" value="${hero.stats.power}">
                </div>
                <div class="form-group">
                    <label>Popularidade</label>
                    <input type="number" name="popularity" min="0" max="100" value="${hero.popularity}">
                </div>
                <div class="form-group" style="grid-column: 1/-1;">
                    <label>Biografia</label>
                    <textarea name="biography" rows="5">${hero.biography}</textarea>
                </div>
                <div class="form-group" style="grid-column:1/-1;">
                    <label>Curiosidades (separadas por vírgula)</label>
                    <input type="text" name="curiosities" value="${hero.curiosities.join(', ')}">
                </div>
            </div>
            <div style="margin-top:2rem; display:flex; gap:1rem;">
                <button type="submit" class="admin-btn primary">${editingHero ? 'Atualizar' : 'Salvar'}</button>
                <button type="button" class="admin-btn secondary" id="cancelBtn">Cancelar</button>
            </div>
        </form>
    `;

    document.getElementById('heroForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            realName: formData.get('realName'),
            image: formData.get('image'),
            universe: formData.get('universe'),
            creator: formData.get('creator'),
            firstAppearance: parseInt(formData.get('firstAppearance')),
            alignment: formData.get('alignment'),
            powers: formData.get('powers').split(',').map(x => x.trim()).filter(x => x),
            weaknesses: formData.get('weaknesses').split(',').map(x => x.trim()).filter(x => x),
            equipment: formData.get('equipment').split(',').map(x => x.trim()).filter(x => x),
            team: formData.get('team').split(',').map(x => x.trim()).filter(x => x),
            rivals: formData.get('rivals').split(',').map(x => x.trim()).filter(x => x),
            biography: formData.get('biography'),
            curiosities: formData.get('curiosities').split(',').map(x => x.trim()).filter(x => x),
            stats: {
                strength: parseInt(formData.get('strength')),
                intelligence: parseInt(formData.get('intelligence')),
                speed: parseInt(formData.get('speed')),
                durability: parseInt(formData.get('durability')),
                combat: parseInt(formData.get('combat')),
                power: parseInt(formData.get('power'))
            },
            popularity: parseInt(formData.get('popularity')),
            rating: editingHero ? editingHero.rating : 0,
            ratingCount: editingHero ? editingHero.ratingCount : 0
        };
        if (editingHero) {
            await heroService.updateHero(editingHero.id, data);
        } else {
            await heroService.createHero(data);
        }
        currentTab = 'list';
        document.querySelectorAll('.admin-menu a').forEach(x => x.classList.remove('active'));
        document.querySelector('[data-tab="list"]').classList.add('active');
        editingHero = null;
        renderTab();
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        currentTab = 'list';
        document.querySelectorAll('.admin-menu a').forEach(x => x.classList.remove('active'));
        document.querySelector('[data-tab="list"]').classList.add('active');
        editingHero = null;
        renderTab();
    });
}

function renderStats(container) {
    const countHeroes = allHeroes.filter(h => h.alignment === 'Herói').length;
    const countVillains = allHeroes.filter(h => h.alignment === 'Vilão').length;
    const countAnti = allHeroes.filter(h => h.alignment === 'Anti-herói').length;
    const universes = {};
    allHeroes.forEach(h => universes[h.universe] = (universes[h.universe] || 0) + 1);
    container.innerHTML = `
        <h2><i class="fas fa-chart-pie"></i> Estatísticas</h2>
        <div class="stats-grid" style="margin-top: 2rem;">
            <div class="stat-card">
                <div class="stat-number">${allHeroes.length}</div>
                <div class="stat-label">Total de Personagens</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${countHeroes}</div>
                <div class="stat-label">Heróis</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${countVillains}</div>
                <div class="stat-label">Vilões</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${countAnti}</div>
                <div class="stat-label">Anti-Heróis</div>
            </div>
        </div>
        <h3 style="margin-top:3rem;">Personagens por Universo</h3>
        <div class="stats-grid" style="margin-top:1rem;">
            ${Object.entries(universes).map(([uni, count]) => `
                <div class="stat-card">
                    <div class="stat-number">${count}</div>
                    <div class="stat-label">${uni}</div>
                </div>
            `).join('')}
        </div>
    `;
}