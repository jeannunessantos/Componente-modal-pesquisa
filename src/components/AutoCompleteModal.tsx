import PbsSearchForm from '../components/PbsSearchForm/PbsSearchForm';
import LoadingSpinner from '../components/lotties/LoadingSpinner';
import useCpfCnpj from '../lib/hooks/useCpfCnpj';
import useGridSize from '../lib/hooks/useGridSize';
import useWindowDimensions from '../lib/hooks/useWindowDimensions';
import IFiltro from '../lib/interfaces/IFiltros';
import { Api } from '../services/Api';
import { Button, Divider, Form } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { Key, useEffect, useMemo, useState } from 'react';
import PbsMessage from '../components/PbsMessage/PbsMessage';
import PbsTable from '../components/PbsTable/PbsTable';
import PbsModal from '../components/PbsModal/PbsModal';

type RowSelectionType = 'checkbox' | 'radio';

type PbsModalProps = {
  modalVisivel: boolean;
  fecharModal: any;
  width?:number;
  titulo: string;
  apiUrlBase: string;
  apiController: string;
  apiEndPoint: string;
  params?: string | number;
  selectionType: RowSelectionType;
  selecioneModal: any;
  id: string;
  newSearch: boolean;
  resetStatus: any;
  tipoPesquisa?: string;
  valorIdSelecionado?: string | number;
  valorDescricaoSelecionado?: string;
  columnDescricaoDefaultConfig?:[];
  filterDescricaoDefaultConfig?:[];
};

interface IAutoCompleteModal {
  key: React.Key;
  value: string;
  companyKey?: string;
  sNmEmpresa?: string;
}

export default function PbsAutoCompleteModal(props: PbsModalProps) {
  const [loading, setLoading] = useState(false);
  const { getGridSize } = useGridSize();
  const { height } = useWindowDimensions();
  const [gridSize, setGridSize] = useState<string | null>(null);
  const [retorno, setRetorno] = useState<IAutoCompleteModal[] | undefined>();
  const [idSelecionado, setIdSelecionado] = useState<IAutoCompleteModal[]>([]);
  const [descricaoSelecionada, setDescricaoSelecionada] = useState<IAutoCompleteModal[]>([]);
  
  
  const [Filtros, setFiltros] = useState<any>(new Object());
  const { formatCpfCnpj } = useCpfCnpj();
  const [form] = Form.useForm();
  const [colunasState, setColunasState] = useState<ColumnsType>([]);
  const [filtrosState, setFiltrosState] = useState<IFiltro[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [paginaAtual, setPaginaAtual] = useState<number | undefined>(undefined);
  

  useEffect(() => {
    setGridSize(`${getGridSize(height - 120, 280)}px`);
  }, []);

  const filterDescricaoDefaultConfig = [{ id: 'pesquisa_codigo', descricao: 'Código', span: 4 }, { id: 'pesquisa_descricao', descricao: 'Descrição', span: 6 }];
  const columnDescricaoDefaultConfig = [{ title: 'Código', dataIndex: 'companyKey', width: '12%' },{ title: 'Descrição', dataIndex: 'value' }];

  useEffect(() => {
    if(props.columnDescricaoDefaultConfig != undefined && props.filterDescricaoDefaultConfig != undefined){
      const columns = props.columnDescricaoDefaultConfig;
      const filters = props.filterDescricaoDefaultConfig;
      setColunasState(columns);
      setFiltrosState(filters);
    } else {
      //caso não possua configuração de tipo pesquisa, retorna colunas e filtros padrão (Descrição)
      setColunasState(columnDescricaoDefaultConfig);
      setFiltrosState(filterDescricaoDefaultConfig);
    }
  }, [props.tipoPesquisa]);

  useEffect(() => {
    async function loadDefault() {
      var url = props.apiUrlBase + props.apiController;
      const { data } = await Api(url).get<IAutoCompleteModal[]>(props.apiEndPoint, {
        params: Filtros
        
      });
      formatarCpfCnpj(data);
      setRetorno(data);
    }

    if (props.modalVisivel) {
      loadDefault();
      props.resetStatus();
    }

  }, [Filtros, props.newSearch, props.modalVisivel]);

  function handleOk() {
    if (idSelecionado.length <= 0) {
      PbsMessage('warning', 'Não foi possível efetuar a operação. Selecione pelo menos um registro.');
      return;
    }
    setLoading(true);
    props.selecioneModal(idSelecionado, descricaoSelecionada);
    setTimeout(() => {
      handlePesquisarFiltro('');
      form.resetFields();
      props.fecharModal();
      setLoading(false);
    }, 300);
  }

  function handleCancel() {
    handlePesquisarFiltro('');
    form.resetFields();
    props.fecharModal();
  }

  function handlePesquisarFiltro(filtros:any) {
    setFiltros(filtros ? filtros : '');
  }

  function formatarCpfCnpj(data:any) {
    for (let i in data) {
      data[i].companyKey = formatCpfCnpj(data[i].companyKey);
    }
  }

  const rowSelection = useMemo(() => {
    if (props.modalVisivel) {
      const selectedKeys = selectedRowKeys.length ? selectedRowKeys : [props.valorIdSelecionado as Key];
      var rowSelection = {
        selectedRowKeys: selectedKeys,
        onChange: (selectedRowKeys:any, selectedRows:any) => {
          setIdSelecionado(selectedRowKeys);
          setDescricaoSelecionada(selectedRows);
          setSelectedRowKeys(selectedRowKeys);
        },
        getCheckboxProps: (record:any) => ({
          id: record.id
        })
      };

      let indexEncontrado: number = retorno!.findIndex((item) => item.key === (props.valorIdSelecionado as Key));
      const pagina = Math.ceil((indexEncontrado + 1) / 10); // Adicionamos 1 ao índice para corrigir o início da contagem em 1 e dividimos pela quantidade de registros por pagina
      setPaginaAtual(pagina);

      return rowSelection;
    }

    return null;
  }, [selectedRowKeys, retorno]);

  return (
    <>
      <PbsModal
        open={props.modalVisivel}
        title={`Selecione um` + `${props.titulo.charAt(props.titulo.length - 1) === 'a' ? 'a ' : ' '}${props.titulo.toLowerCase()}`}
        onOk={handleOk}
        bodyStyle={{ overflowY: 'hidden' }}
        onCancel={handleCancel}
        width={props.width != undefined ? props.width : 1200}
        footer={[ 
          <Button key="back" onClick={handleCancel}>
            {'Cancelar'}
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            {'Selecionar'}
          </Button>
        ]}>
        <PbsSearchForm formModal={form} filtros={filtrosState} handlePesquisar={handlePesquisarFiltro} />
        <Divider />

        {!retorno ? (
          <LoadingSpinner />
        ) : (
          <PbsTable
            rowSelection={{
              type: props.selectionType,
              ...rowSelection
            }}
            scroll={{ y: `${gridSize}` }}
            columns={colunasState}
            dataSource={retorno}
            size="small"
            defaultPageSize={10}
            defaultCurrentPage={paginaAtual}
          />
        )}
      </PbsModal>
    </>
  );
}
