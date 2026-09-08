import cartReducer, {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  syncStart,
  syncSuccess,
  syncFailure,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from './cartSlice';

const item1 = { id: 1, title: 'iPhone 15', price: 999, thumbnail: '' };
const item2 = { id: 2, title: 'Galaxy S24', price: 799, thumbnail: '' };

describe('cartSlice — reducer', () => {
  it('returns the initial state', () => {
    expect(cartReducer(undefined, { type: '@@INIT' })).toEqual({
      items: [],
      syncing: false,
      error: null,
    });
  });

  it('adds a new item with quantity 1', () => {
    const state = cartReducer(undefined, addItem(item1));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);
  });

  it('increments quantity when adding an existing item', () => {
    let state = cartReducer(undefined, addItem(item1));
    state = cartReducer(state, addItem(item1));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('removes an item by id', () => {
    let state = cartReducer(undefined, addItem(item1));
    state = cartReducer(state, removeItem(item1.id));
    expect(state.items).toHaveLength(0);
  });

  it('updates quantity correctly', () => {
    let state = cartReducer(undefined, addItem(item1));
    state = cartReducer(state, updateQuantity({ id: item1.id, quantity: 5 }));
    expect(state.items[0].quantity).toBe(5);
  });

  it('enforces minimum quantity of 1', () => {
    let state = cartReducer(undefined, addItem(item1));
    state = cartReducer(state, updateQuantity({ id: item1.id, quantity: -3 }));
    expect(state.items[0].quantity).toBe(1);
  });

  it('clears all items', () => {
    let state = cartReducer(undefined, addItem(item1));
    state = cartReducer(state, addItem(item2));
    state = cartReducer(state, clearCart());
    expect(state.items).toHaveLength(0);
  });

  it('sets syncing=true on syncStart', () => {
    const state = cartReducer(undefined, syncStart());
    expect(state.syncing).toBe(true);
  });

  it('clears syncing on syncSuccess', () => {
    let state = cartReducer(undefined, syncStart());
    state = cartReducer(state, syncSuccess());
    expect(state.syncing).toBe(false);
  });

  it('stores error on syncFailure', () => {
    let state = cartReducer(undefined, syncStart());
    state = cartReducer(state, syncFailure('Server error'));
    expect(state.syncing).toBe(false);
    expect(state.error).toBe('Server error');
  });
});

describe('cartSlice — selectors', () => {
  const rootState = {
    cart: {
      items: [
        { ...item1, quantity: 2 },   // 999 * 2 = 1998
        { ...item2, quantity: 1 },   // 799 * 1 =  799
      ],
    },
  };

  it('selectCartItems', () => expect(selectCartItems(rootState)).toHaveLength(2));
  it('selectCartTotal', () => expect(selectCartTotal(rootState)).toBe(2797));
  it('selectCartCount', () => expect(selectCartCount(rootState)).toBe(3));
});
