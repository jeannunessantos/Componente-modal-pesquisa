import PbsMessage from '../components/PbsMessage/PbsMessage';
import axios from 'axios';
import localforage from 'localforage';
import { getTokenAuthLogin } from '../lib/helpers';
import { enumHttpStatusCode } from '../../src/lib/enum/enumHttpStatusCode';
import { closeNotification, openNotification } from '../components/PbsNotification/PbsNotification';
import useText from '../lib/hooks/useText';
import { jwtDecode } from "jwt-decode";

// Retorna a URL base da API
export const getApiUrl = () => {
  const token = getTokenAuthLogin();
  const  accessToken = jwtDecode(token) as any;

  let baseUrl: any;
  baseUrl = 'https://localhost:44312';
  const CoreApiUrl = accessToken["app.CoreApiUrl"];
  const tenantId = accessToken["tenantId"];

  if (CoreApiUrl && (tenantId !== 'wbc7-dev' && tenantId !== 'dev')) {
      baseUrl = CoreApiUrl`/${tenantId}/`
  }
  return baseUrl;
};

export const getCustomErrorCode = (error:any) => {
  if(error.response.data.statusCode == enumHttpStatusCode.Status422UnprocessableEntity 
      && error.response.data.errors.length == 1 
      && !!error.response.data.errors[0].customErrorCode
      && error.response.data.errors[0].customErrorCode.startsWith('WBC_'))
    return error.response.data.errors[0].customErrorCode; 
  return -1;
};

//Retorna as configurações do axios
const getAxiosConfig = (keepCache:any) => {
  let cache = getCacheInstance();
  if (!keepCache) cache.clear();

  return {
    baseURL: getApiUrl(),
    headers: {
      Authorization: `Bearer ${getTokenAuthLogin()}`
    }
  };
};

// Interceptores de requisições e respostas
const setInterceptors = (api:any) => {
  api.interceptors.request.use(async (config:any) => {
    // Extrai o método e o URL do request
    const method = config.method.toUpperCase();
    const url = config.url || '';

    // Faz notificações em tela
    const isRefreshEndpoint = url.toLowerCase().includes('/chat') || url.toLowerCase().includes('/refresh') || url.toLowerCase().includes('/sessaonegociacao');
    // if (method != "GET")
       openNotification(method, isRefreshEndpoint);

    const token = getTokenAuthLogin();
    config.baseURL = getApiUrl();
    if (token) config.headers.Authorization = `Bearer ${token}`;

    //Codifica as strings enviadas para o servidor
    if(config.data && !(config.data instanceof FormData)){
      const { encodeStrings } = useText();
      
      let dataCopy = JSON.parse(JSON.stringify(config.data));
      config.data = encodeStrings(dataCopy);
    }

    return config;
  });

  api.interceptors.response.use(
    (response:any) => {
      // Faz notificações em tela
      closeNotification(response.config.method.toUpperCase());

      return response;
    },
    (error:any) => {
      // Faz notificações em tela
      closeNotification(error.config?.method.toUpperCase());

      if (error.response?.status === enumHttpStatusCode.Status422UnprocessableEntity) {
        error.response.data.errors.forEach((error:any) => {
          if(!error.customErrorCode || !error.customErrorCode.startsWith('WBC_'))
            PbsMessage('validation', error.description);
        });
      } else if (error.response?.status === enumHttpStatusCode.Status401Unauthorized) {
        PbsMessage('error', error.response.data.message ?? 'Usuário não autorizado.');
      } else {
        PbsMessage('error', 'Erro ao realizar operação');
      }

      return Promise.reject(error);
    }
  );
};

// Retorna uma instância do Axios
const getAxios = (keepCache:any) => {
  const axiosInstance = axios.create(getAxiosConfig(keepCache));
  setInterceptors(axiosInstance);
  return axiosInstance;
};

// Retorna uma instância do cache
export const getCacheInstance = () => {
  return localforage.createInstance({
    name: 'paradigma',
    storeName: 'licitacao-web',
    description: 'Paradigma Licitação local cache'
  });
};

export const Api = (keepCache = false) => {
  return getAxios(keepCache);
};

export default { Api };
