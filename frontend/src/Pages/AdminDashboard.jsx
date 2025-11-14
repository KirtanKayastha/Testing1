import { useState } from "react";
import "./AdminDashboard.css";

export function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Dummy data
  const stats = [
    { 
      title: "Total Sales", 
      value: "₹2,45,680", 
      change: "+12.5%", 
      positive: true,
      icon: "💰"
    },
    { 
      title: "Total Orders", 
      value: "1,234", 
      change: "+8.2%", 
      positive: true,
      icon: "📦"
    },
    { 
      title: "Total Customers", 
      value: "8,567", 
      change: "+15.3%", 
      positive: true,
      icon: "👥"
    },
    { 
      title: "Revenue", 
      value: "₹3,89,450", 
      change: "-2.4%", 
      positive: false,
      icon: "💵"
    }
  ];

  const salesData = [
    { month: "Jan", sales: 45000 },
    { month: "Feb", sales: 52000 },
    { month: "Mar", sales: 48000 },
    { month: "Apr", sales: 61000 },
    { month: "May", sales: 55000 },
    { month: "Jun", sales: 67000 },
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "John Doe", amount: "₹4,250", status: "Completed" },
    { id: "#ORD-002", customer: "Jane Smith", amount: "₹3,180", status: "Pending" },
    { id: "#ORD-003", customer: "Mike Wilson", amount: "₹5,670", status: "Completed" },
    { id: "#ORD-004", customer: "Sarah Johnson", amount: "₹2,890", status: "Shipping" },
    { id: "#ORD-005", customer: "Tom Brown", amount: "₹6,420", status: "Completed" },
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "sales", label: "Sales", icon: "💰" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "marketing", label: "Marketing", icon: "📢" },
    { id: "reports", label: "Reports", icon: "📈" },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">{sidebarCollapsed ? "EM" : "E Market Admin"}</h2>
          <button 
            className="collapse-btn" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? "›" : "‹"}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn-admin">
            <span className="nav-icon">🚪</span>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="header-actions">
            <button className="date-filter">📅 Last 30 Days</button>
            <button className="export-btn">↓ Export</button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <span className={`stat-change ${stat.positive ? "positive" : "negative"}`}>
                  {stat.change} from last month
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Sales Chart */}
          <div className="chart-card">
            <div className="card-header">
              <h3>Sales Overview</h3>
              <select className="chart-filter">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="bar-chart">
              {salesData.map((data, index) => (
                <div key={index} className="bar-wrapper">
                  <div 
                    className="bar" 
                    style={{ height: `${(data.sales / 70000) * 100}%` }}
                  >
                    <span className="bar-value">₹{(data.sales / 1000).toFixed(0)}k</span>
                  </div>
                  <span className="bar-label">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Distribution */}
          <div className="chart-card">
            <div className="card-header">
              <h3>Revenue Distribution</h3>
            </div>
            <div className="pie-chart-wrapper">
              <div className="pie-chart">
                <div className="pie-segment segment-1"></div>
                <div className="pie-segment segment-2"></div>
                <div className="pie-segment segment-3"></div>
              </div>
              <div className="pie-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{background: "#277995"}}></span>
                  <span>Electronics (45%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{background: "#8cbdd2"}}></span>
                  <span>Clothing (30%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{background: "#667eea"}}></span>
                  <span>Accessories (25%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="orders-section">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <button className="view-all-btn">View All →</button>
          </div>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="order-id">{order.id}</td>
                    <td>{order.customer}</td>
                    <td className="amount">{order.amount}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}