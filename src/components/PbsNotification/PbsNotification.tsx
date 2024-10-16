// notificationHelper.js
import { notification } from 'antd';
import { toggleDiscreetLoader } from '../lotties/DiscreetLoader/DiscreetLoader';
import { LoadingOutlined } from '@ant-design/icons';

let requestCounters = { success: 0, info: 0, warning: 0, error: 0, refresh: 0 };

// Abre uma notificação com controle de exibição única por tipo
const openNotification = (method:any, isRefreshEndpoint:any, message?:any, description?:any) => {
  const type = method === 'GET' ? 'info' : 'success';
  const key = `notification_${type}`;

  // Incrementa o contador para o tipo específico
  requestCounters[type]++;

  // Mostra o loading se for um endpoint de refresh
  if (isRefreshEndpoint) {
    toggleDiscreetLoader(true);
    return;
  }

  // Verifica se é o primeiro request desse tipo para abrir a notificação
  if (requestCounters[type] === 1) {
    notification[type]({
      message: message || method === 'GET' ? 'Buscando informações' : 'Realizando operação',
      description: description || method === 'GET' ? 'Processando sua solicitação...' : 'Processando sua solicitação...',
      icon: message || method === 'GET' ? undefined : <LoadingOutlined spin style={{color: '#1890ff'}}/>,
      key,
      duration: 0
    });
  }
};

// Fecha a notificação para um tipo específico se não houver mais requests pendentes
const closeNotification = (method:any) => {
  const type = method === 'GET' ? 'info' : 'success';
  const key = `notification_${type}`;

  // Decrementa o contador para o tipo específico
  requestCounters[type]--;

  // Se não houver mais requests pendentes, fecha a notificação
  if (requestCounters[type] === 0) {
      toggleDiscreetLoader(false);
    notification.destroy(key);
  }
};

export { openNotification, closeNotification };
