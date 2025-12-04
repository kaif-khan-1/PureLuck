import { Plus, Trash2, Shuffle } from 'lucide-react';

const PRESET_COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981',
    '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'
];

export function WheelEditor({ segments, setSegments }) {

    const addSegment = () => {
        const randomColor = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
        const newSegment = {
            id: Date.now().toString(),
            label: `Option ${segments.length + 1}`,
            color: randomColor
        };
        setSegments([...segments, newSegment]);
    };

    const removeSegment = (id) => {
        if (segments.length <= 2) {
            alert("You need at least 2 options!");
            return;
        }
        setSegments(segments.filter(s => s.id !== id));
    };

    const updateSegment = (id, field, value) => {
        setSegments(segments.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    const shuffleColors = () => {
        setSegments(segments.map(s => ({
            ...s,
            color: PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]
        })));
    };

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Edit Wheel</h2>
                <button
                    onClick={shuffleColors}
                    className="btn-icon"
                    title="Shuffle Colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    <Shuffle size={20} />
                </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {segments.map((segment) => (
                    <div key={segment.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            type="color"
                            value={segment.color}
                            onChange={(e) => updateSegment(segment.id, 'color', e.target.value)}
                            style={{
                                width: '40px',
                                height: '40px',
                                padding: '0',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                backgroundColor: 'transparent'
                            }}
                        />
                        <input
                            type="text"
                            value={segment.label}
                            onChange={(e) => updateSegment(segment.id, 'label', e.target.value)}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--color-border)',
                                fontSize: '0.9rem'
                            }}
                        />
                        <button
                            onClick={() => removeSegment(segment.id)}
                            className="btn-icon"
                            style={{ color: '#EF4444' }}
                            title="Remove"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <button
                    className="btn"
                    onClick={addSegment}
                    style={{
                        width: '100%',
                        border: '2px dashed var(--color-border)',
                        color: 'var(--color-text-secondary)'
                    }}
                >
                    <Plus size={20} style={{ marginRight: '0.5rem' }} />
                    Add Option
                </button>
            </div>
        </div>
    );
}
