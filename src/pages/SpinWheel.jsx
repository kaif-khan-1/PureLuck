import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, Edit2, Palette, RotateCcw } from 'lucide-react';
import { Wheel } from '../components/Wheel';

export function SpinWheel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [wheel, setWheel] = useState(null);
    const [winner, setWinner] = useState(null);
    const [disabledSegments, setDisabledSegments] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('my-wheels');
        if (saved) {
            try {
                const wheels = JSON.parse(saved);
                const found = wheels.find(w => w.id === id);
                if (found) setWheel(found);
            } catch (e) {
                console.error('Error parsing wheels', e);
            }
        }
    }, [id]);

    if (!wheel) return <div>Loading...</div>;

    const activeSegments = wheel.segments.filter(s => !disabledSegments.includes(s.id));

    const handleSpinFinish = (winner) => {
        setWinner(winner);

        // Update stats
        const saved = localStorage.getItem('my-wheels');
        if (saved) {
            const wheels = JSON.parse(saved);
            const updated = wheels.map(w => {
                if (w.id === id) {
                    const currentStats = w.stats || { totalSpins: 0, segmentCounts: {} };
                    return {
                        ...w,
                        stats: {
                            totalSpins: currentStats.totalSpins + 1,
                            segmentCounts: {
                                ...currentStats.segmentCounts,
                                [winner.id]: (currentStats.segmentCounts[winner.id] || 0) + 1
                            }
                        }
                    };
                }
                return w;
            });
            localStorage.setItem('my-wheels', JSON.stringify(updated));
            // Update local state to reflect changes if needed, though we mainly need it for the next spin
            setWheel(updated.find(w => w.id === id));
        }

        if (wheel.settings.autoDisable) {
            setTimeout(() => {
                setDisabledSegments(prev => [...prev, winner.id]);
                setWinner(null);
            }, 2000);
        }
    };

    return (
        <div className="container" style={{ padding: '1rem', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', zIndex: 10 }}>
                <button
                    onClick={() => navigate('/')}
                    className="btn-cartoon btn-yellow"
                    style={{ width: 48, height: 48, padding: 0, borderRadius: '50%' }}
                >
                    <ArrowLeft size={28} strokeWidth={4} />
                </button>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setDisabledSegments([])} // Reset button
                        className="btn-cartoon"
                        style={{ width: 48, height: 48, padding: 0, borderRadius: '50%', background: '#C084FC', border: '2px solid white' }}
                        title="Reset Wheel"
                    >
                        <RotateCcw size={24} color="white" strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => navigate(`/stats/${wheel.id}`)}
                        className="btn-cartoon"
                        style={{ width: 48, height: 48, padding: 0, borderRadius: '50%', background: '#3B82F6', border: '2px solid white' }}
                        title="Statistics"
                    >
                        <BarChart2 size={24} color="white" strokeWidth={3} />
                    </button>
                    <button
                        onClick={() => navigate(`/edit/${wheel.id}`)}
                        className="btn-cartoon"
                        style={{ width: 48, height: 48, padding: 0, borderRadius: '50%', background: '#F97316', border: '2px solid white' }}
                    >
                        <Edit2 size={24} color="white" strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: '6rem' }}>
                <h1 style={{
                    fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                    fontWeight: '900',
                    color: 'white',
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    marginBottom: '0.5rem',
                    textAlign: 'center'
                }}>
                    {wheel.name}
                </h1>

                <div style={{
                    fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                    fontWeight: '800',
                    color: 'rgba(255,255,255,0.8)',
                    marginBottom: '1rem',
                    height: '2rem',
                    textAlign: 'center'
                }}>
                    {winner ? winner.label : 'Spin to decide!'}
                </div>

                <div style={{ transform: 'scale(0.9)', maxWidth: '350px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {activeSegments.length > 0 ? (
                        <Wheel
                            segments={activeSegments}
                            repeat={wheel.settings.repeat}
                            spinDuration={wheel.settings.duration}
                            fontSize={wheel.settings.fontSize}
                            onFinished={handleSpinFinish}
                        />
                    ) : (
                        <div style={{
                            width: 300, height: 300,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: 'rgba(255,255,255,0.2)', borderRadius: '50%',
                            color: 'white', fontWeight: '900', fontSize: '1.5rem'
                        }}>
                            All Done!
                        </div>
                    )}
                </div>
            </div>

            {/* Footer / Themes */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
                <button
                    className="btn-cartoon"
                    style={{
                        width: 56, height: 56, padding: 0, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                        border: '3px solid white',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Palette size={24} color="white" strokeWidth={3} />
                </button>
                <div style={{ textAlign: 'center', color: 'white', fontWeight: '800', marginTop: '0.25rem', textShadow: '0 1px 2px rgba(0,0,0,0.2)', fontSize: '0.8rem' }}>
                    Themes
                </div>
            </div>
        </div>
    );
}
