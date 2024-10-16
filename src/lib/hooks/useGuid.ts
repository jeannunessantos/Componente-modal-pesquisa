export default function useGuid() {
    const isGuidNullOrEmpty = (guid?: string) => {
      if (!guid) return true;
      if (guid === '00000000-0000-0000-0000-000000000000') return true;
      return false;
    };
  
    const isValidGUID = (guid?: string) => {
      if (guid === null || guid === undefined) return false;
      return (/^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/).test(guid);
    };
  
    return { isGuidNullOrEmpty, isValidGUID };
  }
  