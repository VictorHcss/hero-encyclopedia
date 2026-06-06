import { HEROES_DATA } from '../data.js';
import { API_CONFIG } from './apiConfig.js';

const USE_LOCAL_DATA = false;

class HeroService {
    constructor() {
        this.useLocalData = USE_LOCAL_DATA;
        this.cachedHeroes = null;
        this.cachedRawHeroes = null;
    }

    transformApiHero(apiHero) {
        const alignmentMap = {
            'good': 'Herói',
            'bad': 'Vilão',
            'neutral': 'Anti-herói'
        };
        
        return {
            id: apiHero.id,
            name: apiHero.name,
            realName: apiHero.biography.fullName || apiHero.name,
            image: apiHero.images.lg,
            imageMd: apiHero.images.md,
            universe: apiHero.biography.publisher || 'Unknown',
            creator: apiHero.biography.publisher || 'Unknown',
            firstAppearance: apiHero.biography.firstAppearance || 'Unknown',
            alignment: alignmentMap[apiHero.biography.alignment] || 'Unknown',
            alignmentRaw: apiHero.biography.alignment,
            powers: Object.entries(apiHero.powerstats)
                .filter(([, value]) => value > 0)
                .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1)),
            weaknesses: [],
            equipment: [],
            team: apiHero.connections.groupAffiliation 
                ? apiHero.connections.groupAffiliation.split(', ') 
                : [],
            rivals: [],
            biography: `${apiHero.work.occupation || 'No occupation'}. ${apiHero.biography.placeOfBirth ? 'Born in ' + apiHero.biography.placeOfBirth : ''}`,
            curiosities: [],
            gallery: [],
            stats: {
                strength: apiHero.powerstats.strength,
                intelligence: apiHero.powerstats.intelligence,
                speed: apiHero.powerstats.speed,
                durability: apiHero.powerstats.durability,
                combat: apiHero.powerstats.combat,
                power: apiHero.powerstats.power
            },
            popularity: Math.round(
                (apiHero.powerstats.strength +
                 apiHero.powerstats.intelligence +
                 apiHero.powerstats.speed +
                 apiHero.powerstats.durability +
                 apiHero.powerstats.power +
                 apiHero.powerstats.combat) / 6
            ),
            rating: 4.5,
            ratingCount: 100,
            raw: apiHero
        };
    }

    async getHeroes() {
        if (this.useLocalData) {
            return [...HEROES_DATA];
        }
        try {
            if (!this.cachedHeroes) {
                const response = await fetch(`${API_CONFIG.BASE_URL}/all.json`);
                if (!response.ok) throw new Error('Failed to fetch heroes');
                const apiHeroes = await response.json();
                this.cachedRawHeroes = apiHeroes;
                this.cachedHeroes = apiHeroes.map(this.transformApiHero);
            }
            return [...this.cachedHeroes];
        } catch (error) {
            console.error('Error fetching heroes:', error);
            return [...HEROES_DATA];
        }
    }

    async getHeroById(id) {
        if (this.useLocalData) {
            return HEROES_DATA.find(hero => hero.id === id);
        }
        try {
            const heroes = await this.getHeroes();
            return heroes.find(hero => hero.id === id);
        } catch (error) {
            console.error('Error fetching hero:', error);
            return HEROES_DATA.find(hero => hero.id === id);
        }
    }

    async searchHeroes(query) {
        if (this.useLocalData) {
            const lowerQuery = query.toLowerCase();
            return HEROES_DATA.filter(hero => 
                hero.name.toLowerCase().includes(lowerQuery) ||
                hero.realName.toLowerCase().includes(lowerQuery) ||
                hero.universe.toLowerCase().includes(lowerQuery) ||
                hero.alignment.toLowerCase().includes(lowerQuery) ||
                hero.powers.some(power => power.toLowerCase().includes(lowerQuery)) ||
                hero.creator.toLowerCase().includes(lowerQuery)
            );
        }
        try {
            const heroes = await this.getHeroes();
            const lowerQuery = query.toLowerCase();
            return heroes.filter(hero => 
                hero.name.toLowerCase().includes(lowerQuery) ||
                hero.realName.toLowerCase().includes(lowerQuery) ||
                hero.universe.toLowerCase().includes(lowerQuery) ||
                hero.alignment.toLowerCase().includes(lowerQuery) ||
                hero.powers.some(power => power.toLowerCase().includes(lowerQuery))
            );
        } catch (error) {
            console.error('Error searching heroes:', error);
            const lowerQuery = query.toLowerCase();
            return HEROES_DATA.filter(hero => 
                hero.name.toLowerCase().includes(lowerQuery) ||
                hero.realName.toLowerCase().includes(lowerQuery) ||
                hero.universe.toLowerCase().includes(lowerQuery)
            );
        }
    }

    async getHeroesByUniverse(universe) {
        if (this.useLocalData) {
            return HEROES_DATA.filter(hero => hero.universe === universe);
        }
        try {
            const heroes = await this.getHeroes();
            return heroes.filter(hero => hero.universe === universe);
        } catch (error) {
            console.error('Error fetching heroes by universe:', error);
            return HEROES_DATA.filter(hero => hero.universe === universe);
        }
    }

    async getRandomHero() {
        if (this.useLocalData) {
            return HEROES_DATA[Math.floor(Math.random() * HEROES_DATA.length)];
        }
        try {
            const heroes = await this.getHeroes();
            return heroes[Math.floor(Math.random() * heroes.length)];
        } catch (error) {
            console.error('Error fetching random hero:', error);
            return HEROES_DATA[Math.floor(Math.random() * HEROES_DATA.length)];
        }
    }

    async createHero(data) {
        if (this.useLocalData) {
            const newHero = { id: HEROES_DATA.length + 1, ...data, rating: 0, ratingCount: 0 };
            HEROES_DATA.push(newHero);
            return newHero;
        }
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/heroes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_CONFIG.TOKEN}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to create hero');
            return await response.json();
        } catch (error) {
            console.error('Error creating hero:', error);
            const newHero = { id: HEROES_DATA.length + 1, ...data, rating: 0, ratingCount: 0 };
            HEROES_DATA.push(newHero);
            return newHero;
        }
    }

    async updateHero(id, data) {
        if (this.useLocalData) {
            const index = HEROES_DATA.findIndex(hero => hero.id === id);
            if (index !== -1) {
                HEROES_DATA[index] = { ...HEROES_DATA[index], ...data };
                return HEROES_DATA[index];
            }
            return null;
        }
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/heroes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_CONFIG.TOKEN}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update hero');
            return await response.json();
        } catch (error) {
            console.error('Error updating hero:', error);
            const index = HEROES_DATA.findIndex(hero => hero.id === id);
            if (index !== -1) {
                HEROES_DATA[index] = { ...HEROES_DATA[index], ...data };
                return HEROES_DATA[index];
            }
            return null;
        }
    }

    async deleteHero(id) {
        if (this.useLocalData) {
            const index = HEROES_DATA.findIndex(hero => hero.id === id);
            if (index !== -1) {
                return HEROES_DATA.splice(index, 1)[0];
            }
            return null;
        }
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/heroes/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${API_CONFIG.TOKEN}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete hero');
            return await response.json();
        } catch (error) {
            console.error('Error deleting hero:', error);
            const index = HEROES_DATA.findIndex(hero => hero.id === id);
            if (index !== -1) {
                return HEROES_DATA.splice(index, 1)[0];
            }
            return null;
        }
    }
}

const heroService = new HeroService();
export default heroService;