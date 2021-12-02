// https://github.com/bvaughn/react-virtualized/blob/master/docs/Table.md
const tableRequired = {
  width: 'Number',
  height: 'Number',
  headerHeight: 'Number',
  rowHeight: 'Number',
  rowCount: 'Number',
  rowGetter: 'Function',
}

const table = {
  autoHeight: 'Boolean',
  children: 'Column',
  className: 'String',
  disableHeader: 'Boolean',
  estimatedRowSize: 'Number',
  gridClassName: 'String',
  gridStyle: 'Object',
  headerClassName: 'String',
  headerHeight: 'Number',
  headerRowRenderer: 'Function',
  headerStyle: 'Object',
  height: 'Number',
  id: 'String',
  noRowsRenderer: 'Function',
  onColumnClick: 'Function',
  onHeaderClick: 'Function',
  onRowClick: 'Function',
  onRowDoubleClick: 'Function',
  onRowMouseOut: 'Function',
  onRowMouseOver: 'Function',
  onRowRightClick: 'Function',
  onRowsRendered: 'Function',
  overscanRowCount: 'Number',
  onScroll: 'Function',
  rowClassName: 'String',
  rowCount: 'Number',
  rowGetter: 'Function',
  rowHeight: 'Number',
  rowRenderer: 'Function',
  rowStyle: 'Object',
  scrollToAlignment: 'String',
  scrollToIndex: 'Number',
  scrollTop: 'Number',
  sort: 'Function',
  sortBy: 'String',
  sortDirection: 'SortDirection',
  style: 'Object',
  tabIndex: 'Number',
  width: 'Number',
}

// https://github.com/bvaughn/react-virtualized/blob/master/docs/Column.md
const column = {
  cellDataGetter: 'Function',
  cellRenderer: 'Function',
  className: 'String',
  columnData: 'Object',
  dataKey: 'any',
  defaultSortDirection: 'SortDirection',
  disableSort: 'Boolean',
  flexGrow: 'Number',
  flexShrink: 'Number',
  headerClassName: 'String',
  headerRenderer: 'Function',
  headerStyle: 'Object',
  id: 'String',
  label: 'Node',
  maxWidth: 'Number',
  minWidth: 'Number',
  style: 'Object',
  width: 'Number',
}

// https://github.com/bvaughn/react-virtualized/blob/master/docs/ColumnSizer.md
const columnSizer = {
  children: 'Function',
  columnMaxWidth: 'Number',
  columnMinWidth: 'Number',
  width: 'Number',
}

const columnSizerChildren = {
  adjustedWidth: 'Number',
  columnWidth: 'Number',
  getColumnWidth: ' Function',
  registerChild: 'Function',
}