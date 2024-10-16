export default function useCpfCnpj() {
    const formatCpfCnpj = (valor:any) => {
      let formatado;
      if(valor && valor.length === 14){
        formatado = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
      } else if(valor && valor.length === 11){
        formatado = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      } else{
        formatado = valor;
      }
      return(formatado);
    }
    const formatCNPJMask = (value: string) => {          
      const cnpjOnlyNumbers = value.replace(/[^\d]*/g, '');
      let cnpjFormatado = '';
      for (let index = 0; index < cnpjOnlyNumbers.length; index++) {
          if (index === 2 || index === 5) cnpjFormatado += '.';
          if (index === 8) cnpjFormatado += '/';
          if (index === 12) cnpjFormatado += '-';
          cnpjFormatado += cnpjOnlyNumbers.charAt(index);            
      }        
      return cnpjFormatado;        
    };
    return { formatCpfCnpj, formatCNPJMask };
  }
  