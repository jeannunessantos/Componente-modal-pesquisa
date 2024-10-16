export default function useGridSize() {
    const getGridSize = (height:any, windowDiscount:any) => {
      const alturaGrid = (height) - windowDiscount;
      if (alturaGrid < 350) return 350;
      return alturaGrid;
    };
  
    return { getGridSize };
  }
  