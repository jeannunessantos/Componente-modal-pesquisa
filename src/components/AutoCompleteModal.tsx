//import AppContext from '../AppContext';
import PbsSearchForm from '../components/PbsSearchForm/PbsSearchForm';
import LoadingSpinner from '../components/lotties/LoadingSpinner';
import useCpfCnpj from '../lib/hooks/useCpfCnpj';
import useGridSize from '../lib/hooks/useGridSize';
//import { useTranslation } from '_common/lib/hooks/useTranslate';
import useWindowDimensions from '../lib/hooks/useWindowDimensions';
import IFiltro from '../lib/interfaces/IFiltros';
import { Api } from '../services/Api';
import { Button, Divider, Form } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { Key, useContext, useEffect, useMemo, useState } from 'react';
import PbsMessage from '../components/PbsMessage/PbsMessage';
import PbsTable from '../components/PbsTable/PbsTable';
import PbsModal from '../components/PbsModal/PbsModal';
//import PbsEmpresa from '../PbsEmpresa';

type RowSelectionType = 'checkbox' | 'radio';

type PbsModalProps = {
  modalVisivel: boolean;
  fecharModal: any;
  titulo: string;
  apiUrl: string;
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
  const [filtroCnpjCpf, setFiltroCnpjCpf] = useState<string>('');
  const [filtroDescricao, setFiltroDescricao] = useState<string>('');
  const [filtroCodigo, setFiltroCodigo] = useState<string>('');
  const [filtroEmpresa, setFiltroEmpresa] = useState<string>('');
  const [filtroLinhaFornecimento, setFiltroLinhaFornecimento] = useState<string>('');
  //const { appContext } = useContext(AppContext);
  const { formatCpfCnpj } = useCpfCnpj();
  //const { t } = useTranslation();
  const [form] = Form.useForm();
  const [colunasState, setColunasState] = useState<ColumnsType>([]);
  const [filtrosState, setFiltrosState] = useState<IFiltro[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [paginaAtual, setPaginaAtual] = useState<number | undefined>(undefined);
  

  useEffect(() => {
    setGridSize(`${getGridSize(height - 120, 280)}px`);
  }, []);



  const columnDescricaoDefaultConfig = [{ title: 'Descrição', dataIndex: 'value' }];
  const filterDescricaoDefaultConfig = [{ id: 'pesquisa_descricao', descricao: 'Descrição', span: 6 },];

  const tipoPesquisaConfig = {
    //  pesquisa_usuario_responsavel: {
    //    columns: columnsPesquisaUsuarioConfig,
    //    filters: filtersPesquisaUsuarioConfig
    // },
    // pesquisa_usuario_membro_comissao: {
    //   columns: columnsPesquisaUsuarioConfig,
    //   filters: filtersPesquisaUsuarioConfig
    // },
    // pesquisa_produto: {
    //   columns: columnsPesquisaProdutoConfig,
    //   filters: filtersPesquisaProdutoConfig
    // },
    // pesquisa_comprador: {
    //   columns: columnDescricaoDefaultConfig,
    //   filters: filtersPesquisaCompradorConfig
    // },
    //  pesquisa_empresa: {
    //    columns: columnsPesquisaEmpresaConfig,
    //    filters: filtersPesquisaEmpresaConfig
    //  },
    // pesquisa_fornecedor_convidado: {
    //   columns: columnsPesquisaEmpresaConfig,
    //   filters: filtersPesquisaEmpresaConfig
    // },
    // pesquisa_fornecedor_vencedor: {
    //   columns: columnsPesquisaEmpresaConfig,
    //   filters: filtersPesquisaEmpresaConfig
    // }
  };

  useEffect(() => {
    if(props.columnDescricaoDefaultConfig != null && props.filterDescricaoDefaultConfig != null){
      
      //const { columns, filters } = tipoPesquisaConfig[props.tipoPesquisa];
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
    //   const { data } = await Api().get<IAutoCompleteModal[]>(`${props.apiUrl}`, {
    //     params: {
    //       value_like: filtroDescricao
    //     }
    //   });
    const data = [
        { companyKey : "0004197849", key : 14636, value: "0004197849" },
        { companyKey : "0004197850", key : 14637, value: "0004197850" },
        { companyKey : "0004197851", key : 14638, value: "0004197851" },
    ];
      setRetorno(data);
    }
   

    async function loadEmpresa() {
        debugger;
      //  const resultData = await Api().get<IAutoCompleteModal[]>(`${props.apiUrl}`, {
      //    params: {
      //      key: props.params,
      //      value_like: filtroDescricao,
      //      company_key: filtroCnpjCpf.replace(/[^0-9]/g, '')
      //    }
      //  });
       
    const data = [
        { companyKey : "0004197849", key : 14636, value: "0004197849" },
        { companyKey : "0004197850", key : 14637, value: "0004197850" },
        { companyKey : "0004197851", key : 14638, value: "0004197851" },
    ];
      formatarCpfCnpj(data);
      setRetorno(data);
    }
 

    if (props.modalVisivel) {
      switch (props.apiUrl) {
        case 'usuario':
          //loadUsuarios();
          break;
        case 'empresa':
        case 'empresa/FornecedorasAtivas':
          loadEmpresa();
          break;
        case 'empresa/convidado':
          //loadEmpresaConvidado();
          break;
        case 'empresa/ExternaUsuario':
          //loadEmpresaExternaUsuario();
          break;
        case 'secretaria':
        case 'regimeExecucao':
          loadDefault();
          break;
        case 'criterio':
          //loadCriterio();
          break;
        case 'usuario/UsuariosEmpresaExterna':
          //loadUsuariosEmpresaExterna();
          break;
        default:
          //loadDocumentos();
          break;
      }

      props.resetStatus();
    }
  }, [filtroDescricao, filtroCodigo, filtroCnpjCpf, filtroEmpresa, filtroLinhaFornecimento, props.newSearch, props.modalVisivel]);

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
    setFiltroDescricao(filtros.pesquisa_descricao ? filtros.pesquisa_descricao : '');
    setFiltroCodigo(filtros.pesquisa_codigo ? filtros.pesquisa_codigo : '');
    setFiltroCnpjCpf(filtros.pesquisa_cnpjcpf ? filtros.pesquisa_cnpjcpf : '');
    setFiltroEmpresa(filtros.pesquisa_empresa ? filtros.pesquisa_empresa : '');
    setFiltroLinhaFornecimento(filtros.pesquisa_linha_fornecimento_produto ? filtros.pesquisa_linha_fornecimento_produto : '');
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
        width={1200}
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
