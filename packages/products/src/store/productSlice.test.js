import productReducer, {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setSearchQuery,
  setPage,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectSearchQuery,
  selectTotalProducts,
} from './productSlice';

const mockProducts = [
  { id: 1, title: 'iPhone 15', price: 999, rating: 4.5 },
  { id: 2, title: 'Galaxy S24', price: 799, rating: 4.3 },
];

describe('productSlice — reducer', () => {
  it('returns the initial state', () => {
    const state = productReducer(undefined, { type: '@@INIT' });
    expect(state.items).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.searchQuery).toBe('');
  });

  it('sets loading=true and clears error on fetchProductsStart', () => {
    const state = productReducer(undefined, fetchProductsStart());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores products and clears loading on fetchProductsSuccess', () => {
    let state = productReducer(undefined, fetchProductsStart());
    state = productReducer(
      state,
      fetchProductsSuccess({ products: mockProducts, total: 2 })
    );
    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(2);
    expect(state.totalProducts).toBe(2);
  });

  it('stores error and clears loading on fetchProductsFailure', () => {
    let state = productReducer(undefined, fetchProductsStart());
    state = productReducer(state, fetchProductsFailure('Network Error'));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network Error');
    expect(state.items).toHaveLength(0);
  });

  it('updates searchQuery and resets page', () => {
    const state = productReducer(
      { items: [], loading: false, error: null, searchQuery: '', currentPage: 3, totalProducts: 0 },
      setSearchQuery('phone')
    );
    expect(state.searchQuery).toBe('phone');
    expect(state.currentPage).toBe(1);
  });

  it('updates currentPage', () => {
    const state = productReducer(undefined, setPage(4));
    expect(state.currentPage).toBe(4);
  });
});

describe('productSlice — selectors', () => {
  const rootState = {
    products: {
      items: mockProducts,
      loading: true,
      error: 'err',
      searchQuery: 'test',
      totalProducts: 50,
    },
  };

  it('selectProducts', () => expect(selectProducts(rootState)).toEqual(mockProducts));
  it('selectProductsLoading', () => expect(selectProductsLoading(rootState)).toBe(true));
  it('selectProductsError', () => expect(selectProductsError(rootState)).toBe('err'));
  it('selectSearchQuery', () => expect(selectSearchQuery(rootState)).toBe('test'));
  it('selectTotalProducts', () => expect(selectTotalProducts(rootState)).toBe(50));
});
