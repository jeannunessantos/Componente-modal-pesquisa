//import { useTranslation } from '_common/lib/hooks/useTranslate';
import { Table, TableProps } from 'antd';
import { ColumnType, RowSelectMethod, TableRowSelection } from 'antd/lib/table/interface';
import Tooltip from 'antd/lib/tooltip';
//import LicitacaoContext from 'pages/licitacao/LicitacaoContext';
import { Key, useContext, useEffect, useMemo, useState } from 'react';

export interface PbsTableRowSelectionProps<T> extends TableRowSelection<T> {
  onChange?: (selectedRowKeys: Key[], selectedRows: T[], info?: { type: RowSelectMethod }) => void;
}

interface PbsTableProps<RecordType> extends TableProps<RecordType> {
  rowSelection?: PbsTableRowSelectionProps<RecordType>;
  cleanSelection?: any;
  allowExpandAll?: boolean;
  expandableRule?: any;
  expandedRowRender?: any;
  defaultExpandedRowKeys?: any;
  expandColumnWidth?: number;
  hidePagination?: boolean;
  defaultPageSize?: number;
  defaultCurrentPage?: number;
  customOnChange?: (pagination:any, filters:any, sorter:any) => void;
  columns?: ColumnType<RecordType>[];
  totalItems?: number; // Total de itens disponível
  showSizeChanger?: boolean;
}

const PbsTable = (props: PbsTableProps<any>) => {
  // contexts
  //const context = useContext(LicitacaoContext);
  //const licitacaoStore = context ? context.licitacaoStore : undefined;

  // hooks
  //const { t } = useTranslation();

  // states
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(props.defaultCurrentPage || 1);
  //const [pageSize, setPageSize] = useState<number>(props.defaultPageSize || licitacaoStore?.nNrItensPorPaginaLicitacao || 20);
  const [pageSize, setPageSize] = useState<number>(20);

  const hasRowToExpand = useMemo(() => {
    return props.dataSource && (props.expandableRule ? props.dataSource.some((record) => props.expandableRule && props.expandableRule(record)) : true);
  }, [props.dataSource]);

  const expandableRule = useMemo(() => {
    return props.expandableRule ? props.expandableRule : () => true;
  }, [props.expandableRule]);

  useEffect(() => {
    if (props.rowSelection) props.rowSelection.onChange!([], []);
  }, [props.cleanSelection]);

  useEffect(() => {
      setCurrentPage(1);
  }, [props.totalItems]);

  const expandAllRows = () => {
    if (props.dataSource) {
      const keys: React.Key[] = [];
      props.dataSource.forEach((item) => {
        keys.push(item.key);
      });
      setExpandedRowKeys(keys);
    }
  };

  const collapseAllRows = () => {
    setExpandedRowKeys([]);
  };

  const customColumns = props.columns?.map(column => ({
    ...column,
    title: () => (
      <Tooltip title={typeof column.title === 'function' ? column.title({}) : String(column.title ?? '')}>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {typeof column.title === 'function' ? column.title({}) : String(column.title ?? '')}
        </div>
      </Tooltip>
    ),
  }));

  const columnTitle: any = () => {
    if (hasRowToExpand) {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="ant-table-row-expand-icon ant-table-row-expand-icon-collapsed" onClick={() => expandAllRows()} />
          <button className="ant-table-row-expand-icon ant-table-row-expand-icon-expanded" onClick={() => collapseAllRows()} />
        </div>
      );
    } else return <></>;
  };

  const handleTableChange: TableProps<any>['onChange'] = (pagination, filters, sorter) => {
    if (pageSize != pagination.pageSize)
      setCurrentPage(1);
    else
      setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 50);

    if (!!props.customOnChange)
      props.customOnChange(pagination, filters, sorter);
  };

  return (
    <>
      {!props.allowExpandAll || props.dataSource?.length === 0 ? (
        <Table
          size="small"
          {...props}
          columns={customColumns}
          onChange={handleTableChange}
          showSorterTooltip={props.columns?.length === 0}
          pagination={
            props.hidePagination
              ? false
              : {
                  current: currentPage,
                  pageSize: pageSize,
                  total: props.totalItems ?? 0,
                  showTotal: (total) => `${'Total de registros'}: ${total}`,                  
                  showSizeChanger: props.showSizeChanger ?? true,
                }
          }
        />
      ) : (
        <Table
          size="small"
          {...props}
          columns={customColumns}
          expandable={{
            expandedRowRender: props.expandedRowRender,
            defaultExpandedRowKeys: props.defaultExpandedRowKeys ?? ['0'],
            rowExpandable: expandableRule,
            columnWidth: props.expandColumnWidth ? props.expandColumnWidth : 40,
            columnTitle: columnTitle(),
            expandedRowKeys: expandedRowKeys,
            onExpand: (expanded, record) => {
              if (expanded) setExpandedRowKeys([...expandedRowKeys, record.key]);
              else setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.key));
            },
          }}
          onChange={handleTableChange}
          showSorterTooltip={props.columns?.length === 0}
          pagination={
            props.hidePagination
              ? false
              : {
                  current: currentPage,
                  pageSize: pageSize,
                  total: props.totalItems ?? 0,
                  showTotal: (total) => `${'Total de registros'}: ${total}`,
                  showSizeChanger: props.showSizeChanger ?? true,                  
                }
          }
        />
      )}
    </>
  );
};

export default PbsTable;
