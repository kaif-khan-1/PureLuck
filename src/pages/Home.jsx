import { useNavigate } from 'react-router-dom';
import { Plus, Settings as SettingsIcon, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Home() {
    const navigate = useNavigate();
    const [wheels, setWheels] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('my-wheels');
        if (saved) {
            try {
                setWheels(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse wheels', e);
                setWheels([]);
            }
        } else {
            // Default wheel if none exist
            const defaultWheel = {
                id: 'default',
                name: 'Custom',
                segments: [
                    { id: '1', label: 'Yes', color: '#4ADE80' },
                    { id: '2', label: 'No', color: '#F87171' }
                ],
                settings: { repeat: 3, duration: 3, fontSize: 4 }
            };
            setWheels([defaultWheel]);
            localStorage.setItem('my-wheels', JSON.stringify([defaultWheel]));
        }
    }, []);

    const createNewWheel = () => {
        navigate('/templates');
    };

    const filteredWheels = wheels.filter(wheel =>
        wheel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
                    <SettingsIcon color="white" size={32} />
                </div>
                <h1 className="header-title" style={{ margin: 0 }}>My wheels</h1>
                <div style={{ width: 32 }}></div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    className="btn-cartoon btn-green"
                    style={{ flex: 1, fontSize: '1.1rem' }}
                    onClick={createNewWheel}
                >
                    <Plus size={24} style={{ marginRight: '0.5rem' }} strokeWidth={4} />
                    Add Wheel
                </button>
                <button
                    className="btn-cartoon btn-red"
                    style={{ flex: 1, fontSize: '1.1rem' }}
                >
                    <XCircle size={24} style={{ marginRight: '0.5rem' }} strokeWidth={4} />
                    No ADS
                </button>
            </div>

            <input
                className="input-cartoon"
                style={{ marginBottom: '1rem', background: 'white' }}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="scrollable-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredWheels.map(wheel => (
                        <div
                            key={wheel.id}
                            className="card"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                                transition: 'transform 0.1s',
                                border: 'none',
                                borderRadius: '1rem',
                                position: 'relative'
                            }}
                            onClick={() => navigate(`/spin/${wheel.id}`)}
                        >
                            {/* Edit Button (List Icon) */}
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/edit/${wheel.id}`);
                                }}
                                style={{ marginRight: '1rem', cursor: 'pointer' }}
                            >
                                <div style={{ width: 40, height: 40, background: '#E5E7EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#D1D5DB'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#E5E7EB'}
                                >
                                    <div style={{ width: 24, height: 4, background: '#374151', borderRadius: 2, boxShadow: '0 8px 0 #374151, 0 -8px 0 #374151' }}></div>
                                </div>
                            </div>

                            <span className="wheel-list-name" style={{ fontSize: '1.5rem', fontWeight: '900', color: '#374151', flex: 1 }}>
                                {wheel.name}
                            </span>

                            {/* Delete Button (Top Right) */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm('Are you sure you want to delete this wheel?')) {
                                        const updated = wheels.filter(w => w.id !== wheel.id);
                                        setWheels(updated);
                                        localStorage.setItem('my-wheels', JSON.stringify(updated));
                                    }
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '-10px',
                                    width: '28px',
                                    height: '28px',
                                    background: '#EF4444',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    zIndex: 10
                                }}
                            >
                                <div style={{ width: '12px', height: '3px', background: 'white', borderRadius: '2px' }}></div>
                            </button>

                            {/* Mini Wheel Preview */}
                            <div style={{ width: 60, height: 60, position: 'relative' }}>
                                <div style={{
                                    width: '100%', height: '100%', borderRadius: '50%',
                                    border: '4px solid #E5E7EB', background: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{ fontSize: '0.6rem', color: '#9CA3AF', fontWeight: '800' }}>PREVIEW</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
