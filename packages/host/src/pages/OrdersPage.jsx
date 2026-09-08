import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../store/authSlice';
import './OrdersPage.css';

const MOCK_ORDERS = {
  admin: [
    {
      id: 'ORD-001', date: '2026-08-15', status: 'delivered',
      items: [
        { name: 'iPhone Case',   qty: 2, price: 15.99, img: 'https://i.dummyjson.com/data/products/1/thumbnail.jpg' },
        { name: 'USB-C Hub',     qty: 1, price: 218.01, img: 'https://i.dummyjson.com/data/products/2/thumbnail.jpg' },
      ],
    },
    {
      id: 'ORD-002', date: '2026-08-28', status: 'processing',
      items: [
        { name: 'Wireless Earbuds', qty: 1, price: 89.50, img: 'https://i.dummyjson.com/data/products/3/thumbnail.jpg' },
      ],
    },
    {
      id: 'ORD-003', date: '2026-09-03', status: 'pending',
      items: [
        { name: 'Phone Stand', qty: 1, price: 19.99, img: 'https://i.dummyjson.com/data/products/4/thumbnail.jpg' },
        { name: 'Charging Cable', qty: 3, price: 5.00, img: 'https://i.dummyjson.com/data/products/5/thumbnail.jpg' },
      ],
    },
    {
      id: 'ORD-004', date: '2026-07-20', status: 'delivered',
      items: [
        { name: 'Laptop Stand',  qty: 1, price: 45.00, img: 'https://i.dummyjson.com/data/products/6/thumbnail.jpg' },
        { name: 'Mouse Pad',     qty: 2, price: 12.00, img: 'https://i.dummyjson.com/data/products/7/thumbnail.jpg' },
      ],
    },
  ],
  user: [
    {
      id: 'ORD-101', date: '2026-09-01', status: 'delivered',
      items: [
        { name: 'Laptop Sleeve', qty: 1, price: 59.99, img: 'https://i.dummyjson.com/data/products/8/thumbnail.jpg' },
      ],
    },
    {
      id: 'ORD-102', date: '2026-09-06', status: 'pending',
      items: [
        { name: 'Mechanical Keyboard', qty: 1, price: 129.00, img: 'https://i.dummyjson.com/data/products/9/thumbnail.jpg' },
      ],
    },
  ],
};

const STATUS_META = {
  delivered:  { label: 'Delivered',  bg: '#dcfce7', color: '#16a34a', icon: '✓' },
  processing: { label: 'Processing', bg: '#fef9c3', color: '#ca8a04', icon: '⏳' },
  pending:    { label: 'Pending',    bg: '#fee2e2', color: '#dc2626', icon: '○' },
};

const FILTERS = ['all', 'pending', 'processing', 'delivered'];

const orderTotal = (items) => items.reduce((s, i) => s + i.price * i.qty, 0);

const OrderRow = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const meta  = STATUS_META[order.status];
  const total = orderTotal(order.items);

  return (
    <div className="order-row">
      <button className="order-summary" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
        <span className="order-row-id">{order.id}</span>
        <span className="order-row-date">{order.date}</span>
        <span className="order-row-items">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
        <span className="order-row-total">${total.toFixed(2)}</span>
        <span className="order-row-status" style={{ background: meta.bg, color: meta.color }}>
          {meta.icon} {meta.label}
        </span>
        <span className={`order-chevron${expanded ? ' order-chevron--up' : ''}`}>›</span>
      </button>

      {expanded && (
        <div className="order-details">
          <div className="order-items-list">
            {order.items.map((item, i) => (
              <div key={i} className="order-item">
                <img src={item.img} alt={item.name} className="order-item-img"
                  onError={(e) => { e.target.style.display = 'none'; }} />
                <span className="order-item-name">{item.name}</span>
                <span className="order-item-qty">× {item.qty}</span>
                <span className="order-item-price">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-detail-footer">
            <span>Order total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersPage = () => {
  const user    = useSelector(selectAuthUser);
  const allOrders = MOCK_ORDERS[user?.role] ?? [];
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? allOrders : allOrders.filter((o) => o.status === filter);

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2 className="page-title">My Orders</h2>
        <span className="page-sub">{filtered.length} of {allOrders.length}</span>
      </div>

      {/* Filter tabs */}
      <div className="orders-filters" role="tablist">
        {FILTERS.map((f) => {
          const count = f === 'all' ? allOrders.length : allOrders.filter((o) => o.status === f).length;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`filter-tab${filter === f ? ' filter-tab--active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="filter-count">{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="orders-empty">No {filter} orders found.</div>
      ) : (
        <div className="orders-list">
          <div className="orders-list-header">
            <span>Order ID</span><span>Date</span><span>Items</span>
            <span>Total</span><span>Status</span><span />
          </div>
          {filtered.map((o) => <OrderRow key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
