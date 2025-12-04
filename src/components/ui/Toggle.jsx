export function Toggle({ label, checked, onChange }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0', width: '100%' }}>
            <span style={{ fontWeight: '800', color: '#374151', fontSize: '0.8rem' }}>{label}</span>
            <div
                onClick={() => onChange(!checked)}
                style={{
                    width: '50px',
                    height: '28px',
                    backgroundColor: checked ? '#84CC16' : '#E5E7EB',
                    borderRadius: '999px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
            >
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: checked ? '24px' : '2px',
                        transition: 'left 0.2s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                />
            </div>
        </div>
    );
}
