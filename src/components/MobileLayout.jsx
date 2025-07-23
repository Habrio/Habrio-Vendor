// src/components/MobileLayout.jsx
export default function MobileLayout({ children }) {
  return (
    <div className="mobile-screen fade-in">
      <div className="screen-container">
        {children}
      </div>
    </div>
  );
}