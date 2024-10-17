import { getTokenAuthLogin } from "./index";
import { jwtDecode } from "jwt-decode";

// Definição de roles
const ROLES_NAME = {
    ADMINISTRATOR: "Administrator"
}

/**
 * Verifica se o usuário logado é um administrador
 * @returns string
 */
export const isAdministrator = () => {
    let roles = getRoles();
    
    if(roles != null){
        for(var i = 0; i < roles.length; i++) {
            if(roles[i] === ROLES_NAME.ADMINISTRATOR)
                return true;
        }
    }

    return false;
};

/**
 * Retornas as roles com base no token
 */
const getRoles = () => {
    let pbsOidc = getTokenAuthLogin();
    let roles = null;

    if(pbsOidc) {
        let user = jwtDecode(pbsOidc);

        Object.keys(user).forEach((property) => {
            var indexRole = property.indexOf('role');
            
            if(indexRole !== -1){
                roles = user[property];
            }
        });
    }
    return roles;
}

/**
 * Retorna a url de acesso ao core api
 */
export const getBaseCoreUrl = () => {
    let pbsOidc = getTokenAuthLogin();
    let baseUrl = "";

    if(pbsOidc) {
        let user = jwtDecode(pbsOidc);
        baseUrl = user['app.LegacyBaseUrl'];
    }
    
    return baseUrl;
}

/**
 * Retorna a linguagem especificada no token
 */
export const getBaseLanguage = () => {
    let pbsOidc = getTokenAuthLogin();
    let baseLanguage = "pt-BR";

    if(pbsOidc) {
        let user = jwtDecode(pbsOidc);
        baseLanguage = user['userLanguage'];
    }
    
    return baseLanguage;
}


/**
 * Retorna o tenant do token
 */
export const getTenant = () => {
    let pbsOidc = getTokenAuthLogin();
    let value = "";

    if(pbsOidc) {
        let user = jwtDecode(pbsOidc);
        value = user['tenantId'];
    }
    
    return value;
}

/**
 * Retorna a empresa do token
 */
export const getCompanyId = () => {
    let pbsOidc = getTokenAuthLogin();
    let value = "";

    if(pbsOidc) {
        let user = jwtDecode(pbsOidc);
        value = user['empresaId'];
    }
    
    return value;
}

/**
 * Retorna a usuário do token
 */
export const getUser = () => {
    let pbsOidc = getTokenAuthLogin();
    let value = "";

    if(pbsOidc) {
        let user = jwtDecode(pbsOidc);
        value = user['name'];
    }
    
    return value;
}
