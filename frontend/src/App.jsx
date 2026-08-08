import React, { useState } from 'react';

// স্টাফ ও ম্যানেজারদের তালিকা
const STAFF_DATA = {
  'asif': { name: 'আসিফ', role: 'STAFF', canExpense: true, buses: ['এস আর ট্রাভেলস', 'দেশ ট্রাভেলস', 'নাবিল পরিবহন', 'শ্যামলী এন আর পরিবহন', 'সি লাইন', 'সাকুরা পরিবহন', 'অন্যান্য পরিবহন'] },
  'jahid': { name: 'জাহিদ', role: 'STAFF', canExpense: true, buses: ['হানিফ', 'ইউনিটি', 'অন্যান্য পরিবহন'] },
  'anwar': { name: 'আনোয়ার', role: 'STAFF', canExpense: false, buses: ['একতা ট্রান্সপোর্ট'] },
  'toufiq': { name: 'তৌফীক', role: 'STAFF', canExpense: true, buses: ['দেশ ট্রাভেলস'] },
  'manam': { name: 'মানাম', role: 'STAFF', canExpense: false, buses: ['শাহ্‌ ফতেহ আলী পরিবহন'] },
  'nasim': { name: 'নাসিম', role: 'STAFF', canExpense: false, buses: ['এস আর ট্রাভেলস', 'শ্যামলী এন আর পরিবহন', 'নাবিল পরিবহন'] },
  'misuk': { name: 'মিশুক', role: 'STAFF', canExpense: true, buses: ['লাবিব পরিবহন', 'নাবিল পরিবহন', 'দেশ ট্রাভেলস', 'সাকুরা পরিবহন', 'শাহ্‌ সুলতান'] },
  'admin': { name: 'মালিক (অ্যাডমিন)', role: 'ADMIN', canExpense: true, buses: [] }
};

// খরচের খাতের ক্যাটাগরি তালিকা
const EXPENSE_CATEGORIES = [
  'মোবাইল বিল',
  'স্থায়ী খরচ',
  'ইউটিলিটি',
  'স্টেশনরি',
  'আপ্যায়ন',
  'মেরামত ও রক্ষণাবেক্ষণ',
  'অন্যান্য'
];

