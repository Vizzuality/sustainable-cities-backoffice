const DEFAULT_PAGINATION_SIZE = 20;
const DEFAULT_PAGINATION_NUMBER = 1;
const DEFAULT_SORT_FIELD = 'name';

const IMPACT_TABLE_FIELDS = [
  { label: 'Name', value: 'name', sortable: true },
  { label: 'Category', value: 'category', sortable: true },
  { label: 'Impact Unit', value: 'impact_unit', sortable: true },
  { label: 'Impact Value', value: 'impact_value' }
];

export { DEFAULT_PAGINATION_SIZE, DEFAULT_PAGINATION_NUMBER, DEFAULT_SORT_FIELD, IMPACT_TABLE_FIELDS };
