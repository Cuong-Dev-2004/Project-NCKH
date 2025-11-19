import { useEffect, useMemo, useState } from "react";
import { 
  Search, UserCheck, UserX, Users, MapPin, Globe, 
  RefreshCcw, CheckCircle, XCircle 
} from "lucide-react";
import guidesDefault from "../../data/guides"; 

// 🔥 KEY ĐỒNG BỘ: Phải giống hệt bên GuideManagerPage
const LS_KEY = "guides_status_manager_v2";

export default function GuideStatusPage() {
  const [guides, setGuides] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); 

  // Hàm load dữ liệu từ localStorage
  const loadData = () => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      setGuides(JSON.parse(saved));
    } else {
      // Nếu chưa có, lấy dữ liệu gốc
      const initData = guidesDefault.map(g => ({...g, priceType: 'ngày'}));
      setGuides(initData);
      localStorage.setItem(LS_KEY, JSON.stringify(initData));
    }
  };

  useEffect(() => {
    // 1. Load lần đầu
    loadData();

    // 2. Lắng nghe sự kiện thay đổi từ các tab/trang khác (QUAN TRỌNG)
    const handleStorageChange = (e) => {
      // Nếu key thay đổi đúng là key của mình -> Load lại
      if (e.key === LS_KEY) {
        loadData();
      }
    };
    
    // 3. Lắng nghe sự kiện focus (Khi người dùng quay lại tab này)
    const handleFocus = () => loadData();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    }
  }, []);

  const toggleStatus = (id) => {
    const updatedList = guides.map((g) => {
      if (g.id === id) return { ...g, available: !g.available };
      return g;
    });
    setGuides(updatedList);
    localStorage.setItem(LS_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event("storage")); // Báo cho các trang khác
  };

  // 🔥 HÀM RESET DỮ LIỆU GỐC
  const handleReset = () => {
    if(window.confirm("Bạn có chắc muốn xóa hết dữ liệu cũ và nạp lại 10 HDV gốc từ file?")) {
       const initData = guidesDefault.map(g => ({...g, priceType: 'ngày'}));
       setGuides(initData);
       localStorage.setItem(LS_KEY, JSON.stringify(initData));
       // Bắn sự kiện để các tab khác cũng cập nhật theo
       window.dispatchEvent(new Event("storage"));
       alert("Đã nạp lại dữ liệu gốc thành công!");
    }
  }

  const stats = useMemo(() => {
    const total = guides.length;
    const available = guides.filter(g => g.available).length;
    const busy = total - available;
    return { total, available, busy };
  }, [guides]);

  const filteredGuides = useMemo(() => {
    return guides.filter(g => {
      const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || 
                          g.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" 
                          ? true 
                          : filterStatus === "available" ? g.available : !g.available;
      return matchSearch && matchStatus;
    });
  }, [guides, search, filterStatus]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Trạng Thái HDV</h1>
            <p className="text-slate-500 text-sm mt-1">Theo dõi và điều phối lịch làm việc</p>
          </div>
          
          {/* 🔥 NÚT CẬP NHẬT DỮ LIỆU MỚI */}
          <button 
            onClick={handleReset} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 rounded-xl text-sm hover:bg-indigo-50 text-indigo-700 shadow-sm transition font-bold"
          >
            <RefreshCcw size={16} /> Nạp lại dữ liệu gốc
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Tổng số HDV" value={stats.total} icon={Users} color="bg-indigo-50 text-indigo-600" />
          <StatCard title="Đang rảnh" value={stats.available} icon={UserCheck} color="bg-emerald-50 text-emerald-600" />
          <StatCard title="Đang bận" value={stats.busy} icon={UserX} color="bg-rose-50 text-rose-600" />
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm tên HDV hoặc địa điểm..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
          </div>
          <div className="flex gap-2">
            <FilterBtn label="Tất cả" active={filterStatus === "all"} onClick={() => setFilterStatus("all")} />
            <FilterBtn label="Rảnh" active={filterStatus === "available"} onClick={() => setFilterStatus("available")} />
            <FilterBtn label="Bận" active={filterStatus === "busy"} onClick={() => setFilterStatus("busy")} />
          </div>
        </div>

        {/* GRID DANH SÁCH */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${guide.available ? 'border-slate-100' : 'border-rose-100 bg-rose-50/10'}`}>
              <div className="flex items-start gap-4">
                <img src={guide.image} alt={guide.name} className={`w-16 h-16 rounded-full object-cover ring-4 ${guide.available ? 'ring-emerald-50' : 'ring-rose-50 grayscale'}`} onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${guide.name}&background=random`} />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg">{guide.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <MapPin size={12}/> {guide.location} • <Globe size={12}/> {guide.language}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${guide.available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {guide.available ? "Đang rảnh" : "Đang bận"}
                </div>
                <button onClick={() => toggleStatus(guide.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${guide.available ? 'bg-white border border-slate-200 text-slate-600 hover:text-rose-600' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
                  {guide.available ? <><XCircle size={16} /> Báo bận</> : <><CheckCircle size={16} /> Báo rảnh</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><Icon size={24} /></div>
      <div><p className="text-slate-500 text-sm font-medium">{title}</p><p className="text-2xl font-extrabold text-slate-800">{value}</p></div>
    </div>
  );
}
function FilterBtn({ label, active, onClick }) {
  return <button onClick={onClick} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${active ? "bg-slate-900 text-white shadow-md" : "bg-white text-slate-500 border border-slate-200"}`}>{label}</button>;
}