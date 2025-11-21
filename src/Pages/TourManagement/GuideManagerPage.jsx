// src/Pages/TourManagement/GuideManagerPage.jsx
import { useEffect, useState } from "react";
import { 
  Plus, Edit, Trash2, Save, X, Search, MapPin, Globe, DollarSign, User, 
  Upload, Image as ImageIcon, Mail, Phone, Home, Award, Calendar, Briefcase, FileText
} from "lucide-react";
import guidesDefault from "../../data/guides"; 

// 🔥 KEY ĐỒNG BỘ TOÀN HỆ THỐNG
const LS_KEY = "GUIDE_DATA_FINAL_V99";

// --- DANH SÁCH DỮ LIỆU MẪU ---
const LOCATIONS = ["Đà Nẵng", "Hội An", "Huế"];
const LANGUAGES = ["Tiếng Việt", "Tiếng Anh", "Tiếng Hàn", "Tiếng Trung", "Tiếng Nhật", "Tiếng Pháp", "Tiếng Nga", "Tiếng Đức"];
const STYLES = ["Văn hóa", "Ẩm thực", "Phiêu lưu", "Nghỉ dưỡng", "Ảnh/Check-in", "Trải nghiệm", "Lịch sử"];
const GENDERS = ["Nam", "Nữ", "Khác"];

