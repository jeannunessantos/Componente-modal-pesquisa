import ISelect from '../../lib/interfaces/ISelect';
import { Form, FormInstance, Select } from 'antd';
import { useTranslation } from '../../lib/hooks/useTranslate';

type SelectProps = {
  name: string;
  label: string;
  campoRequired?: boolean;
  value?: number | null;
  options: ISelect[];
  form?: FormInstance<any>;
  onChange?: (field: string) => void | undefined;
  style?: any;
  disabled?: boolean;
  ref?: any;
  allowClear?: boolean;
  valueSelected?: number | null | undefined;
  onClear?: (value:any, id:any) => void | undefined;
};

export default function PbsSelect(props: SelectProps) {
  const { t } = useTranslation();
  const SelectItens = props.options.map((_) => {
    return (
      <Select.Option key={_.key} value={_.key}>
        {_.value}
      </Select.Option>
    );
  });

  return (
    <>
      <Form.Item
        key={props.name}
        name={props.name}
        label={props.label}
        style={props.style}
        rules={[
          {
            required: props.campoRequired,
            validator(_, value) {
              if ((props.campoRequired && (value === undefined || value === null)) || value < 0) {
                return Promise.reject();
              } else return Promise.resolve();
            },
            message: t('Campo') + ` ${props.label.toLowerCase()} ` + t('é obrigatório')
          }
        ]}
        initialValue={props?.value}>
        <Select
          value={props?.valueSelected?.toString()}
          ref={props.ref}
          allowClear={props.allowClear ?? true}
          onClear={props.onClear ? () => props.onClear!(undefined, props.name) : undefined}
          onChange={props.onChange}
          disabled={props.disabled}>
          {SelectItens}
        </Select>
      </Form.Item>
    </>
  );
}
