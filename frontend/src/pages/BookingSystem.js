import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { 
  FaCar, FaLeaf, FaSearch, FaStar, FaCalendarAlt, 
  FaCheckCircle, FaBolt, FaFilter, FaClock, FaDollarSign 
} from "react-icons/fa";

export default function BookingSystem() {
  // --- STATE ---
  const [step, setStep] = useState(1); // 1=Search, 2=Slot Selection, 3=Summary
  const [filters, setFilters] = useState({ type: "All", seats: "Any", isEV: false, location: "Visakhapatnam" });
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // --- 1. MOCK AI & DATA ENGINE ---
  useEffect(() => {
    // A. Simulate User History (The "AI" Input)
    // In a real app, this comes from the backend user profile
    const userHistory = {
      avgSpend: "Medium", // Low, Medium, High
      preferredType: "SUV",
      ecoConscious: true, // User prefers EVs
      frequentRoutes: ["Airport", "Tech Park"]
    };

    // B. Mock Vehicle Inventory
    const inventory = [
      { id: 1, name: "Tesla Model 3", type: "Sedan", seats: 5, isEV: true, basePrice: 40, rating: 4.9, image: "https://img.icons8.com/color/96/tesla-model-3.png" },
      { id: 2, name: "Toyota RAV4", type: "SUV", seats: 5, isEV: false, basePrice: 35, rating: 4.7, image: "https://img.icons8.com/color/96/toyota.png" },
      { id: 3, name: "Ford Mustang Mach-E", type: "SUV", seats: 5, isEV: true, basePrice: 55, rating: 4.8, image: "https://img.icons8.com/color/96/f1-race-car.png" },
      { id: 4, name: "Honda Civic", type: "Sedan", seats: 5, isEV: false, basePrice: 25, rating: 4.5, image: "https://img.icons8.com/color/96/honda.png" },
      { id: 5, name: "Mercedes Sprinter", type: "Van", seats: 9, isEV: false, basePrice: 80, rating: 4.6, image: "https://img.icons8.com/color/96/shuttle-bus.png" },
    ];

    // C. Recommendation Algorithm (Frontend Simulation)
    const processedVehicles = inventory.map(v => {
      let aiScore = 0;
      let reasons = [];

      // Logic: Match user preferences
      if (v.type === userHistory.preferredType) { aiScore += 30; reasons.push("Matches your SUV preference"); }
      if (v.isEV && userHistory.ecoConscious) { aiScore += 40; reasons.push("Eco-friendly choice"); }
      if (v.rating >= 4.8) { aiScore += 10; reasons.push("Top rated by community"); }
      
      return { 
        ...v, 
        aiScore, 
        isRecommended: aiScore > 30, // Threshold for "AI Badge"
        aiReason: reasons[0] 
      };
    });

    // Sort by Score (Best matches first)
    setVehicles(processedVehicles.sort((a, b) => b.aiScore - a.aiScore));
  }, []);

  // --- 2. SLOT GENERATION LOGIC ---
  // Generates time slots with dynamic pricing based on "Peak Hours"
  const generateSlots = () => {
    const slots = [];
    const base = selectedVehicle ? selectedVehicle.basePrice : 0;
    
    for (let hour = 8; hour <= 20; hour++) {
      const isPeak = (hour >= 9 && hour <= 11) || (hour >= 17 && hour <= 19);
      const priceModifier = isPeak ? 1.2 : 1.0; // 20% surge pricing
      const finalPrice = Math.round(base * priceModifier);
      
      slots.push({
        time: `${hour}:00`,
        label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        price: finalPrice,
        isPeak,
        available: Math.random() > 0.3 // Simulate random availability
      });
    }
    return slots;
  };

  const slots = generateSlots();

  // --- HANDLERS ---
  const handleSelectVehicle = (v) => {
    setSelectedVehicle(v);
    setStep(2); // Go to Calendar Step
  };

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setStep(3); // Go to Summary Step
  };

  const confirmBooking = () => {
    alert(`Booking Confirmed!\nVehicle: ${selectedVehicle.name}\nDate: ${selectedDate}\nTime: ${selectedSlot.label}`);
    setStep(1); // Reset
    setSelectedVehicle(null);
    setSelectedSlot(null);
  };

  // Filter Logic
  const filteredList = vehicles.filter(v => 
    (filters.type === "All" || v.type === filters.type) &&
    (filters.seats === "Any" || v.seats >= parseInt(filters.seats)) &&
    (!filters.isEV || v.isEV)
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      
      <div style={{ flex: 1, padding: "30px", overflowY: "auto" }}>
        
        {/* PROGRESS HEADER */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ color: "#1e293b", marginBottom: "5px" }}>Book a Ride 📅</h2>
          <div style={{ display: "flex", gap: "10px", fontSize: "14px", color: "#64748b" }}>
            <span style={{ color: step >= 1 ? "#3b82f6" : "#cbd5e1", fontWeight: step >= 1 ? "bold" : "normal" }}>1. Select Vehicle</span> 
            <span>&gt;</span>
            <span style={{ color: step >= 2 ? "#3b82f6" : "#cbd5e1", fontWeight: step >= 2 ? "bold" : "normal" }}>2. Choose Slot</span>
            <span>&gt;</span>
            <span style={{ color: step >= 3 ? "#3b82f6" : "#cbd5e1", fontWeight: step >= 3 ? "bold" : "normal" }}>3. Confirm</span>
          </div>
        </div>

        {/* ================= STEP 1: VEHICLE SELECTION ================= */}
        {step === 1 && (
          <>
            {/* FILTERS */}
            <div style={filterBarStyle}>
              <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
                <FaFilter color="#64748b" />
                
                {/* Location Filter */}
                <select style={selectStyle} value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})}>
                  <option>Visakhapatnam</option>
                  <option>Vijayawada</option>
                  <option>Hyderabad</option>
                </select>

                <select style={selectStyle} value={filters.type} onChange={e => setFilters({...filters, type: e.target.value})}>
                  <option value="All">All Types</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                </select>

                <select style={selectStyle} value={filters.seats} onChange={e => setFilters({...filters, seats: e.target.value})}>
                  <option value="Any">Any Seats</option>
                  <option value="4">4+ Seats</option>
                  <option value="7">7+ Seats</option>
                </select>

                <label style={checkboxStyle(filters.isEV)}>
                  <input type="checkbox" checked={filters.isEV} onChange={e => setFilters({...filters, isEV: e.target.checked})} style={{ marginRight: "8px" }} />
                  <FaLeaf /> Eco-Friendly
                </label>
              </div>
            </div>

            {/* VEHICLE CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" }}>
              {filteredList.map(v => (
                <div key={v.id} style={{ ...cardStyle, border: v.isRecommended ? "2px solid #3b82f6" : "1px solid #e2e8f0" }}>
                  
                  {/* AI RECOMMENDATION BADGE */}
                  {v.isRecommended && (
                    <div style={aiBadgeStyle}>
                      <FaStar size={12} color="#fff" /> AI Pick: {v.aiReason}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                    <img src={v.image} alt={v.name} style={{ width: "80px", height: "80px", objectFit: "contain" }} />
                    <div style={{ textAlign: "right" }}>
                      <h3 style={{ margin: "0 0 5px 0", color: "#1e293b" }}>{v.name}</h3>
                      <div style={{ color: "#f59e0b", fontSize: "14px", fontWeight: "600" }}>★ {v.rating}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <Badge>{v.type}</Badge>
                    <Badge>{v.seats} Seats</Badge>
                    {v.isEV && <Badge color="green"><FaBolt size={10} /> Electric</Badge>}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "15px" }}>
                    <div>
                      <span style={{ fontSize: "22px", fontWeight: "700", color: "#1e293b" }}>${v.basePrice}</span>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>/hr (start)</span>
                    </div>
                    <button onClick={() => handleSelectVehicle(v)} style={primaryBtnStyle}>Select</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= STEP 2: SLOT & DATE SELECTION ================= */}
        {step === 2 && selectedVehicle && (
          <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
            
            {/* LEFT: Calendar Control */}
            <div style={{ ...cardStyle, flex: 1, minWidth: "300px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <h3 style={{ margin: 0 }}>Select Date</h3>
                <button onClick={() => setStep(1)} style={textBtnStyle}>Change Vehicle</button>
              </div>
              
              <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                style={dateInputStyle}
                min={new Date().toISOString().split('T')[0]}
              />

              <div style={{ marginTop: "20px", padding: "15px", background: "#eff6ff", borderRadius: "8px", border: "1px solid #dbeafe" }}>
                 <h4 style={{ margin: "0 0 10px 0", color: "#1e40af" }}>Booking: {selectedVehicle.name}</h4>
                 <p style={{ margin: 0, fontSize: "14px", color: "#3b82f6" }}>
                   Prices vary based on peak hours. Select a green slot to proceed.
                 </p>
              </div>
            </div>

            {/* RIGHT: Slot Grid */}
            <div style={{ ...cardStyle, flex: 2 }}>
              <h3>Available Slots for {selectedDate}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "15px", marginTop: "20px" }}>
                {slots.map((slot, i) => (
                  <button 
                    key={i} 
                    disabled={!slot.available}
                    onClick={() => handleBookSlot(slot)}
                    style={slotBtnStyle(slot.available, slot.isPeak)}
                  >
                    <div style={{ fontSize: "16px", fontWeight: "600" }}>{slot.label}</div>
                    <div style={{ fontSize: "14px", opacity: 0.9 }}>${slot.price}</div>
                    {slot.isPeak && <div style={{ fontSize: "10px", color: "#fecaca", marginTop: "4px" }}>🔥 Peak Hour</div>}
                    {!slot.available && <div style={{ fontSize: "10px", marginTop: "4px" }}>Unavailable</div>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: SUMMARY & CONFIRM ================= */}
        {step === 3 && selectedVehicle && selectedSlot && (
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <div style={cardStyle}>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <FaCheckCircle size={50} color="#10b981" />
                <h2 style={{ color: "#1e293b", margin: "10px 0" }}>Review Booking</h2>
              </div>

              <div style={summaryRow}>
                <span>Vehicle</span>
                <strong>{selectedVehicle.name}</strong>
              </div>
              <div style={summaryRow}>
                <span>Date</span>
                <strong>{selectedDate}</strong>
              </div>
              <div style={summaryRow}>
                <span>Time Slot</span>
                <strong>{selectedSlot.label}</strong>
              </div>
              <div style={summaryRow}>
                <span>Hourly Rate</span>
                <strong>${selectedSlot.price}</strong>
              </div>
              <div style={summaryRow}>
                <span>Service Fee</span>
                <strong>$5.00</strong>
              </div>
              
              <div style={{ borderTop: "2px dashed #e2e8f0", margin: "20px 0", paddingTop: "15px", display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold" }}>
                <span>Total</span>
                <span>${selectedSlot.price + 5}.00</span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setStep(2)} style={secondaryBtnStyle}>Back</button>
                <button onClick={confirmBooking} style={{ ...primaryBtnStyle, flex: 1, justifyContent: "center" }}>Confirm & Pay</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// --- STYLES & COMPONENTS ---

const Badge = ({ children, color }) => (
  <span style={{ 
    background: color === "green" ? "#d1fae5" : "#f1f5f9", 
    color: color === "green" ? "#065f46" : "#475569", 
    padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
    display: "flex", alignItems: "center", gap: "5px"
  }}>
    {children}
  </span>
);

const filterBarStyle = {
  background: "white", padding: "20px", borderRadius: "12px", marginBottom: "30px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const cardStyle = {
  background: "white", padding: "25px", borderRadius: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)", position: "relative", transition: "0.2s"
};

const aiBadgeStyle = {
  position: "absolute", top: "-12px", right: "20px",
  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
  color: "white", padding: "6px 12px", borderRadius: "20px",
  fontSize: "12px", fontWeight: "700", boxShadow: "0 4px 10px rgba(37, 99, 235, 0.3)",
  display: "flex", alignItems: "center", gap: "5px"
};

const selectStyle = {
  padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", color: "#475569"
};

const checkboxStyle = (checked) => ({
  display: "flex", alignItems: "center", cursor: "pointer",
  color: checked ? "#059669" : "#64748b", fontWeight: checked ? "600" : "500"
});

const primaryBtnStyle = {
  background: "#1e293b", color: "white", padding: "12px 20px", borderRadius: "8px",
  border: "none", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
};

const secondaryBtnStyle = {
  background: "white", color: "#475569", border: "1px solid #cbd5e1",
  padding: "12px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer"
};

const textBtnStyle = {
  background: "none", border: "none", color: "#3b82f6", fontWeight: "600", cursor: "pointer"
};

const dateInputStyle = {
  width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1",
  fontSize: "16px", fontFamily: "inherit", boxSizing: "border-box"
};

const slotBtnStyle = (available, isPeak) => ({
  padding: "15px", borderRadius: "10px", border: "none", cursor: available ? "pointer" : "not-allowed",
  background: !available ? "#f1f5f9" : isPeak ? "#ef4444" : "#10b981",
  color: !available ? "#94a3b8" : "white",
  opacity: !available ? 0.6 : 1, transition: "0.2s", textAlign: "center",
  boxShadow: available ? "0 2px 5px rgba(0,0,0,0.1)" : "none"
});

const summaryRow = {
  display: "flex", justifyContent: "space-between", marginBottom: "12px", color: "#475569", fontSize: "15px"
};