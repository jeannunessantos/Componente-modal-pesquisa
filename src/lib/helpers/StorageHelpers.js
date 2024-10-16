//import { debug } from "console";

//Carrega do storage (local ou session) em função da chave
export const loadState = (key, local = false) => {
    const serializedValue = local
      ? window.localStorage.getItem(key)
      : window.sessionStorage.getItem(key);
    if (!serializedValue) return undefined;
    return serializedValue;
  };
  
  //Salva no storage (local ou session) em função do estado e da chave
  export const saveState = (key, value, local = false) => {
    const serializedValue = value;
    local
      ? window.localStorage.setItem(key, serializedValue)
      : window.sessionStorage.setItem(key, serializedValue);
  };
  
  /**
   * Recupera o access token da sessionStorage.
   * @returns string
   */
  export const getTokenAuthLogin = () => {
    const pbsOidc = sessionStorage.getItem("PBS_OIDC_WBC");

    if (!pbsOidc) return "";
  
    try {
      const tokenstr = JSON.parse(pbsOidc);
      return tokenstr.access_token;
    } catch (error) {
      return "";
    }
  };