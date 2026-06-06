const Utils = {
    getFavorites: () => {
        const stored = localStorage.getItem('hero-favorites');
        return stored ? JSON.parse(stored) : [];
    },
    setFavorites: (favorites) => {
        localStorage.setItem('hero-favorites', JSON.stringify(favorites));
    },
    isFavorite: (heroId) => {
        const favorites = Utils.getFavorites();
        return favorites.includes(heroId);
    },
    toggleFavorite: (heroId) => {
        const favorites = Utils.getFavorites();
        const index = favorites.indexOf(heroId);
        if (index === -1) {
            favorites.push(heroId);
        } else {
            favorites.splice(index, 1);
        }
        Utils.setFavorites(favorites);
        return favorites;
    },
    getRatings: () => {
        const stored = localStorage.getItem('hero-ratings');
        return stored ? JSON.parse(stored) : {};
    },
    setRatings: (ratings) => {
        localStorage.setItem('hero-ratings', JSON.stringify(ratings));
    },
    getRating: (heroId) => {
        const ratings = Utils.getRatings();
        return ratings[heroId] || null;
    },
    setRating: (heroId, stars) => {
        const ratings = Utils.getRatings();
        ratings[heroId] = stars;
        Utils.setRatings(ratings);
        return ratings;
    },
    getViewHistory: () => {
        const stored = localStorage.getItem('hero-history');
        return stored ? JSON.parse(stored) : [];
    },
    setViewHistory: (history) => {
        localStorage.setItem('hero-history', JSON.stringify(history));
    },
    getTheme: () => {
        return localStorage.getItem('hero-theme') || 'dark';
    },
    setTheme: (theme) => {
        localStorage.setItem('hero-theme', theme);
        document.body.setAttribute('data-theme', theme);
    },
    scrollToTop: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    showLoader: () => {
        let loader = document.getElementById('loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loader';
            loader.className = 'loader';
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    },
    hideLoader: () => {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
    }
};

export default Utils;