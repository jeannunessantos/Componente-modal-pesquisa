import { Col, Form, Input } from 'antd';
//import { useTranslation } from '_common/lib/hooks/useTranslate';

interface CampoProps {
  id: string;
  descricao: string;
  span: number;
  colStyle: any;
  initialValue?: string | number | undefined
  onChange: (value:any, id:any) => void; 
}

export default function Campo(props: CampoProps) {
  const { id, descricao, span, initialValue, onChange } = props;
  //const { t } = useTranslation();

  return (
    <Col span={span} key={id} style={props.colStyle}>
      <Form.Item
        name={`${id}`}
        label={descricao}
        initialValue={initialValue}>
        <Input placeholder={'Pesquisa por' + ` ${descricao.toLowerCase()}`} onChange={(e) => onChange(e.target.value, id)}/>
      </Form.Item>
    </Col>
  );
}