const TODAY_DATE = new Date().toISOString().split('T')[0];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // ফিল্টার স্টেট
  const [filterMode, setFilterMode] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(TODAY_DATE);
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [selectedStaff, setSelectedStaff] = useState('all');

  // ডাটা স্টেট
  const [sales, setSales] = useState([
    { id: 1, staffId: 'asif', staffName: 'আসিফ', transport: 'এস আর ট্রাভেলস', tickets: 10, rate: 50, total: 500, date: TODAY_DATE },
    { id: 2, staffId: 'misuk', staffName: 'মিশুক', transport: 'লাবিব পরিবহন', tickets: 12, rate: 60, total: 720, date: TODAY_DATE },
    { id: 3, staffId: 'jahid', staffName: 'জাহিদ', transport: 'হানিফ', tickets: 15, rate: 40, total: 600, date: TODAY_DATE },
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, staffId: 'asif', staffName: 'আসিফ', category: 'আপ্যায়ন', description: 'চা-নাস্তা', amount: 150, date: TODAY_DATE }
  ]);

  // ইনপুট স্টেট
  const [entryDate, setEntryDate] = useState(TODAY_DATE);
  const [selectedBus, setSelectedBus] = useState('');
  const [tickets, setTickets] = useState('');
  const [rate, setRate] = useState('');
  
  // খরচ ইনপুট স্টেট (খাত + বিবরণ)
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  // ✏️ অ্যাডমিন এডিট স্টেট
  const [editingSale, setEditingSale] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);

  // লগইন
  const handleLogin = (e) => {
    e.preventDefault();
    const user = STAFF_DATA[usernameInput.toLowerCase()];
    if (user && passwordInput === '1234') {
      setCurrentUser({ ...user, id: usernameInput.toLowerCase() });
    } else {
      alert('ভুল আইডি বা পাসওয়ার্ড!');
    }
  };

  // বিক্রি যোগ
  const handleAddSale = (e) => {
    e.preventDefault();
    if (!selectedBus || !tickets || !rate || !entryDate) return alert('সবগুলো ঘর পূরণ করুন');
    const newSale = {
      id: Date.now(),
      staffId: currentUser.id,
      staffName: currentUser.name,
      transport: selectedBus,
      tickets: Number(tickets),
      rate: Number(rate),
      total: Number(tickets) * Number(rate),
      date: entryDate
    };
    setSales([newSale, ...sales]);
    setTickets('');
    setRate('');
  };

  // খরচ যোগ (খাতসহ)
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseCategory || !expenseDesc || !expenseAmount || !entryDate) {
      return alert('খরচের খাত, বিবরণ ও টাকাসহ সবগুলো ঘর পূরণ করুন');
    }
    const newExpense = {
      id: Date.now(),
      staffId: currentUser.id,
      staffName: currentUser.name,
      category: expenseCategory,
      description: expenseDesc,
      amount: Number(expenseAmount),
      date: entryDate
    };
    setExpenses([newExpense, ...expenses]);
    setExpenseCategory('');
    setExpenseDesc('');
    setExpenseAmount('');
  };

  // 🗑️ ডিলিট
  const handleDeleteSale = (id) => {
    if (window.confirm('আপনি কি এই বিক্রির হিসাবটি মুছে ফেলতে চান?')) {
      setSales(sales.filter(s => s.id !== id));
    }
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('আপনি কি এই খরচের হিসাবটি মুছে ফেলতে চান?')) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  // ✏️ এডিট সেভ
  const handleSaveSaleEdit = (e) => {
    e.preventDefault();
    setSales(sales.map(s => s.id === editingSale.id ? { 
      ...editingSale, 
      tickets: Number(editingSale.tickets), 
      rate: Number(editingSale.rate), 
      total: Number(editingSale.tickets) * Number(editingSale.rate) 
    } : s));
    setEditingSale(null);
  };

  const handleSaveExpenseEdit = (e) => {
    e.preventDefault();
    setExpenses(expenses.map(exp => exp.id === editingExpense.id ? {
      ...editingExpense,
      amount: Number(editingExpense.amount)
    } : exp));
    setEditingExpense(null);
  };

  // 🔍 ফিল্টারিং
  const filterByDateOrMonth = (itemDate) => {
    return filterMode === 'daily' ? itemDate === selectedDate : itemDate.startsWith(selectedMonth);
  };

  const filteredSales = sales.filter(item => {
    const matchTime = filterByDateOrMonth(item.date);
    const matchStaff = currentUser?.role === 'ADMIN' ? (selectedStaff === 'all' || item.staffId === selectedStaff) : item.staffId === currentUser?.id;
    return matchTime && matchStaff;
  });

  const filteredExpenses = expenses.filter(item => {
    const matchTime = filterByDateOrMonth(item.date);
    const matchStaff = currentUser?.role === 'ADMIN' ? (selectedStaff === 'all' || item.staffId === selectedStaff) : item.staffId === currentUser?.id;
    return matchTime && matchStaff;
  });

  // 🚌 বাসভিত্তিক সামারি
  const busWiseSummary = filteredSales.reduce((acc, curr) => {
    if (!acc[curr.transport]) {
      acc[curr.transport] = { transport: curr.transport, tickets: 0, total: 0 };
    }
    acc[curr.transport].tickets += curr.tickets;
    acc[curr.transport].total += curr.total;
    return acc;
  }, {});
  const busSummaryList = Object.values(busWiseSummary);

  const totalCommission = filteredSales.reduce((acc, curr) => acc + curr.total, 0);
  const totalExpense = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // 📄 ১০০% নির্ভুল বাংলা PDF প্রিন্ট ডায়ালগ
  const downloadPDF = () => {
    const staffText = selectedStaff === 'all' ? 'সকল স্টাফ (সবাই)' : (STAFF_DATA[selectedStaff]?.name || selectedStaff);
    const periodText = filterMode === 'daily' ? `তারিখ: ${selectedDate}` : `মাস: ${selectedMonth}`;

    const printWindow = window.open('', '', 'width=900,height=700');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AJ Enterprise Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Kalpurush&display=swap');
          body { font-family: 'Kalpurush', Arial, sans-serif; padding: 20px; color: #1e293b; }
          .header { background: #1e293b; color: #fff; padding: 15px; border-radius: 6px; margin-bottom: 20px; }
          .header h2 { margin: 0; font-size: 22px; }
          .header p { margin: 5px 0 0; font-size: 13px; color: #cbd5e1; }
          .cards { display: flex; gap: 10px; margin-bottom: 20px; }
          .card { flex: 1; padding: 12px; border-radius: 6px; border: 1px solid #ddd; }
          .card-title { font-size: 12px; color: #64748b; }
          .card-value { font-size: 18px; font-weight: bold; margin-top: 4px; }
          .green { background: #f0fdf4; border-color: #22c55e; color: #15803d; }
          .red { background: #fef2f2; border-color: #ef4444; color: #b91c1c; }
          .blue { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
          h3 { font-size: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; margin-top: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          th { background: #f8fafc; font-weight: bold; }
          .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px dashed #ccc; padding-top: 10px; }
          @media print {
            body { padding: 0; }
            .header { background: #1e293b !important; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>🚌 এজে এন্টারপ্রাইজ টিকেট সার্ভিস</h2>
          <p>হিসাবের সময়কাল: <b>${periodText}</b> | ম্যানেজার: <b>${currentUser.role === 'ADMIN' ? staffText : currentUser.name}</b></p>
        </div>

        <div class="cards">
          <div class="card green"><div class="card-title">মোট কমিশন</div><div class="card-value">৳ ${totalCommission}</div></div>
          <div class="card red"><div class="card-title">অফিস খরচ</div><div class="card-value">৳ ${totalExpense}</div></div>
          <div class="card blue"><div class="card-title">নিট জমা ক্যাশ</div><div class="card-value">৳ ${totalCommission - totalExpense}</div></div>
        </div>

        <h3>১. বাসভিত্তিক মোট বিক্রি ও কমিশন</h3>
        <table>
          <thead>
            <tr>
              <th>পরিবহন / বাসের নাম</th>
              <th>মোট বিক্রিত টিকেট</th>
              <th>মোট কমিশন ইনকাম</th>
            </tr>
          </thead>
          <tbody>
            ${busSummaryList.length === 0 ? '<tr><td colspan="3" style="text-align:center;">কোনো বিক্রি নেই</td></tr>' : 
              busSummaryList.map(b => `<tr><td><b>${b.transport}</b></td><td>${b.tickets} টি</td><td><b>৳ ${b.total}</b></td></tr>`).join('')}
          </tbody>
        </table>

        <h3>২. অফিস খরচের বিবরণ</h3>
        <table>
          <thead>
            <tr>
              <th>তারিখ</th>
              <th>খাত ও বিবরণ (স্টাফ)</th>
              <th>টাকার পরিমাণ</th>
            </tr>
          </thead>
          <tbody>
            ${filteredExpenses.length === 0 ? '<tr><td colspan="3" style="text-align:center;">কোনো খরচ নেই</td></tr>' : 
              filteredExpenses.map(e => `<tr><td>${e.date}</td><td><b>[${e.category}]</b> ${e.description} (${e.staffName})</td><td><b>৳ ${e.amount}</b></td></tr>`).join('')}
          </tbody>
        </table>

        <div class="footer">
          তৈরির তারিখ: ${new Date().toLocaleDateString()} | এজে এন্টারপ্রাইজ অ্যাকাউন্ট সিস্টেম
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // ১. লগইন পেজ
  if (!currentUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a', fontFamily: 'Arial' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', width: '320px' }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>🚌 AJ Enterprise</h2>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>আইডি (যেমন: admin, misuk, asif)</label>
            <input type="text" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} required />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>পাসওয়ার্ড</label>
            <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="1234" required />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>লগইন করুন</button>
        </form>
      </div>
    );
  }

  // ২. মূল অ্যাপ
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* হেডার */}
        <header style={{ backgroundColor: '#1e293b', color: '#fff', padding: '15px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ margin: 0 }}>🚌 AJ Enterprise Ticketing</h2>
            <p style={{ margin: '3px 0 0', color: '#94a3b8', fontSize: '13px' }}>
              লগইন: <b>{currentUser.name}</b> ({currentUser.role === 'ADMIN' ? '👑 মালিক' : 'স্টাফ/ম্যানেজার'})
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: '#334155', padding: '8px', borderRadius: '6px' }}>
            {currentUser.role === 'ADMIN' && (
              <select value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)} style={{ padding: '6px', borderRadius: '4px', fontWeight: 'bold', backgroundColor: '#fbbf24', border: 'none', color: '#000' }}>
                <option value="all">🌐 সকল স্টাফ (সামারি)</option>
                {Object.keys(STAFF_DATA).filter(k => k !== 'admin').map(staffKey => (
                  <option key={staffKey} value={staffKey}>👤 ম্যানেজার: {STAFF_DATA[staffKey].name}</option>
                ))}
              </select>
            )}

            <select value={filterMode} onChange={e => setFilterMode(e.target.value)} style={{ padding: '6px', borderRadius: '4px', fontWeight: 'bold' }}>
              <option value="monthly">🗓️ মাসিক হিসাব</option>
              <option value="daily">📅 দৈনিক হিসাব</option>
            </select>

            {filterMode === 'daily' ? (
              <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ padding: '6px', borderRadius: '4px' }} />
            ) : (
              <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ padding: '6px', borderRadius: '4px' }} />
            )}

            <button onClick={() => setCurrentUser(null)} style={{ padding: '6px 10px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>লগআউট</button>
          </div>
        </header>

        {/* সামারি কার্ড */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', margin: '20px 0' }}>
          <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <span style={{ color: '#64748b', fontSize: '13px' }}>
              {selectedStaff === 'all' ? 'মোট কমিশন ইনকাম' : `${STAFF_DATA[selectedStaff]?.name}-এর কমিশন`}
            </span>
            <h2 style={{ margin: '5px 0 0', color: '#16a34a' }}>৳ {totalCommission}</h2>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <span style={{ color: '#64748b', fontSize: '13px' }}>অফিস খরচ</span>
            <h2 style={{ margin: '5px 0 0', color: '#dc2626' }}>৳ {totalExpense}</h2>
          </div>
          <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <span style={{ color: '#64748b', fontSize: '13px' }}>জমা ক্যাশ (Net Deposit)</span>
            <h2 style={{ margin: '5px 0 0', color: '#2563eb' }}>৳ {totalCommission - totalExpense}</h2>
          </div>
        </div>

        {/* প্রধান কনটেন্ট */}
        <div style={{ display: 'grid', gridTemplateColumns: currentUser.role === 'ADMIN' ? '1fr 1fr' : '1fr 2fr', gap: '20px' }}>
          
          {/* স্টাফ এন্ট্রি ফর্ম */}
          {currentUser.role === 'STAFF' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* টিকিট এন্ট্রি */}
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0, fontSize: '15px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>📝 টিকিট বিক্রির এন্ট্রি</h3>
                <form onSubmit={handleAddSale} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                  <select value={selectedBus} onChange={e => setSelectedBus(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }} required>
                    <option value="">-- বাস সিলেক্ট করুন --</option>
                    {currentUser.buses.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  <input type="number" placeholder="টিকিট সংখ্যা" value={tickets} onChange={e => setTickets(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                  <input type="number" placeholder="কমিশন রেট (প্রতি টিকিট)" value={rate} onChange={e => setRate(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                  <button type="submit" style={{ padding: '10px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>সেভ করুন</button>
                </form>
              </div>

              {/* অফিস খরচ এন্ট্রি (খাত সিলেক্টসহ) */}
              {currentUser.canExpense && (
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
                  <h3 style={{ marginTop: 0, fontSize: '15px', borderBottom: '1px solid #ddd', paddingBottom: '8px', color: '#dc2626' }}>💸 অফিস খরচ এন্ট্রি</h3>
                  <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                    
                    {/* খরচের খাত সিলেক্টর */}
                    <select value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required>
                      <option value="">-- খরচের খাত সিলেক্ট করুন --</option>
                      {EXPENSE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>

                    {/* খরচের বিবরণ */}
                    <input type="text" placeholder="খরচের বিবরণ (যেমন: ৫টি চা ও খাতা)" value={expenseDesc} onChange={e => setExpenseDesc(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                    
                    {/* টাকার পরিমাণ */}
                    <input type="number" placeholder="টাকার পরিমাণ" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
                    
                    <button type="submit" style={{ padding: '10px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>খরচ সেভ করুন</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* 🚌 বাসভিত্তিক মোট হিসাব টেবিল & অফিস খরচ */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>
                🚌 {selectedStaff === 'all' ? 'সকল বাসের মোট হিসাব' : `${STAFF_DATA[selectedStaff]?.name}-এর বাসভিত্তিক হিসাব`}
              </h3>
              <button 
                onClick={downloadPDF} 
                style={{ padding: '8px 14px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                📄 বাংলা PDF ডাউনলোড
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>পরিবহন (বাস)</th>
                  <th style={{ padding: '8px' }}>মোট টিকিট</th>
                  <th style={{ padding: '8px' }}>মোট কমিশন</th>
                </tr>
              </thead>
              <tbody>
                {busSummaryList.length === 0 ? (
                  <tr><td colSpan="3" style={{ padding: '15px', textAlign: 'center', color: '#94a3b8' }}>কোনো তথ্য পাওয়া যায়নি</td></tr>
                ) : (
                  busSummaryList.map(bus => (
                    <tr key={bus.transport} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{bus.transport}</td>
                      <td style={{ padding: '8px' }}>{bus.tickets} টি</td>
                      <td style={{ padding: '8px', color: '#16a34a', fontWeight: 'bold' }}>৳ {bus.total}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* 💸 খরচের বিস্তারিত টেবিল */}
            <h3 style={{ marginTop: '25px', fontSize: '15px', color: '#dc2626', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>💸 অফিস খরচের বিস্তারিত</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>তারিখ</th>
                  <th style={{ padding: '8px' }}>খাত ও বিবরণ</th>
                  <th style={{ padding: '8px' }}>টাকা</th>
                  {currentUser.role === 'ADMIN' && <th style={{ padding: '8px', textAlign: 'center' }}>অ্যাকশন</th>}
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr><td colSpan={currentUser.role === 'ADMIN' ? "4" : "3"} style={{ padding: '10px', textAlign: 'center', color: '#94a3b8' }}>কোনো খরচ নেই</td></tr>
                ) : (
                  filteredExpenses.map(exp => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px', color: '#64748b' }}>{exp.date}</td>
                      <td style={{ padding: '8px' }}>
                        <span style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', marginRight: '5px' }}>{exp.category}</span>
                        {exp.description} <small style={{ color: '#94a3b8' }}>({exp.staffName})</small>
                      </td>
                      <td style={{ padding: '8px', color: '#dc2626', fontWeight: 'bold' }}>৳ {exp.amount}</td>
                      {currentUser.role === 'ADMIN' && (
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <button onClick={() => setEditingExpense(exp)} style={{ marginRight: '4px', padding: '3px 6px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>✏️</button>
                          <button onClick={() => handleDeleteExpense(exp.id)} style={{ padding: '3px 6px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 📋 লেনদেনের বিস্তারিত খাতা (কমিশন বিক্রি) */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0, fontSize: '15px', marginBottom: '15px' }}>📋 টিকিট বিক্রি ও কমিশনের খাতা</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>তারিখ</th>
                  <th style={{ padding: '8px' }}>বাস</th>
                  <th style={{ padding: '8px' }}>টিকিট</th>
                  <th style={{ padding: '8px' }}>কমিশন</th>
                  {currentUser.role === 'ADMIN' && <th style={{ padding: '8px', textAlign: 'center' }}>অ্যাকশন</th>}
                </tr>
              </thead>
              <tbody>
                {filteredSales.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '15px', textAlign: 'center', color: '#94a3b8' }}>কোনো এন্ট্রি নেই</td></tr>
                ) : (
                  filteredSales.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px', color: '#64748b' }}>{item.date}</td>
                      <td style={{ padding: '8px' }}>{item.transport} <small style={{ color: '#94a3b8' }}>({item.staffName})</small></td>
                      <td style={{ padding: '8px' }}>{item.tickets} টি</td>
                      <td style={{ padding: '8px', color: '#16a34a', fontWeight: 'bold' }}>৳ {item.total}</td>
                      {currentUser.role === 'ADMIN' && (
                        <td style={{ padding: '8px', textAlign: 'center' }}>
                          <button onClick={() => setEditingSale(item)} style={{ marginRight: '4px', padding: '3px 6px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>✏️</button>
                          <button onClick={() => handleDeleteSale(item.id)} style={{ padding: '3px 6px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* ✏️ ১. বিক্রি কমিশন এডিট পপআপ */}
        {editingSale && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <form onSubmit={handleSaveSaleEdit} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '320px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>✏️ এডিট: {editingSale.transport}</h3>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '12px' }}>টিকিট সংখ্যা:</label>
                <input type="number" value={editingSale.tickets} onChange={e => setEditingSale({ ...editingSale, tickets: e.target.value })} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '12px' }}>কমিশন রেট:</label>
                <input type="number" value={editingSale.rate} onChange={e => setEditingSale({ ...editingSale, rate: e.target.value })} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditingSale(null)} style={{ padding: '6px 12px', backgroundColor: '#94a3b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>বাতিল</button>
                <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>আপডেট</button>
              </div>
            </form>
          </div>
        )}

        {/* ✏️ ২. অফিস খরচ এডিট পপআপ */}
        {editingExpense && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <form onSubmit={handleSaveExpenseEdit} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '320px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px', color: '#dc2626' }}>✏️ অফিস খরচ এডিট</h3>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '12px' }}>খরচের খাত:</label>
                <select value={editingExpense.category} onChange={e => setEditingExpense({ ...editingExpense, category: e.target.value })} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '12px' }}>খরচের বিবরণ:</label>
                <input type="text" value={editingExpense.description} onChange={e => setEditingExpense({ ...editingExpense, description: e.target.value })} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '12px' }}>টাকার পরিমাণ:</label>
                <input type="number" value={editingExpense.amount} onChange={e => setEditingExpense({ ...editingExpense, amount: e.target.value })} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditingExpense(null)} style={{ padding: '6px 12px', backgroundColor: '#94a3b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>বাতিল</button>
                <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>আপডেট</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}