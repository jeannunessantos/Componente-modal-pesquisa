import { useTranslation as useOriginalTranslation } from 'react-i18next';
import { useContext } from 'react';
import AppContext from '../../AppContext';

export function useTranslation() {
  const { t: originalTranslate } = useOriginalTranslation(); 
  const { appContext } = useContext(AppContext);

  function t(key: string, options?: any): string {
    let translated = originalTranslate(key, options);

    if (typeof translated === 'string') {
      // Percorra o dicionário lstResourcesSubstitutos e substitua as palavras correspondentes
      for (const [originalWord, replacementWord] of Object.entries(appContext.usuarioLogado.lstResourcesSubstitutos)) {
        const regex = new RegExp(`\\b${originalWord}\\b`, 'g');
        
        // Assegure-se de que replacementWord é uma string
        if (typeof replacementWord === 'string') {
          translated = translated.replace(regex, originalTranslate(replacementWord));
        }
      }
    }

    return translated as string; // Garantindo que o retorno seja uma string
  }

  return { t };
}
