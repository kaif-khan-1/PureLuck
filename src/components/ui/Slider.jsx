export function Slider({ label, value, min, max, onChange, color = '#84CC16' }) {
    return (
        <div style={{ marginBottom: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.1rem' }}>
                <span style={{ fontWeight: '800', color: '#374151', fontSize: '0.8rem' }}>{label}</span>
                <span style={{ fontWeight: '900', color: color, fontSize: '0.9rem' }}>{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                style={{
                    width: '100%',
                    accentColor: color,
                    height: '8px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            />
        </div>
    );
}
