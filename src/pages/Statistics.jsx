import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export function Statistics() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [wheel, setWheel] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('my-wheels');
        if (saved) {
            const wheels = JSON.parse(saved);
            const found = wheels.find(w => w.id === id);
            if (found) setWheel(found);
        }
    }, [id]);

    const resetStats = () => {
        if (!wheel) return;

        const saved = localStorage.getItem('my-wheels');
        if (saved) {
            const wheels = JSON.parse(saved);
            const updated = wheels.map(w => {
                if (w.id === id) {
                    return {
                        ...w,
                        stats: { totalSpins: 0, segmentCounts: {} }
                    };
                }
                return w;
            });
            localStorage.setItem('my-wheels', JSON.stringify(updated));
            setWheel(updated.find(w => w.id === id));
        }
    };

    if (!wheel) return <div>Loading...</div>;

    const stats = wheel.stats || { totalSpins: 0, segmentCounts: {} };

    return (
        <div className="container" style={{ padding: '1rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}>
                <button
                    onClick={() => navigate(`/spin/${id}`)}
                    className="btn-cartoon btn-yellow"
                    style={{ width: 48, height: 48, padding: 0, borderRadius: '50%', position: 'absolute', left: 0 }}
                >
                    <ArrowLeft size={28} strokeWidth={4} />
                </button>
                <h1 className="header-title" style={{ width: '100%', margin: 0, fontSize: '2rem' }}>Statistics</h1>
            </div>

            {/* General Card */}
            <div className="card" style={{ background: 'white', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#374151', marginBottom: '0.5rem', borderBottom: '2px solid #E5E7EB', paddingBottom: '0.5rem' }}>
                    General
                </h2>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#374151' }}>
                    Total spins: {stats.totalSpins}
                </div>
            </div>

            {/* Results Card */}
            <div className="card" style={{ background: 'white', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '2px solid #E5E7EB', paddingBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#374151' }}>Results</h2>
                    <span style={{ fontSize: '1rem', fontWeight: '900', color: '#10B981' }}>Spins</span>
                </div>

                <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {wheel.segments.map((segment) => (
                        <div key={segment.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{
                                background: '#F3F4F6',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                flex: 1,
                                marginRight: '1rem',
                                fontWeight: '800',
                                color: '#374151'
                            }}>
                                {segment.label}
                            </div>
                            <div style={{
                                fontWeight: '900',
                                color: '#10B981',
                                fontSize: '1.2rem',
                                width: '30px',
                                textAlign: 'right'
                            }}>
                                {stats.segmentCounts[segment.id] || 0}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset Button */}
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <button
                    onClick={resetStats}
                    className="btn-cartoon"
                    style={{
                        width: '100%',
                        background: '#EC4899',
                        border: '3px solid white',
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <RotateCcw size={24} strokeWidth={3} />
                    Reset statistics
                </button>
            </div>
        </div>
    );
}
