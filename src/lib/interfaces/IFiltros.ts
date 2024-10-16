import ISelect from "./ISelect";

export default interface IFiltro {
  id: string;
  filterName?: string;
  descricao: string;
  span: number;
  type?: string | undefined;
  param?: string | undefined;
  apiUrl?: string | undefined;
  valorIdSelecionado?: number | string | undefined;
  valorDescricaoSelecionada?: string | undefined;
  options?: ISelect[] | undefined;
  default?: string | number | undefined;
  bFlFiltroAvancado?: boolean;
  hidden?: boolean;
  value?: string | number | undefined;
}
