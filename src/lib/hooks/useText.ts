import useGuid from '../hooks/useGuid';
import moment from 'moment';

export default function useText() {

    const { isValidGUID } = useGuid();

    const encodeSpecialChars = (str?: string) => {
        if(str === null || str === undefined) return;
        
        str = str.replace(/[\u00A0-\u9999<>\&]/gim, function (i) {
            return '&#' + i.charCodeAt(0) + ';';
        });
    
        str = str.replace("\"", "&#34;");
        str = str.replace("'", "&#39;");
        str = str.replace("`", "&#96;");
        str = str.replace("/", "&#47;");
        str = str.replace("\\", "&#92;");
        str = str.replace("\(", "&#40;");
        str = str.replace("\)", "&#41;");
        str = str.replace("+", "&#43;");
        str = str.replace("-", "&#45;");
        str = str.replace("=", "&#61;");
        str = str.replace(":", "&#58;");
        str = str.replace("*", "&#42;");
        str = str.replace("?", "&#63;");
        str = str.replace("!", "&#33;");
        str = str.replace("$", "&#36;");
    
        return str;
    };

    const isDate = (dateStr:any) => {
        //Formato de data mínimo aceitável 'YYYY-MM-DDTHH:mm:ss' e o máximo aceitável 'YYYY-MM-DDTHH:mm:ss.SSS-ZZ:ZZ'
        if(dateStr === null || dateStr === undefined || dateStr.length < 19 || dateStr.length > 29) return false;
    
        let dateStrStart = dateStr.substring(0,19); //Pega apenas até a parte dos segundos
        let dateStrEnd = dateStr.substring(19); //Pega dos milissegundos em diante (pode ser vazia ou ter apenas o -03:00 do fuso)
    
        if(!(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/).test(dateStrStart)) return false;
    
        if(dateStrEnd != '' && !(/^[0-9+:\-\.]+$/).test(dateStrEnd)) return false;
    
        let objDate = moment(dateStrStart);
    
        return objDate.isValid() && objDate.format('YYYY-MM-DD[T]HH:mm:ss') === dateStrStart;
    };
  
    const encodeStrings = (dataObj:any) => {
        if(dataObj === null || dataObj === undefined) return;
    
        if(Array.isArray(dataObj)){
            dataObj = dataObj.map((item) => {
                return encodeStrings(item);
            });     
        } else if(typeof(dataObj) === 'object') {
    
            let keysList = Object.keys(dataObj);
        
            keysList.forEach((key) => {
                let value = dataObj[key];
        
                if(typeof(value) === 'string' && !isDate(value) && !isValidGUID(value)) {
                    dataObj[key] = encodeSpecialChars(value)
                } else {
                    dataObj[key] = encodeStrings(value);
                }
            });    
        } else if(typeof(dataObj) === 'string' && !isDate(dataObj) && !isValidGUID(dataObj)) {
            return encodeSpecialChars(dataObj)
        }
    
        return dataObj;
    };

    return { encodeStrings };
}
