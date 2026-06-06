const API_CONFIG = {
    BASE_URL: "https://akabab.github.io/superhero-api/api/",
    
    // Espaço reservado para futuras APIs que exijam autenticação
    API_KEY: "",
    TOKEN: ""
};

const API_CONFIG_INFO = {
    instructions: {
        BASE_URL: "Insira aqui a URL base da API de heróis que você deseja utilizar",
        API_KEY: "Insira aqui sua chave de API",
        TOKEN: "Insira aqui seu token de autenticação, se necessário"
    },
    securityWarning: "Nunca armazenar API Keys sensíveis diretamente em produção. Utilizar backend ou variáveis de ambiente quando o projeto evoluir."
};

console.warn(API_CONFIG_INFO.securityWarning);

export { API_CONFIG, API_CONFIG_INFO };