export default function GuideManagerPage() {
  const [guides, setGuides] = useState([]);
  const [q, setQ] = useState("");
  
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form Data Đầy Đủ
  const [form, setForm] = useState({
    id: null,
    name: "",
    gender: "Nam",       // Mới
    dob: "",             // Mới (Ngày sinh)
    email: "",
    phone: "",
    address: "",
    location: "Đà Nẵng",
    language: "Tiếng Việt",
    experience: 1,       // Mới (Số năm kinh nghiệm)
    style: "Văn hóa",
    price: 500000,
    image: "",
    bio: "",             // Mới (Giới thiệu bản thân)
    available: true,
    rating: 5
  });

  // --- 1. LOAD DỮ LIỆU (Tự động thêm trường thiếu) ---
  const loadData = () => {
    const saved = localStorage.getItem(LS_KEY);
    let dataToLoad = [];

    if (saved) {
      dataToLoad = JSON.parse(saved);
    } else {
      dataToLoad = guidesDefault;
    }

    // Chuẩn hóa dữ liệu: Thêm các trường mới nếu dữ liệu cũ chưa có
    const normalizedData = dataToLoad.map(g => ({
        ...g,
        priceType: 'ngày',
        email: g.email || `hdv${g.id}@traveltour.com`,
        phone: g.phone || `090${Math.floor(10000000 + Math.random() * 90000000)}`,
        address: g.address || "Đà Nẵng, Việt Nam",
        gender: g.gender || "Nam",
        dob: g.dob || "1995-01-01",
        experience: g.experience || Math.floor(Math.random() * 5) + 1,
        bio: g.bio || `Xin chào, tôi là ${g.name}. Tôi có kinh nghiệm dẫn tour tại ${g.location}.`
    }));

    setGuides(normalizedData);
    
    // Lưu lại bản chuẩn hóa nếu chưa có hoặc dữ liệu cũ thiếu
    if (!saved) {
        localStorage.setItem(LS_KEY, JSON.stringify(normalizedData));
    }
  };

  useEffect(() => {
    loadData();
    // Lắng nghe sự kiện đồng bộ
    const handleStorage = (e) => { if (e.key === LS_KEY) loadData(); };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // --- XỬ LÝ ẢNH ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("File quá lớn (Max 2MB)");
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  // --- 2. LƯU DỮ LIỆU ---
  const handleSave = (e) => {
    e.preventDefault();
    let newGuides = [...guides];

    const guideData = {
        ...form,
        price: Number(form.price),
        experience: Number(form.experience),
        image: form.image || `https://ui-avatars.com/api/?name=${form.name}&background=random&size=200`,
        priceType: 'ngày'
    };

    if (isEditing) {
      newGuides = newGuides.map(g => g.id === form.id ? guideData : g);
    } else {
      const newId = guides.length > 0 ? Math.max(...guides.map(g => g.id)) + 1 : 1;
      newGuides.unshift({ ...guideData, id: newId });
    }

    setGuides(newGuides);
    localStorage.setItem(LS_KEY, JSON.stringify(newGuides));
    
    // 🔥 Báo hiệu cập nhật
    window.dispatchEvent(new Event("storage"));
    
    setIsOpen(false);
    resetForm();
    alert(isEditing ? "Cập nhật hồ sơ thành công!" : "Thêm nhân viên mới thành công!");
  };

  // --- 3. XÓA DỮ LIỆU ---
  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa hồ sơ này?")) {
      const newGuides = guides.filter(g => g.id !== id);
      setGuides(newGuides);
      localStorage.setItem(LS_KEY, JSON.stringify(newGuides));
      window.dispatchEvent(new Event("storage"));
    }
  };

  const openEdit = (guide) => {
    setForm({
        ...guide,
        // Fallback giá trị nếu dữ liệu cũ bị thiếu
        gender: guide.gender || "Nam",
        dob: guide.dob || "1990-01-01",
        experience: guide.experience || 1,
        bio: guide.bio || ""
    });
    setIsEditing(true);
    setIsOpen(true);
  };

  const openAdd = () => { resetForm(); setIsEditing(false); setIsOpen(true); };

  const resetForm = () => {
    setForm({
      id: null, name: "", email: "", phone: "", address: "",
      gender: "Nam", dob: "", experience: 1, bio: "",
      location: "Đà Nẵng", language: "Tiếng Việt", style: "Văn hóa",
      price: 500000, image: "", available: true, rating: 5
    });
  };

  const filtered = guides.filter(g => 
    g.name.toLowerCase().includes(q.toLowerCase()) || 
    (g.phone && g.phone.includes(q))
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
             <h1 className="text-2xl font-extrabold text-slate-900">Quản Lý Hồ Sơ HDV</h1>
             <p className="text-slate-500 text-sm">Quản lý thông tin chi tiết đội ngũ hướng dẫn viên</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input 
                  value={q} onChange={e => setQ(e.target.value)}
                  placeholder="Tìm tên, số điện thoại..." 
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
             </div>
             <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"><Plus size={20} /> Thêm nhân sự</button>
          </div>
        </div>

        {/* Table List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold">
                <tr>
                  <th className="p-4">Thông tin HDV</th>
                  <th className="p-4">Liên hệ</th>
                  <th className="p-4">Chuyên môn</th>
                  <th className="p-4 text-right">Giá (ngày)</th>
                  <th className="p-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map(g => (
                  <tr key={g.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={g.image} alt={g.name} className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100 border border-gray-200" onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${g.name}&background=random`} />
                        <div>
                          <div className="font-bold text-slate-800">{g.name}</div>
                          <div className="text-xs text-slate-500 flex gap-2 mt-1">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-600">{g.gender}</span>
                              <span className="text-slate-400">•</span>
                              <span>{g.dob ? new Date(g.dob).getFullYear() : "---"}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                       <div className="flex flex-col gap-1.5 text-xs">
                          {g.phone && <span className="flex items-center gap-1.5 text-slate-700 font-medium"><Phone size={14} className="text-emerald-500"/> {g.phone}</span>}
                          {g.email && <span className="flex items-center gap-1.5 text-slate-500"><Mail size={14} className="text-sky-500"/> {g.email}</span>}
                       </div>
                    </td>
                    <td className="p-4">
                       <div className="flex flex-col gap-1 text-xs">
                          <span className="flex items-center gap-1 text-slate-700 font-medium"><MapPin size={14} className="text-rose-500"/> {g.location}</span>
                          <div className="flex gap-2">
                              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">{g.language}</span>
                              <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">{g.style}</span>
                          </div>
                       </div>
                    </td>
                    <td className="p-4 text-right font-bold text-slate-800">{Number(g.price).toLocaleString()}đ</td>
                    <td className="p-4">
                       <div className="flex justify-center gap-2">
                          <button onClick={() => openEdit(g)} className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-lg transition border border-slate-200 hover:border-indigo-200" title="Sửa"><Edit size={16}/></button>
                          <button onClick={() => handleDelete(g.id)} className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition border border-slate-200 hover:border-rose-200" title="Xóa"><Trash2 size={16}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="p-10 text-center text-slate-400 flex flex-col items-center gap-2"><Search size={32} className="opacity-20"/> Không tìm thấy dữ liệu</div>}
          </div>
        </div>
      </div>

      {/* MODAL FORM (FULL SIZE) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
              <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                 <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                   {isEditing ? <Edit size={24} className="text-indigo-600"/> : <Plus size={24} className="text-indigo-600"/>}
                   {isEditing ? "Cập nhật hồ sơ nhân viên" : "Thêm nhân viên mới"}
                 </h3>
                 <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition"><X size={24}/></button>
              </div>
              
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                 
                 {/* Phần 1: Thông tin cá nhân & Ảnh */}
                 <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar Upload */}
                    <div className="w-full md:w-1/4 flex flex-col items-center">
                        <label className="group cursor-pointer relative block w-full aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-indigo-300 hover:border-indigo-500 transition-all bg-slate-50 shadow-inner">
                             <div className="w-full h-full flex items-center justify-center">
                                {form.image ? <img src={form.image} className="w-full h-full object-cover" alt="Preview" /> : <div className="text-center text-slate-400"><ImageIcon className="mx-auto mb-2" size={32}/><span className="text-xs font-bold uppercase tracking-wider">Tải ảnh chân dung</span></div>}
                             </div>
                             <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                             <div className="absolute bottom-3 right-3 bg-indigo-600 text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform"><Upload size={16} /></div>
                        </label>
                        <p className="text-xs text-slate-400 mt-2 text-center">Định dạng: JPG, PNG (Max 2MB)</p>
                    </div>

                    {/* Thông tin cơ bản */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Họ và tên <span className="text-rose-500">*</span></label>
                            <div className="relative"><User size={18} className="absolute left-3 top-3 text-slate-400"/><input required className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="VD: Nguyễn Văn A"/></div>
                        </div>
                        
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Giới tính</label>
                           <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-500" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                               {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                           </select>
                        </div>
                        
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Ngày sinh</label>
                           <div className="relative"><Calendar size={18} className="absolute left-3 top-3 text-slate-400"/><input type="date" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})}/></div>
                        </div>

                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Số điện thoại <span className="text-rose-500">*</span></label>
                           <div className="relative"><Phone size={18} className="absolute left-3 top-3 text-slate-400"/><input required className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="090..."/></div>
                        </div>

                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Email</label>
                           <div className="relative"><Mail size={18} className="absolute left-3 top-3 text-slate-400"/><input type="email" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@domain.com"/></div>
                        </div>
                        
                        <div className="md:col-span-2">
                           <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Địa chỉ thường trú</label>
                           <div className="relative"><Home size={18} className="absolute left-3 top-3 text-slate-400"/><input className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Số nhà, đường, phường/xã, quận/huyện..."/></div>
                        </div>
                    </div>
                 </div>

                 <hr className="border-slate-100" />

                 {/* Phần 2: Thông tin nghề nghiệp */}
                 <div>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider"><Briefcase size={18} className="text-indigo-600"/> Thông tin nghề nghiệp</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Khu vực hoạt động</label>
                          <div className="relative"><MapPin size={18} className="absolute left-3 top-3 text-slate-400"/><select className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-500" value={form.location} onChange={e => setForm({...form, location: e.target.value})}>{LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}</select></div>
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Ngôn ngữ chính</label>
                          <div className="relative"><Globe size={18} className="absolute left-3 top-3 text-slate-400"/><select className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-500" value={form.language} onChange={e => setForm({...form, language: e.target.value})}>{LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}</select></div>
                       </div>
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Kinh nghiệm (Năm)</label>
                          <div className="relative"><Award size={18} className="absolute left-3 top-3 text-slate-400"/><input type="number" min="0" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})}/></div>
                       </div>
                       
                       <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Giá thuê / Ngày (VND)</label>
                          <div className="relative"><DollarSign size={18} className="absolute left-3 top-3 text-slate-400"/><input type="number" required className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700" value={form.price} onChange={e => setForm({...form, price: e.target.value})}/></div>
                       </div>
                       <div className="md:col-span-2">
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Phong cách dẫn tour</label>
                          <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-indigo-500" value={form.style} onChange={e => setForm({...form, style: e.target.value})}>{STYLES.map(s => <option key={s} value={s}>{s}</option>)}</select>
                       </div>
                    </div>
                 </div>

                 <div className="pt-2">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 block">Giới thiệu bản thân / Ghi chú</label>
                    <div className="relative"><FileText size={18} className="absolute left-3 top-3 text-slate-400"/><textarea rows={3} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Mô tả ngắn về kinh nghiệm, sở trường..." value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}/></div>
                 </div>

                 <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                    <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-3 text-slate-600 text-sm font-bold hover:bg-slate-100 rounded-xl transition">Hủy bỏ</button>
                    <button type="submit" className="px-8 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 transition transform active:scale-95">
                       <Save size={18}/> {isEditing ? "Cập nhật hồ sơ" : "Lưu nhân viên mới"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}