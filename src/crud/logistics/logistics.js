export const tableOption = {
  border: true,
  // selection: true,
  index: false,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 350,
  align: 'center',
  refreshBtn: true,
  searchSize: 'mini',
  searchMenuSpan: 4,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [{
    label: '用户手机',
    prop: 'phoneNumber',
    search: true,
    searchSpan: 4
  }, {
    label: '物流状态',
    prop: 'takeStatus',
    search: true,
    type: 'select',
    searchSpan: 4,
    slot: true,
    dicData: [
      {
        label: '待发货',
        value: 3
      }, {
        label: '已发货',
        value: 4
      }
    ]
  },
  {
    label: '1688订单号',
    prop: '1688',
    hide: true,
    searchLabelWidth: 100,
    search: true
  },
  {
    label: '物流单号',
    prop: 'logisticsNumber'
  },
  {
    label: '备注',
    prop: 'takeRemarks',
    search: true
  }
  ]
}
