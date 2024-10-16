import React from 'react';
import logo from './logo.svg';
import {useState} from "react";
import { Button, Col, Divider, Form, FormInstance, Input, Radio, Row, Switch } from 'antd';
import './App.css';
import PbsAutoComplete from './components/PbsAutoComplete';

interface FormularioProps {
  //uidLicitacao: string | undefined;
  form: FormInstance<any>;
  //setSituacaoNova: any;
  //loading: boolean;
  //setLoading: (loading: boolean) => void;
}

function App() {
  const [param, setParam] = useState(32);
  const [isCamposBloqueados, setCamposBloqueados] = useState<boolean>(true);
  const [form] = Form.useForm();

  function changeField() {}
  const columnDescricaoDefaultConfig = [{ title: 'Código', dataIndex: 'companyKey', width: '12%' },{ title: 'Descrição', dataIndex: 'value' }];
  const filterDescricaoDefaultConfig = [{ id: 'pesquisa_codigo', descricao: 'Código', span: 4 }, { id: 'pesquisa_descricao', descricao: 'Descrição', span: 6 },];

  return (
    <div className="App">
      <header className="App-header">
        <div style={{width:'50%'}}>
          <PbsAutoComplete 
              id="nCdEmpresa"
              name="sDsEmpresa"
              label={'Empresa'}
              required
              destacarBotao
              apiUrl={'empresa'}
              params={'comprador'}
              abrirModal
              selectionType="radio"
              form={form}
              valorIdSelecionado={1}
              valorDescricaoSelecionada={'Empresa compradora'}
              clear
              onChange={changeField}
              disabled={false}
              key={'nCdEmpresa'}
              tipoPesquisa="pesquisa_empresa"
              columnDescricaoDefaultConfig={columnDescricaoDefaultConfig}
              filterDescricaoDefaultConfig={filterDescricaoDefaultConfig}
              /> 
              </div>
      </header>
    </div>
  );
}

export default App;
