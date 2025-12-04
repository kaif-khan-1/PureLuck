import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Plus, Trash2 } from 'lucide-react';
import { Wheel } from '../components/Wheel';
import { Slider } from '../components/ui/Slider';
import { Toggle } from '../components/ui/Toggle';

const PRESET_COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981',
    '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'
];

export function EditWheel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [wheel, setWheel] = useState(null);
    const [winner, setWinner] = useState(null);

    useEffect(() => {
        if (id === 'new') {
            setWheel({
                id: 'temp', // Will be overwritten on save
                name: 'New Wheel',
                segments: [
                    { id: '1', label: 'Option 1', color: '#4ADE80' },
                    { id: '2', label: 'Option 2', color: '#F87171' }
                ],
                settings: { repeat: 2, duration: 3, fontSize: 4 }
            });
            return;
        }

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

    const saveWheel = () => {
        const saved = localStorage.getItem('my-wheels');
        let wheels = saved ? JSON.parse(saved) : [];

        if (id === 'new') {
            const newWheel = { ...wheel, id: Date.now().toString() };
            wheels.push(newWheel);
        } else {
            wheels = wheels.map(w => w.id === id ? wheel : w);
        }

        localStorage.setItem('my-wheels', JSON.stringify(wheels));
        navigate('/');
    };

    const updateSetting = (key, value) => {
        setWheel({ ...wheel, settings: { ...wheel.settings, [key]: value } });
    };

    const addSegment = () => {
        const color = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
        setWheel({
            ...wheel,
            segments: [...wheel.segments, { id: Date.now().toString(), label: '', color }]
        });
    };

    const updateSegment = (segId, field, value) => {
        setWheel({
            ...wheel,
            segments: wheel.segments.map(s => s.id === segId ? { ...s, [field]: value } : s)
        });
    };

    const removeSegment = (segId) => {
        if (wheel.segments.length <= 1) return;
        setWheel({
            ...wheel,
            segments: wheel.segments.filter(s => s.id !== segId)
        });
    };

    if (!wheel) return <div>Loading...</div>;

    return (
        <div className="container" style={{ padding: '1rem', height: 'auto', minHeight: '100vh', maxWidth: '1000px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button
                    onClick={() => navigate('/')}
                    className="btn-cartoon btn-yellow"
                    style={{ width: 48, height: 48, padding: 0, borderRadius: '50%' }}
                >
                    <ArrowLeft size={28} strokeWidth={4} />
                </button>

                <h1 className="header-title" style={{ margin: 0 }}>Edit wheel</h1>

                <button
                    onClick={saveWheel}
                    className="btn-cartoon btn-green"
                    style={{ width: 48, height: 48, padding: 0, borderRadius: '50%' }}
                >
                    <Check size={28} strokeWidth={4} />
                </button>
            </div>

            <div>
                <input
                    className="input-cartoon"
                    value={wheel.name}
                    onChange={(e) => setWheel({ ...wheel, name: e.target.value })}
                    style={{
                        textAlign: 'center',
                        marginBottom: '1rem',
                        fontSize: '1.2rem',
                        background: 'rgba(255,255,255,0.5)',
                        border: 'none',
                        maxWidth: '600px',
                        margin: '0 auto 1rem auto',
                        display: 'block'
                    }}
                />

                {/* Main Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.25rem', // Tighter gap
                    marginBottom: '0.5rem',
                    alignItems: 'stretch' // Ensure both columns are same height
                }}>
                    {/* Preview Card */}
                    <div className="card" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        overflow: 'hidden',
                        background: 'white',
                        height: '100%' // Fill the grid cell
                    }}>
                        <div style={{ width: '100%', maxWidth: '160px', aspectRatio: '1/1' }}> {/* Constrain wheel width but let it scale */}
                            <Wheel
                                segments={wheel.segments}
                                repeat={wheel.settings.repeat}
                                spinDuration={wheel.settings.duration}
                                fontSize={wheel.settings.fontSize}
                                onFinished={(w) => setWinner(w)}
                                onSegmentClick={(segment) => navigate(`/color/${wheel.id}/${segment.id}`)}
                            />
                        </div>
                    </div>

                    {/* Settings Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', height: '100%' }}>
                        <div className="card" style={{ background: 'white', padding: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '50px' }}>
                            <Slider
                                label="Size"
                                value={wheel.settings.fontSize}
                                min={1} max={5}
                                onChange={(v) => updateSetting('fontSize', v)}
                                color="#3B82F6"
                            />
                        </div>
                        <div className="card" style={{ background: 'white', padding: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '50px' }}>
                            <Slider
                                label="Repeat"
                                value={wheel.settings.repeat}
                                min={1} max={5}
                                onChange={(v) => updateSetting('repeat', v)}
                                color="#84CC16"
                            />
                        </div>
                        <div className="card" style={{ background: 'white', padding: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '50px' }}>
                            <Slider
                                label="Time"
                                value={wheel.settings.duration}
                                min={1} max={10}
                                onChange={(v) => updateSetting('duration', v)}
                                color="#F97316"
                            />
                        </div>
                        <div className="card" style={{ background: 'white', padding: '0.25rem 0.5rem', flex: 1, display: 'flex', alignItems: 'center', minHeight: '40px' }}>
                            <Toggle
                                label="Disable"
                                checked={wheel.settings.autoDisable || false}
                                onChange={() => updateSetting('autoDisable', !wheel.settings.autoDisable)}
                            />
                        </div>
                    </div>
                </div>

                {/* Sections Card */}
                <div className="card" style={{ background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontWeight: '900', color: '#374151', fontSize: '1.2rem' }}>Sections</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: '800', color: '#6B7280' }}>ADD</span>
                            <button
                                onClick={addSegment}
                                className="btn-cartoon btn-green"
                                style={{ width: 32, height: 32, padding: 0, borderRadius: '50%' }}
                            >
                                <Plus size={20} strokeWidth={4} />
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {wheel.segments.map((segment) => (
                            <div key={segment.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                    onClick={() => navigate(`/color/${wheel.id}/${segment.id}`)}
                                    style={{
                                        width: '40px', height: '40px',
                                        minWidth: '40px', // Prevent shrinking
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        backgroundColor: segment.color,
                                        border: '2px solid rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Check size={24} color="#10B981" strokeWidth={4} style={{ minWidth: 24 }} />
                                <input
                                    className="input-cartoon section-input"
                                    value={segment.label}
                                    placeholder="Option"
                                    onChange={(e) => updateSegment(segment.id, 'label', e.target.value)}
                                    style={{ padding: '0.5rem', fontSize: '1rem', minWidth: 0 }} // minWidth 0 allows flex item to shrink
                                />
                                <button
                                    onClick={() => removeSegment(segment.id)}
                                    className="btn-cartoon btn-red"
                                    style={{ width: 32, height: 32, minWidth: 32, padding: 0, borderRadius: '50%' }}
                                >
                                    <Trash2 size={16} strokeWidth={3} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
