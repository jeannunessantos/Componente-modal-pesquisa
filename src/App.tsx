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
   const columnsPesquisaConfig = [{ title: 'Código', dataIndex: 'companyKey', width: '12%' },{ title: 'Descrição', dataIndex: 'value' }];
   const filtersPesquisaConfig = [{ id: 'sNrCnpj', descricao: 'CNPJ', span: 4 }, { id: 'sNmEmpresa', descricao: 'Descrição', span: 6 },];
  
  // const columnsPesquisaConfig = [
  //   { title: 'Código', dataIndex: 'sCdProdutoEmpresa', width: '12%' },
  //   { title: 'Descrição', dataIndex: 'value' },
  //   { title: 'Linha de fornecimento', dataIndex: 'sDsLinhaFornecimento', width: '35%' }
  // ];
  // const filtersPesquisaConfig = [
  //   { id: 'sCdProdutoEmpresa', descricao: 'Código', span: 4 },
  //   { id: 'sDsProduto', descricao: 'Nome', span: 6 },
  //   { id: 'sDsLinhaForn', descricao: 'Linha de fornecimento', span: 6 }
  // ];

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
              //apiUrl={'produto'}
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
              columnDescricaoDefaultConfig={columnsPesquisaConfig}
              filterDescricaoDefaultConfig={filtersPesquisaConfig}
              /> 
              </div>
      </header>
    </div>
  );
}

export default App;
