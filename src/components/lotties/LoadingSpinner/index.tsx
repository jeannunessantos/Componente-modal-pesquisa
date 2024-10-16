import Lottie from 'react-lottie';
import loadingSpinnerData from './loading-spinner.json';

const LoadingSpinner = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingSpinnerData
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div>
        <Lottie options={defaultOptions} height={120} width={120} />
      </div>
      <div>Buscando informações...</div>
    </div>
  );
};

export default LoadingSpinner;
