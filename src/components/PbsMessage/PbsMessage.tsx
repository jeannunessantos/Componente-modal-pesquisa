import { message } from 'antd';

const key = 'updatable';

const PbsMessage = (type: string, text: string) => {
  let time = 3;

  switch (type) {
    case 'success':
      message.success({ content: text, key, duration: time });
      break;
    case 'error':
      message.error({ content: text, key, duration: time });
      break;
    case 'warning':
      message.warning({ content: text, key, duration: time });
      break;
    case 'info':
      message.info({ content: text, key, duration: time });
      break;
    case 'validation':
      message.warning({ content: text, duration: 5 });
      break;
  }
};

export default PbsMessage;

