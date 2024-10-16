import { Spin } from 'antd';
import { createRoot } from 'react-dom/client';

const DiscreetLoader = (isVisible:any) => {
  if (!isVisible) return null;

  return (
    <div style={{ position: 'fixed', top: '10px', right: '100px', zIndex: 1000 }}>
      <Spin size="small" />
    </div>
  );
};

let root: any; 

// Função para montar/desmontar o componente de loading
const toggleDiscreetLoader = (show:any) => {
  const loaderContainerId = 'discreet-loader-container';
  let loaderContainer = document.getElementById(loaderContainerId);

  // Cria o contêiner do loader se ele não existir
  if (!loaderContainer) {
    loaderContainer = document.createElement('div');
    loaderContainer.id = loaderContainerId;
    document.body.appendChild(loaderContainer);
    root = createRoot(loaderContainer);
  }

  root.render(<DiscreetLoader isVisible={show} />);
};

export { toggleDiscreetLoader };