import { SearchOutlined } from '@ant-design/icons';
//import { useTranslation } from '_common/lib/hooks/useTranslate';
//import { Api } from '_common/lib/services/Api';
import { AutoComplete, Button, Form, FormInstance } from 'antd';
import Group from 'antd/lib/input/Group';
import { useEffect, useState } from 'react';
import AutoCompleteModal from '../components/AutoCompleteModal';
type RowSelectionType = 'checkbox' | 'radio';

type AutoCompleteProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  destacarBotao?: boolean;
  apiUrl: string;
  params?: string | number;
  abrirModal?: boolean;
  selectionType: RowSelectionType;
  form: FormInstance<any>;
  valorIdSelecionado?: string | number | undefined | null;
  valorDescricaoSelecionada?: string;
  onChange?: (field:any, value:any, options:any) => void;
  clear?: boolean;
  resetStatus?: any;
  disabled?: boolean;
  handleClearField_callback?: (id:any) => void;
  tipoPesquisa?: string;
  columnDescricaoDefaultConfig?:any;
  filterDescricaoDefaultConfig?:any;
};

interface IAutoCompleteOptions {
  key: number;
  value: string;
}

export default function PbsAutoComplete(props: AutoCompleteProps) {
  const [opcoesApi, setOpcoesApi] = useState<IAutoCompleteOptions[]>([]);
  const [opcoesFilter, setOpcoesFilter] = useState<IAutoCompleteOptions[]>([]);
  const [filtro, setFiltro] = useState<string>('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [idSelecionado, setIdSelecionado] = useState<string | number>('');
  const [descricaoSelecionada, setDescricaoSelecionada] = useState<string>('');
  const [search, setSearch] = useState(false);
  //const { t } = useTranslation();

  const onSelect = (value:any, options:any) => {
    setIdSelecionado(options.key);
    setDescricaoSelecionada(value);

    props.form.setFieldsValue({
      [props.id]: options.key,
      [props.name]: value
    });

    if (props.onChange !== undefined) props.onChange(props.id, options.key, value);
  };

  /*useEffect
 nesse use efect pegar props.descricao e props.id e setar em idselecionado e descricaoselecionada
 */
  useEffect(() => {
    async function fetchSetarSelecionado() {
      setIdSelecionado(props.valorIdSelecionado ? props.valorIdSelecionado : '');
      setDescricaoSelecionada(props.valorDescricaoSelecionada ? props.valorDescricaoSelecionada : '');
      props.form.setFieldsValue({
        [props.id]: props.valorIdSelecionado,
        [props.name]: props.valorDescricaoSelecionada
      });
    }
    fetchSetarSelecionado();
  }, [props.valorIdSelecionado]);

  useEffect(() => {
    setDescricaoSelecionada(props.valorDescricaoSelecionada ? props.valorDescricaoSelecionada : '');
  }, [props.valorDescricaoSelecionada]);

  function handlePesquisar() {
    if (props.abrirModal) {
      handleAbrirModal();
    }
  }

  async function onSearch(searchText: string) {
    debugger;
    setFiltro(searchText);
    const filteredOptions = opcoesApi.filter(option => option.value.toUpperCase().includes(searchText.toUpperCase()));
    setOpcoesFilter(filteredOptions)
  }

  function handleAbrirModal() {
    setModalVisivel(true);
  }

  function handleFecharModal() {
    setModalVisivel(false);
  }

  async function handlSelecioneModal(selectedRowKeys: any, selected: any) {
    //Preparar para Componente trazer lista
    setIdSelecionado(selectedRowKeys[0]);
    setDescricaoSelecionada(selected[0].value);

    props.form.setFieldsValue({
      [props.id]: selectedRowKeys[0],
      [props.name]: selected[0].value
    });

    if (props.onChange !== undefined) props.onChange(props.id, selectedRowKeys[0], selected[0].value);
  }

  async function onFocus() {
    const searchText = '';
    const data = [
        { companyKey : "0004197849", key : 14636, value: "0004197849" },
        { companyKey : "0004197850", key : 14637, value: "0004197850" },
        { companyKey : "0004197851", key : 14638, value: "0004197851" },
    ];
    // switch (props.apiUrl) {
    //   case 'usuario':
    //     const { data: usuarios } = await Api().get(`${props.apiUrl}`, {
    //       params: {
    //         nCdEmpresa: props.params,
    //         sNmUsuario: searchText
    //       }
    //     });
        

    //     setOpcoesApi(usuarios);
    //     break;
    //   case 'usuario/UsuariosEmpresaExterna':
    //     const { data: usuariosExtena } = await Api().get(`${props.apiUrl}`, {
    //       params: {
    //         sNmUsuarioFiltro: searchText
    //       }
    //     });
    //     setOpcoesApi(usuariosExtena);

    //     break;
    //   default:
    //     const { data } = await Api().get<IAutoCompleteOptions[]>(`${props.apiUrl}`, {
    //       params: {
    //         key: props.params,
    //         value_like: searchText
    //       }
    //     });

        setOpcoesApi(data);
    //    break;
    //}
  }

  useEffect(() => {
    if (props.clear) {
      setIdSelecionado('');
      setDescricaoSelecionada('');
      props.form.setFieldsValue({
        [props.id]: undefined,
        [props.name]: undefined
      });

      if (props.id == 'sCdUsuario') {
        loadUsuarioByEmpresa();
      }
      if (props.id == 'nCdDepartamento') {
        loadDepartamentoByEmpresa();
      }
      //props.resetStatus();
      setSearch(true);
    }
  }, [props.clear]);

  function loadUsuarioByEmpresa() {
    const data = [
        { companyKey : "0004197849", key : 14636, value: "0004197849" },
        { companyKey : "0004197849", key : 14637, value: "0004197849" },
        { companyKey : "0004197849", key : 14638, value: "0004197849" },
    ];
    setOpcoesApi(data);
    // Api()
    //   .get<IAutoCompleteOptions[]>(`/usuario`, {
    //     params: {
    //       key: props.params,
    //       value_like: ''
    //     }
    //   })
    //   .then(function (resp:any) {
    //     setOpcoesApi(resp.data);
    //   });
  }

  function loadDepartamentoByEmpresa() {
    // Api()
    //   .get<IAutoCompleteOptions[]>(`/departamento`, {
    //     params: {
    //       key: props.params,
    //       value_like: ''
    //     }
    //   })
    //   .then(function (resp:any) {
    //     setOpcoesApi(resp.data);
    //   });
    const data = [
        { companyKey : "0004197849", key : 14636, value: "0004197849" },
        { companyKey : "0004197849", key : 14637, value: "0004197849" },
        { companyKey : "0004197849", key : 14638, value: "0004197849" },
    ];
    setOpcoesApi(data);
  }

  function resetClear() {
    setSearch(false);
  }

  function handleClearField() {
    setIdSelecionado('');
    setDescricaoSelecionada('');
    setFiltro('');
    props.form.setFieldsValue({
      [props.id]: undefined,
      [props.name]: undefined
    });

    if (props.handleClearField_callback) props.handleClearField_callback(props.id);
  }

  return (
    <>
      <Form.Item
        name={props.id}
        label={props.label}
        rules={[
          {
            required: props.required,
            validator(_, value) {
              if (props.required) {
                if (value > 0) return Promise.resolve();
                else return Promise.reject();
              }
              return Promise.resolve();
            },
            message: ('Campo') + ` ${props.label.toLowerCase()} ` + ('é obrigatório')
          }
        ]}
        initialValue={idSelecionado}>
        <Group compact>
          <AutoComplete
            allowClear={true}
            onClear={handleClearField}
            onSelect={onSelect}
            id={idSelecionado.toString()}
            value={descricaoSelecionada ? descricaoSelecionada : filtro}
            options={opcoesFilter}
            onSearch={onSearch}
            style={{ width: '95%' }}
            disabled={props.disabled}
            onFocus={onFocus}
          />
          <Button onClick={handlePesquisar} style={{ width: '5%' }} icon={<SearchOutlined />} disabled={props.disabled} />
        </Group>
      </Form.Item>

      <AutoCompleteModal
        modalVisivel={modalVisivel}
        fecharModal={handleFecharModal}
        selecioneModal={handlSelecioneModal}
        titulo={props.label}
        apiUrl={props.apiUrl}
        params={props.params}
        selectionType={props.selectionType}
        id={props.id}
        newSearch={props.clear!}
        resetStatus={resetClear}
        tipoPesquisa={props.tipoPesquisa}
        valorIdSelecionado={idSelecionado}
        valorDescricaoSelecionado={descricaoSelecionada}
        columnDescricaoDefaultConfig={props.columnDescricaoDefaultConfig}
        filterDescricaoDefaultConfig={props.filterDescricaoDefaultConfig}
      />
    </>
  );
}
