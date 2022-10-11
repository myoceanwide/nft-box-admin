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
      label: '专题编号',
      prop: 'topicId'
    },
    {
      label: '专题名称',
      prop: 'topicName',
      search: true
    },
    {
      label: '创建时间',
      prop: 'addTime'
    },
    {
      width: 150,
      label: '状态',
      prop: 'status',
      type: 'select',
      slot: true,
      dicData: [
        {
          label: '上线中',
          value: 1
        }, {
          label: '已下线',
          value: 0
        }
      ]
    }]
}
