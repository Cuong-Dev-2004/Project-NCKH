import { useEffect, useState } from "react";
import { 
  Plus, Edit, Trash2, Save, X, Search, MapPin, Globe, DollarSign, User, 
  Upload, Image as ImageIcon, Mail, Phone, Home, Award
} from "lucide-react";
import guidesDefault from "../../data/guides"; 

// 🔥 KEY QUAN TRỌNG: Dùng chung cho toàn bộ hệ thống
const LS_KEY = "guides_status_manager_v2";

const LOCATIONS = ["Đà Nẵng", "Hội An", "Huế"];
const LANGUAGES = ["Tiếng Việt", "Tiếng Anh", "Tiếng Hàn", "Tiếng Trung", "Tiếng Nhật", "Tiếng Pháp", "Tiếng Nga", "Tiếng Đức"];
const STYLES = ["Văn hóa", "Ẩm thực", "Phiêu lưu", "Nghỉ dưỡng", "Ảnh/Check-in", "Trải nghiệm", "Lịch sử"];

export default function GuideManagerPage() {
  const [guides, setGuides] = useState([]);
  const [q, setQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [form, setForm] = useState({
    id: null, name: "", email: "", phone: "", address: "",
    location: "Đà Nẵng", language: "Tiếng Việt", style: "Văn hóa",
    price: 500000, image: "", available: true, rating: 5
  });

  const loadData = () => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      setGuides(JSON.parse(saved));
    } else {
      const initData = guidesDefault.map(g => ({
        ...g, priceType: 'ngày',
        email: g.email || `hdv${g.id}@traveltour.com`,
        phone: g.phone || `090${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: g.address || "Chưa cập nhật"
      }));
      setGuides(initData);
      localStorage.setItem(LS_KEY, JSON.stringify(initData));
    }
  };

  useEffect(() => {
    loadData();
    // Lắng nghe nếu có thay đổi từ tab khác
    const handleStorage = () => loadData();
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("File quá lớn (Max 2MB)");
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    let newGuides = [...guides];

    if (isEditing) {
      newGuides = newGuides.map(g => g.id === form.id ? { ...form, price: Number(form.price) } : g);
    } else {
      const newId = guides.length > 0 ? Math.max(...guides.map(g => g.id)) + 1 : 1;
      const newGuide = { 
        ...form, id: newId, price: Number(form.price),
        image: form.image || `https://ui-avatars.com/api/?name=${form.name}&background=random`,
        priceType: 'ngày',
        available: true // Mặc định người mới là rảnh
      };
      newGuides.unshift(newGuide);
    }

    setGuides(newGuides);
    localStorage.setItem(LS_KEY, JSON.stringify(newGuides));
    
    // 🔥 BẮN TÍN HIỆU CẬP NHẬT CHO CÁC TRANG KHÁC
    window.dispatchEvent(new Event("storage"));
    
    setIsOpen(false);
    resetForm();
    alert(isEditing ? "Đã cập nhật hồ sơ!" : "Đã thêm nhân viên mới thành công!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa hồ sơ này?")) {
      const newGuides = guides.filter(g => g.id !== id);
      setGuides(newGuides);
      localStorage.setItem(LS_KEY, JSON.stringify(newGuides));
      window.dispatchEvent(new Event("storage")); // Bắn tín hiệu
    }
  };

  const openEdit = (guide) => { setForm(guide); setIsEditing(true); setIsOpen(true); };
  const openAdd = () => { resetForm(); setIsEditing(false); setIsOpen(true); };
  const resetForm = () => { setForm({ id: null, name: "", email: "", phone: "", address: "", location: "Đà Nẵng", language: "Tiếng Việt", style: "Văn hóa", price: 500000, image: "", available: true, rating: 5 }); };
  
  const filtered = guides.filter(g => g.name.toLowerCase().includes(q.toLowerCase()) || (g.phone && g.phone.includes(q)));

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
             <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Hồ Sơ HDV</h1>
             <p className="text-slate-500 text-sm">Thêm, sửa, xóa thông tin nhân sự</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm tên, SĐT..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
             </div>
             <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"><Plus size={20} /> Thêm nhân sự</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                <tr>
                  <th className="p-4">Thông tin HDV</th>
                  <th className="p-4">Liên hệ</th>
                  <th className="p-4">Khu vực / Ngôn ngữ</th>
                  <th className="p-4">Phong cách</th>
                  <th className="p-4 text-right">Giá (ngày)</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4"><div className="flex items-center gap-3"><img src={g.image} alt={g.name} className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100 border border-gray-200" onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${g.name}&background=random`} /><div><div className="font-bold text-slate-800">{g.name}</div><div className="text-xs text-slate-400 font-mono">ID: {g.id}</div></div></div></td>
                    <td className="p-4"><div className="flex flex-col gap-1.5 text-xs">{g.phone && <span className="flex items-center gap-1.5 text-slate-700 font-medium"><Phone size={14} className="text-emerald-500"/> {g.phone}</span>}{g.email && <span className="flex items-center gap-1.5 text-slate-500"><Mail size={14} className="text-sky-500"/> {g.email}</span>}</div></td>
                    <td className="p-4"><div className="flex flex-col gap-1"><span className="flex items-center gap-1 text-slate-700 font-medium"><MapPin size={14} className="text-rose-500"/> {g.location}</span><span className="flex items-center gap-1 text-slate-500 text-xs"><Globe size={14} className="text-indigo-400"/> {g.language}</span></div></td>
                    <td className="p-4"><span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-semibold border border-indigo-100">{g.style}</span></td>
                    <td className="p-4 text-right font-bold text-slate-800">{Number(g.price).toLocaleString()}đ</td>
                    <td className="p-4"><div className="flex justify-center gap-2"><button onClick={() => openEdit(g)} className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-lg transition border border-slate-200" title="Sửa"><Edit size={16}/></button><button onClick={() => handleDelete(g.id)} className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition border border-slate-200" title="Xóa"><Trash2 size={16}/></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="p-10 text-center text-slate-400">Không tìm thấy dữ liệu</div>}
          </div>
        </div>
      </div>

      {/* MODAL FORM GIỮ NGUYÊN NHƯ CŨ */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                 <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">{isEditing ? "Cập nhật hồ sơ" : "Thêm nhân viên mới"}</h3>
                 <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400"><X size={20}/></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                 <div className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                        <label className="group cursor-pointer relative block">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-indigo-300 group-hover:border-indigo-500 transition-all flex items-center justify-center bg-slate-50 shadow-inner">
                                {form.image ? <img src={form.image} className="w-full h-full object-cover" alt="Preview" /> : <div className="text-center text-slate-400"><ImageIcon className="mx-auto mb-1" size={24}/><span className="text-[10px] uppercase font-bold">Tải ảnh</span></div>}
                            </div>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-full shadow-md"><Upload size={14} /></div>
                        </label>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Họ và tên *</label><input required className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nhập họ tên..."/></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Số điện thoại *</label><input required className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-xl text-sm" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="090..."/></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Email</label><input type="email" className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-xl text-sm" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@..."/></div>
                        </div>
                    </div>
                 </div>
                 <hr className="border-slate-100" />
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Khu vực</label><select className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white" value={form.location} onChange={e => setForm({...form, location: e.target.value})}>{LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}</select></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Ngôn ngữ</label><select className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white" value={form.language} onChange={e => setForm({...form, language: e.target.value})}>{LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}</select></div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Giá (VND)</label><input type="number" required className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-xl text-sm" value={form.price} onChange={e => setForm({...form, price: e.target.value})}/></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Phong cách</label><select className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-xl text-sm bg-white" value={form.style} onChange={e => setForm({...form, style: e.target.value})}>{STYLES.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                 </div>
                 <div><label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Địa chỉ</label><input className="w-full pl-3 pr-3 py-2 border border-slate-200 rounded-xl text-sm" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Địa chỉ cụ thể..."/></div>
                 <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-slate-600 text-sm font-bold hover:bg-slate-100 rounded-xl">Hủy</button>
                    <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg">Lưu hồ sơ</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}