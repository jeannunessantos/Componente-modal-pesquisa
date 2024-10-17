import { ClearOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormInstance, Row, Drawer, Space, Tooltip } from 'antd';
import IFiltro from '../../lib/interfaces/IFiltros';
import PbsAutoComplete from '../PbsAutoComplete';
import Campo from './Campo';
import { useContext, useEffect, useMemo, useState } from 'react';
import PbsSelect from '../../components/PbsSelect/PbsSelect';
import IFiltrosPesquisa from '../../lib/interfaces/IFiltrosPesquisa';

type SearchFormProps = {
  formModal?: FormInstance<any>;
  filtros: IFiltro[];
  handlePesquisar: (filtros:any) => void;
  handleClean?: () => void;
  bFlPesquisaProcessos?: boolean;
};

type ValoresType = {
  pesquisa_numero?: string;
  pesquisa_objeto?: string;
  pesquisa_tipoModalidade?: number | string;
  pesquisa_tipo_avaliacao?: number | string;
  pesquisa_resultado?: number | string;
  pesquisa_usuario_empresa?: number | string;
  pesquisa_usuario_responsavel?: number | string;
  pesquisa_produto?: number | string;
  pesquisa_usuario_membro_comissao?: number | string;
  pesquisa_fornecedor_convidado?: number | string;
  pesquisa_fornecedor_vencedor?: number | string;
  pesquisa_empresa?: number | string;
};

