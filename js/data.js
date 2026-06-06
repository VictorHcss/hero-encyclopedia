const HEROES_DATA = [
    {
        id: 1,
        name: "Homem-Aranha",
        realName: "Peter Parker",
        image: "assets/heroes/hero-2.jpg",
        universe: "Marvel Comics",
        creator: "Stan Lee e Steve Ditko",
        firstAppearance: 1962,
        alignment: "Herói",
        powers: ["Força sobre-humana", "Agilidade", "Sentido aranha", "Lançar teias"],
        weaknesses: ["Sense of responsibility", "Ethyl Chloride"],
        equipment: ["Lançadores de teias", "Traje aranha"],
        team: ["Vingadores", "Os Quatro Fantásticos"],
        rivals: ["Duende Verde", "Doutor Octopus"],
        biography: "Peter Benjamin Parker é um estudante de ciências que, após ser mordido por uma aranha radioativa, ganha poderes sobre-humanos. Ele usa esses poderes para combater o crime em Nova York, lembrando sempre da frase \"grandes poderes vêm grandes responsabilidades.",
        curiosities: ["Homem-Aranha quase teve um traje preto originalmente.", "A aranha que mordeu Peter Parker era radioativa, não geneticamente modificada."],
        gallery: [],
        stats: {
            strength: 70,
            intelligence: 90,
            speed: 65,
            durability: 60,
            combat: 75,
            power: 65
        },
        popularity: 95,
        rating: 4.8,
        ratingCount: 1500
    },
    {
        id: 2,
        name: "Batman",
        realName: "Bruce Wayne",
        image: "assets/heroes/hero-1.jpg",
        universe: "DC Comics",
        creator: "Bob Kane e Bill Finger",
        firstAppearance: 1939,
        alignment: "Herói",
        powers: ["Inteligência genial", "Detetive mestre", "Habilidade em artes marciais", "Tecnologia avançada"],
        weaknesses: ["Humanidade", "Moralidade rígida"],
        equipment: ["Batmobile", "Batsuit", "Batcomputer", "Utility Belt"],
        team: ["Liga da Justiça", "Batfamília"],
        rivals: ["Coringa", "Dois-Faces", "Pinguim"],
        biography: "Bruce Wayne, após testemunhar o assassinato de seus pais quando criança, jurou combater o crime em Gotham City. Ele usa sua riqueza e treinamento intensivo para se tornar o Cavaleiro das Trevas.",
        curiosities: ["Batman é um dos poucos heróis sem poderes sobre-humanos.", "Seu primeiro traje original era vermelho e dourado."],
        gallery: [],
        stats: {
            strength: 40,
            intelligence: 100,
            speed: 30,
            durability: 40,
            combat: 100,
            power: 30
        },
        popularity: 98,
        rating: 4.9,
        ratingCount: 2000
    },
    {
        id: 3,
        name: "Homem de Ferro",
        realName: "Tony Stark",
        image: "assets/heroes/hero-3.jpg",
        universe: "Marvel Comics",
        creator: "Stan Lee, Larry Lieber, Don Heck e Jack Kirby",
        firstAppearance: 1963,
        alignment: "Herói",
        powers: ["Inteligência genial", "Armadura de alta tecnologia"],
        weaknesses: ["Dependência do Reator Arc", "Ego excessivo"],
        equipment: ["Armaduras do Homem de Ferro", "Arsenal de alta tecnologia"],
        team: ["Vingadores"],
        rivals: ["Mandarim", "Whiplash"],
        biography: "Tony Stark, um gênio bilionário e industrial, sofre um ataque que danifica seu coração. Para sobreviver, ele cria um reator arc que o mantém vivo, e usa essa tecnologia para criar uma armadura para combater o mal.",
        curiosities: ["Tony Stark construiu sua primeira armadura em uma caverna.", "O Homem de Ferro foi um dos primeiros heróis da Marvel."],
        gallery: [],
        stats: {
            strength: 85,
            intelligence: 100,
            speed: 70,
            durability: 90,
            combat: 80,
            power: 95
        },
        popularity: 92,
        rating: 4.7,
        ratingCount: 1800
    },
    {
        id: 4,
        name: "Coringa",
        realName: "Desconhecido",
        image: "assets/heroes/jokes.jpg",
        universe: "DC Comics",
        creator: "Bill Finger, Bob Kane e Jerry Robinson",
        firstAppearance: 1940,
        alignment: "Vilão",
        powers: ["Genialidade criminosa", "Psicopatia", "Resistência a dor"],
        weaknesses: ["Insanidade", "Obsessão pelo Batman"],
        equipment: ["Gás do riso", "Cartas de baralho explosivas"],
        team: [],
        rivals: ["Batman"],
        biography: "O Coringa é o arqui-inimigo do Batman, um criminoso psicopata que vê o crime como uma forma de arte. Ele é conhecido por seu senso de humor macabro e sua aparência palida com sorriso permanente.",
        curiosities: ["A origem do Coringa foi inspirada no personagem Gwynplaine do filme O Homem que Ri (1928).", "Ele já foi um comediante fracassado."],
        gallery: [],
        stats: {
            strength: 30,
            intelligence: 90,
            speed: 25,
            durability: 35,
            combat: 40,
            power: 25
        },
        popularity: 88,
        rating: 4.6,
        ratingCount: 1200
    },
    {
        id: 5,
        name: "Deadpool",
        realName: "Wade Wilson",
        image: "assets/heroes/deadpool.jpg",
        universe: "Marvel Comics",
        creator: "Rob Liefeld e Fabian Nicieza",
        firstAppearance: 1991,
        alignment: "Anti-herói",
        powers: ["Fator de cura acelerado", "Imortalidade", "Artes marciais", "Humor sarcástico"],
        weaknesses: ["Instabilidade mental"],
        equipment: ["Espadas", "Armas de fogo"],
        team: ["X-Force"],
        rivals: ["Cable"],
        biography: "Wade Wilson é um mercenário que se submeteu a um experimento que lhe deu um fator de cura acelerado, mas também deixou ele com uma aparência desfigurada e instabilidade mental.",
        curiosities: ["Deadpool sabe que está em uma história em quadrinhos.", "Ele quebra a quarta parede constantemente."],
        gallery: [],
        stats: {
            strength: 45,
            intelligence: 70,
            speed: 50,
            durability: 100,
            combat: 90,
            power: 50
        },
        popularity: 90,
        rating: 4.7,
        ratingCount: 1400
    },
    {
        id: 6,
        name: "Goku",
        realName: "Kakarotto",
        image: "assets/heroes/goku.jpg",
        universe: "Anime",
        creator: "Akira Toriyama",
        firstAppearance: 1984,
        alignment: "Herói",
        powers: ["Ki", "Super Saiyajin", "Força sobre-humana", "Velocidade sobre-humana"],
        weaknesses: ["Cauda de Saiyajin (originalmente)", "Fome excessiva"],
        equipment: ["Nuvem voadora", "Bastão mágico"],
        team: ["Guerreiros Z"],
        rivals: ["Vegeta", "Freeza"],
        biography: "Goku é um guerreiro Saiyajin enviado à Terra quando bebê. Ele cresce e se torna o maior protetor da Terra, defendendo-a de ameaças interplanetárias.",
        curiosities: ["Goku come cerca de 50 refeições por dia.", "Seu nome original é Kakarotto."],
        gallery: [],
        stats: {
            strength: 100,
            intelligence: 40,
            speed: 100,
            durability: 100,
            combat: 95,
            power: 100
        },
        popularity: 99,
        rating: 4.9,
        ratingCount: 2500
    },
    {
        id: 7,
        name: "Lara Croft",
        realName: "Lara Croft",
        image: "assets/heroes/lara.jpg",
        universe: "Games",
        creator: "Core Design",
        firstAppearance: 1996,
        alignment: "Herói",
        powers: ["Atletismo", "Inteligência", "Arqueóloga", "Exploradora"],
        weaknesses: ["Humanidade", "Curiosidade excessiva"],
        equipment: ["Pistolas duplas"],
        team: [],
        rivals: ["Jacques de Molay"],
        biography: "Lara Croft é uma arqueóloga e exploradora que viaja pelo mundo em busca de relíquias antigas e tesouros perdidos.",
        curiosities: ["Lara Croft é uma das personagens femininas mais icônicas dos games.", "Seu design original era diferente no primeiro jogo."],
        gallery: [],
        stats: {
            strength: 35,
            intelligence: 85,
            speed: 45,
            durability: 40,
            combat: 75,
            power: 20
        },
        popularity: 85,
        rating: 4.5,
        ratingCount: 900
    },
    {
        id: 8,
        name: "Darth Vader",
        realName: "Anakin Skywalker",
        image: "assets/heroes/dart.jpg",
        universe: "Filmes",
        creator: "George Lucas",
        firstAppearance: 1977,
        alignment: "Vilão",
        powers: ["Força", "Sabre de luz"],
        weaknesses: ["Dependência da armadura", "Emoções"],
        equipment: ["Armadura de Darth Vader", "Sabre de luz vermelho"],
        team: ["Império Galáctico"],
        rivals: ["Obi-Wan Kenobi", "Luke Skywalker"],
        biography: "Anakin Skywalker, um Jedi promissor, se tornou Darth Vader, o Lorde Sith após se aliar ao Lado Sombrio da Força.",
        curiosities: ["Darth Vader foi interpretado por vários atores diferentes.", "Sua respiração é um dos sons mais icônicos do cinema."],
        gallery: [],
        stats: {
            strength: 80,
            intelligence: 80,
            speed: 70,
            durability: 75,
            combat: 90,
            power: 90
        },
        popularity: 97,
        rating: 4.8,
        ratingCount: 2200
    }
];

