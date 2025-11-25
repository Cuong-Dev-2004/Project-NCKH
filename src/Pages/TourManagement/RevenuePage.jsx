import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  Wallet,
  ArrowRight,
  ArrowLeft,
  Activity,
  Calendar,
  RefreshCcw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const LS_KEY = "bookings_admin_demo_v1";

// Hàm format tiền tệ
const vnd = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "đ";

export default function RevenuePage() {
  const [data, setData] = useState([]);
  const [showBalance, setShowBalance] = useState(true); // Trạng thái ẩn/hiện số dư

  // 1. Load dữ liệu
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    setData(raw ? JSON.parse(raw) : []);
  }, []);

  // 2. Xử lý dữ liệu cho Thống kê và Biểu đồ
  const { summary, chartData, recentTransactions } = useMemo(() => {
    const currentDate = new Date();
    const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

    // Init data cho 12 tháng
    const monthlyMap = {};
    for (let i = 0; i < 12; i++) {
      const m = i + 1;
      monthlyMap[m] = { name: `Tháng ${m}`, tienVao: 0, tienRa: 0, balance: 0 };
    }

    let totalBalance = 0;
    let monthIn = 0;
    let monthOut = 0; // Dữ liệu booking thường không có chi phí, tạm để 0 hoặc bạn tự thêm logic

    // Duyệt data
    [...data].forEach((item) => {
      const date = new Date(item.checkinDate || new Date());
      const amount = Number(item.total || 0);
      const month = date.getMonth() + 1;
      const yearMonth = item.checkinDate?.slice(0, 7); // yyyy-mm

      // Cộng dồn tổng số dư (Giả sử toàn bộ doanh thu là số dư tích lũy)
      totalBalance += amount;

      // Cộng vào biểu đồ
      if (monthlyMap[month]) {
        monthlyMap[month].tienVao += amount;
        monthlyMap[month].balance += amount; // Balance = Vào - Ra
      }

      // Tính toán cho tháng hiện tại (Cards)
      if (yearMonth === currentMonthKey) {
        monthIn += amount;
        // monthOut += ... (nếu có trường chi phí)
      }
    });

    const monthBalance = monthIn - monthOut;

    // Lấy 5 giao dịch gần nhất, đảo ngược để lấy mới nhất
    const recent = [...data]
      .sort((a, b) => new Date(b.checkinDate) - new Date(a.checkinDate))
      .slice(0, 5);

    return {
      summary: { totalBalance, monthIn, monthOut, monthBalance },
      chartData: Object.values(monthlyMap),
      recentTransactions: recent,
    };
  }, [data]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800">
      {/* Header Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-700 hidden lg:block">Dashboard Tài Chính</h2>
        <div className="flex gap-3 ml-auto">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 text-slate-600 shadow-sm transition-all"
          >
            <RefreshCcw size={16} /> Làm mới
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm hover:bg-slate-50 text-slate-600 shadow-sm transition-all">
            <Calendar size={16} /> Tháng này
          </button>
        </div>
      </div>

      {/* Phần 1: 4 Cards Thống kê */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Số dư hiện tại */}
        <StatCard
          title="Số dư hiện tại"
          value={summary.totalBalance}
          icon={<Wallet className="text-blue-500" size={20} />}
          showEye={true}
          isVisible={showBalance}
          onToggle={() => setShowBalance(!showBalance)}
        />
        {/* Card 2: Tiền vào tháng này */}
        <StatCard
          title="Tiền vào tháng này"
          value={summary.monthIn}
          icon={<ArrowRight className="text-emerald-500" size={20} />}
          bgIcon="bg-emerald-50"
        />
        {/* Card 3: Tiền ra tháng này */}
        <StatCard
          title="Tiền ra tháng này"
          value={summary.monthOut}
          icon={<ArrowLeft className="text-red-500" size={20} />}
          bgIcon="bg-red-50"
        />
        {/* Card 4: Balance tháng này */}
        <StatCard
          title="Balance tháng này"
          value={summary.monthBalance}
          icon={<Activity className="text-indigo-500" size={20} />}
          bgIcon="bg-indigo-50"
        />
      </section>

      {/* Phần 2: Biểu đồ & Giao dịch gần đây */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột Trái: Biểu đồ (Chiếm 2 phần) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-slate-700 font-semibold">Dòng tiền hàng tháng</h3>
            <button className="text-slate-400 hover:text-slate-600">
              <RefreshCcw size={14} />
            </button>
          </div>
          
          <div className="h-[350px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={0} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8' }} 
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => vnd(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar name="Tiền vào" dataKey="tienVao" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar name="Tiền ra" dataKey="tienRa" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                {/* Balance có thể dùng Line hoặc Bar tùy thích */}
                <Bar name="Balance" dataKey="balance" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cột Phải: Giao dịch gần đây (Chiếm 1 phần) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-slate-700 font-semibold mb-6">Giao dịch gần đây</h3>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentTransactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                <span>Chưa có giao dịch</span>
              </div>
            ) : (
              recentTransactions.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {item.guestName ? item.guestName.charAt(0).toUpperCase() : "K"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.guestName || "Khách vãng lai"}</p>
                      <p className="text-xs text-slate-400">{item.checkinDate}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    +{vnd(item.total)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// Component Card nhỏ tái sử dụng
function StatCard({ title, value, icon, bgIcon = "bg-blue-50", showEye = false, isVisible = true, onToggle }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
          {title}
          {/* Tooltip icon giả lập */}
          <span className="text-slate-300 cursor-help text-xs border border-slate-200 rounded-full w-4 h-4 flex items-center justify-center">?</span>
        </div>
        <div className={`w-10 h-10 rounded-full ${bgIcon} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-slate-800">
          {isVisible ? vnd(value) : "******"}
        </span>
        {showEye && (
          <button onClick={onToggle} className="text-slate-400 hover:text-slate-600 transition-colors">
            {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}