export default function PbsSearchForm(props: SearchFormProps) {
  const { formModal, filtros, handlePesquisar, bFlPesquisaProcessos } = props;
  const [form] = Form.useForm();
  const [valoresId, setValoresId] = useState<ValoresType>({});
  const [valoresDescricao, setValoresDescricao] = useState<ValoresType>({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const [filtrosState, setFiltrosState] = useState<IFiltro[]>([]);

  const hasFiltrosAvancados = useMemo(() => {
    return filtros.some((s) => s.bFlFiltroAvancado && !s.hidden);
  }, [filtros]);

  useEffect(() => {
    setFiltrosState(filtros);
    filtros.forEach(filtro => {
      onChange(filtro.id, filtro.valorIdSelecionado ?? filtro.value, filtro.valorDescricaoSelecionada ?? filtro?.options?.find(option => option.key == filtro.value)?.value)
    });    
  }, [filtros]);

  const tamanhoSpanPesquisar = useMemo(() => {
    // Calcula o total de span dos filtros
    const totalSpanFiltros = filtros.filter((filtro) => !filtro.hidden).reduce((acc, filtro) => acc + filtro.span, 0);
    // Calcula o span para o <Col>, garantindo que o valor mínimo seja 3 (3 filtros + botões limpar/pesquisar)
    return totalSpanFiltros === 20 ? 4 : Math.max(8, 24 - totalSpanFiltros);
  }, [filtros]);

  const onFinish = (filtros: any) => {
    debugger;
    if (bFlPesquisaProcessos) {
      const filtrosRetorno: IFiltrosPesquisa[] = [];
      handlePesquisar(filtrosRetorno);
      if (hasFiltrosAvancados) setOpenDrawer(false);
      return;
    }
    handlePesquisar(filtros);
  };

  function onChange(e:any, key:any, value:any) {
    setValoresId((prevState) => ({
      ...prevState,
      [e]: key
    }));

    setValoresDescricao((prevState) => ({
      ...prevState,
      [e]: value
    }));
  }

  const handleFiltroComponent = (filtro: IFiltro) => {
    let returnComponent = (
      <Campo
        initialValue={filtro.value}
        span={filtro.span}
        descricao={filtro.descricao}
        id={filtro.id}
        key={filtro.id}
        colStyle={{ height: filtro.bFlFiltroAvancado ? 80 : 'auto' }}
        onChange={onChangeFilter}
      />
    );

    if (filtro.value) form.setFieldValue(filtro.id, filtro.value);

    if (filtro.type) {
      if (filtro.type === 'autoComplete') {
        returnComponent = (
          <Col span={filtro.span} key={filtro.id} style={{ height: filtro.bFlFiltroAvancado ? 80 : 'auto' }}>
            <Form.Item name={`${filtro.id}`}>
              <PbsAutoComplete
                selectionType="radio"
                form={formModal ? formModal : form}
                apiUrl={filtro.apiUrl != undefined ? filtro.apiUrl : ''}
                params={filtro.param != undefined ? filtro.param : ''}
                id={filtro.id}
                name=""
                label={filtro.descricao}
                abrirModal
                onChange={onChange}
                valorIdSelecionado={filtro.valorIdSelecionado}
                valorDescricaoSelecionada={filtro.valorDescricaoSelecionada}
                tipoPesquisa={filtro.id}
              />
            </Form.Item>
          </Col>
        );
        if (!!filtro.valorIdSelecionado){
          form.setFieldValue(filtro.id, filtro.valorIdSelecionado);
        }
      } else if (filtro.type === 'dropDownList') {
        const valueSelected = filtro.value ? Number(filtro.value) : form.getFieldValue(filtro.id) ? form.getFieldValue(filtro.id) : Number(filtro.default);
        returnComponent = (
          <Col span={filtro.span} key={filtro.id} style={{ height: filtro.bFlFiltroAvancado ? 80 : 'auto' }}>
            <PbsSelect
              key={filtro.id}
              name={filtro.id}
              label={filtro.descricao}
              value={valueSelected}
              valueSelected={valueSelected}
              options={filtro.options!}
              onClear={onChangeFilter}
              onChange={(e:any) => {
                onChangeFilter(e, filtro.id);
                onChange(filtro.id, e, undefined);
              }}
            />
          </Col>
        );

        form.setFieldValue(filtro.id, valueSelected);
      }
    }
    return returnComponent;
  };

  const onChangeFilter = (value:any, id:any) => {
    const filtrosUpdated: IFiltro[] = filtrosState.map((filtro) => {
      if (filtro.id === id) {
        form.setFieldValue(filtro.id, !value || value === '' ? filtro.default : value);
        filtro.value = !value && filtro.type === 'dropDownList' ? filtro.default : value;
        return filtro;
      }
      return filtro;
    });

    setFiltrosState(filtrosUpdated);
  };

  const handleCleanFilters = () => {
    !!formModal ? formModal.resetFields() : form.resetFields();

    props.handleClean?.();

    const filtrosUpdated: IFiltro[] = filtrosState.map((filtro) => {
      filtro.valorIdSelecionado = undefined;
      filtro.valorDescricaoSelecionada = undefined;
      filtro.value = undefined;
      return filtro;
    });

    filtrosState.forEach((filtro) => {
      !!formModal ? formModal.setFieldValue(filtro.id, filtro.value) : form.setFieldValue(filtro.id, filtro.value);
    });

    setFiltrosState(filtrosUpdated);
    setValoresDescricao({});
    setValoresId({});

    // if (pesquisaContext) {
    //   if (pesquisaContext.filtrosStore.filtrosPesquisa) pesquisaContext.filtrosStore.handleClean();
    // }
    handlePesquisar(filtrosUpdated);
  };

  const layout = {
    labelCol: { span: 24 }, // define a largura da coluna da label
    wrapperCol: { span: 24 } // define a largura da coluna do input
  };

  return (
    <>
      <Form form={formModal ? formModal : form} layout="vertical" name="pesquisa_avancada" className="ant-advanced-search-form" onFinish={onFinish}>
        <Row gutter={24}>
          {filtrosState.filter((filtro) => !filtro.bFlFiltroAvancado && !filtro.hidden).map((filtro) => handleFiltroComponent(filtro))}
          <Col
            span={tamanhoSpanPesquisar}
            style={{
              paddingTop: '1.8rem',
              paddingBottom: '1rem',
              textAlign: 'right'
            }}>
            <Button icon={<SearchOutlined />} type="primary" htmlType="submit">
              {'Pesquisar'}
            </Button>
            <Button
              icon={<ClearOutlined />}
              style={{
                marginLeft: '0.5rem'
              }}
              onClick={() => handleCleanFilters()}>
              {'Limpar'}
            </Button>
            {hasFiltrosAvancados && (
              <Tooltip placement="top" title={'Filtros avançados'}>
                <Button
                  icon={<FilterOutlined />}
                  type="primary"
                  onClick={() => setOpenDrawer(true)}
                  style={{
                    marginLeft: '0.5rem'
                  }}
                />
              </Tooltip>
            )}
          </Col>
        </Row>
      </Form>

      {hasFiltrosAvancados && (
        <Drawer
          title="Filtrar"
          placement={'right'}
          width={400}
          onClose={() => setOpenDrawer(false)}
          open={openDrawer}
          extra={
            <Space>
              <Button type="primary" onClick={() => form.submit()}>
                Pesquisar
              </Button>
              <Button icon={<ClearOutlined />} onClick={() => handleCleanFilters()}>
                {'Limpar'}
              </Button>
            </Space>
          }>
          <Form {...layout} form={formModal ? formModal : form} layout="vertical" name="pesquisa_avancada" className="ant-advanced-search-form" onFinish={onFinish}>
            {filtrosState.filter((filtro) => filtro.bFlFiltroAvancado && !filtro.hidden).map((filtro) => handleFiltroComponent(filtro))}
          </Form>
        </Drawer>
      )}
    </>
  );
}