const QUIZ_QUESTIONS = [
    {
        question: "Qual herói usa um martelo chamado Mjolnir?",
        options: ["Thor", "Hulk", "Superman", "Capitão América"],
        correct: 0
    },
    {
        question: "Quem é o alter ego do Batman?",
        options: ["Clark Kent", "Bruce Wayne", "Tony Stark", "Peter Parker"],
        correct: 1
    },
    {
        question: "Qual é o nome verdadeiro do Homem-Aranha?",
        options: ["Peter Parker", "Bruce Wayne", "Tony Stark", "Steve Rogers"],
        correct: 0
    },
    {
        question: "Qual é a cor do sabre de luz de Darth Vader?",
        options: ["Azul", "Verde", "Vermelho", "Roxo"],
        correct: 2
    },
    {
        question: "Quem é o arqui-inimigo do Superman?",
        options: ["Lex Luthor", "Coringa", "Duende Verde", "Magneto"],
        correct: 0
    }
];

const TIMELINE_EVENTS = [
    { year: 1938, event: "Superman aparece pela primeira vez (Action Comics #1)" },
    { year: 1939, event: "Batman estreia em Detective Comics #27" },
    { year: 1940, event: "Coringa aparece pela primeira vez" },
    { year: 1962, event: "Homem-Aranha estreia em Amazing Fantasy #15" },
    { year: 1963, event: "Vingadores se unem pela primeira vez" },
    { year: 1977, event: "Star Wars chega aos cinemas" },
    { year: 1984, event: "Dragon Ball estreia no Japão" },
    { year: 1996, event: "Tomb Raider é lançado" }
];

const FUN_FACTS = [
    "Homem-Aranha quase teve outro uniforme original.",
    "Batman é um dos poucos heróis sem poderes sobre-humanos.",
    "Goku come cerca de 50 refeições por dia.",
    "Deadpool sabe que está em uma história em quadrinhos.",
    "Darth Vader foi interpretado por vários atores diferentes."
];

export { HEROES_DATA, QUIZ_QUESTIONS, TIMELINE_EVENTS, FUN_FACTS };