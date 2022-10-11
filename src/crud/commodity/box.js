export const tableOption = {
  border: true,
  selection: false,
  stripe: true,
  menuAlign: 'center',
  menuWidth: 350,
  align: 'center',
  refreshBtn: true,
  searchSize: 'mini',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  searchMenuSpan: 6,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [
    {
      label: '盲盒包编号',
      prop: 'boxId'
    },
    {
      label: '盲盒名称',
      prop: 'boxName',
      search: true
    },
    {
      label: '盲盒价格',
      prop: 'onePrice'
    },
    {
      width: 150,
      label: '状态',
      prop: 'status',
      slot: 'true',
      type: 'select',
      dicData: [
        {
          label: '上线中',
          value: 1
        }, {
          label: '下线中',
          value: 0
        }
      ]
    }]
}
