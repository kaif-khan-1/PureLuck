import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

const PRESETS = [
    '#A78BFA', '#8B5CF6', '#3B82F6', '#1D4ED8',
    '#1E3A8A', '#FCA5A5', '#F87171', '#EF4444',
    '#B91C1C', '#FDE047', '#FACC15'
];

// Helper functions for color conversion
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
};

const rgbToHsv = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
};

const hsvToRgb = (h, s, v) => {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

export function ColorPicker() {
    const { wheelId, segmentId } = useParams();
    const navigate = useNavigate();
    const [color, setColor] = useState({ h: 0, s: 100, v: 100 });
    const [hex, setHex] = useState('#FFFFFF');

    useEffect(() => {
        const saved = localStorage.getItem('my-wheels');
        if (saved) {
            const wheels = JSON.parse(saved);
            const wheel = wheels.find(w => w.id === wheelId);
            if (wheel) {
                const segment = wheel.segments.find(s => s.id === segmentId);
                if (segment) {
                    setHex(segment.color);
                    const rgb = hexToRgb(segment.color);
                    setColor(rgbToHsv(rgb.r, rgb.g, rgb.b));
                }
            }
        }
    }, [wheelId, segmentId]);

    const updateColorFromHsv = (h, s, v) => {
        setColor({ h, s, v });
        const rgb = hsvToRgb(h / 360, s / 100, v / 100);
        setHex(rgbToHex(rgb.r, rgb.g, rgb.b));
    };

    const updateColorFromHex = (newHex) => {
        setHex(newHex);
        if (/^#[0-9A-F]{6}$/i.test(newHex)) {
            const rgb = hexToRgb(newHex);
            setColor(rgbToHsv(rgb.r, rgb.g, rgb.b));
        }
    };

    const saveColor = () => {
        const saved = localStorage.getItem('my-wheels');
        if (saved) {
            const wheels = JSON.parse(saved);
            const updatedWheels = wheels.map(w => {
                if (w.id === wheelId) {
                    return {
                        ...w,
                        segments: w.segments.map(s => s.id === segmentId ? { ...s, color: hex } : s)
                    };
                }
                return w;
            });
            localStorage.setItem('my-wheels', JSON.stringify(updatedWheels));
        }
        navigate(`/edit/${wheelId}`);
    };

    return (
        <div className="container" style={{ padding: '1rem', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1rem' }}>
                <button
                    onClick={() => navigate(`/edit/${wheelId}`)}
                    className="btn-cartoon btn-yellow"
                    style={{ width: 48, height: 48, padding: 0, borderRadius: '50%' }}
                >
                    <ArrowLeft size={28} strokeWidth={4} />
                </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Preview Box */}
                <div style={{
                    width: '150px',
                    height: '150px',
                    backgroundColor: hex,
                    borderRadius: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    border: '4px solid rgba(0,0,0,0.1)'
                }}></div>

                <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
                    {/* Presets */}
                    <div style={{ width: '40%' }}>
                        <h2 style={{ color: 'white', fontWeight: '900', marginBottom: '1rem', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>Presets</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                            {PRESETS.map((preset, i) => (
                                <div
                                    key={i}
                                    onClick={() => updateColorFromHex(preset)}
                                    style={{
                                        backgroundColor: preset,
                                        aspectRatio: '1',
                                        borderRadius: '0.75rem',
                                        cursor: 'pointer',
                                        border: hex.toUpperCase() === preset.toUpperCase() ? '3px solid white' : 'none',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Picker */}
                    <div style={{ flex: 1 }}>
                        <h2 style={{ color: 'white', fontWeight: '900', marginBottom: '1rem', textAlign: 'right', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>Picker</h2>
                        <div className="card" style={{ background: 'white', padding: '1rem' }}>

                            {/* Hue */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ fontWeight: '900', fontSize: '0.8rem', color: '#374151' }}>HUE</label>
                                <input
                                    type="range" min="0" max="360"
                                    value={color.h}
                                    onChange={(e) => updateColorFromHsv(Number(e.target.value), color.s, color.v)}
                                    style={{
                                        width: '100%', height: '10px', borderRadius: '5px', appearance: 'none',
                                        background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'
                                    }}
                                />
                            </div>

                            {/* Saturation */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ fontWeight: '900', fontSize: '0.8rem', color: '#374151' }}>SATURATION</label>
                                <input
                                    type="range" min="0" max="100"
                                    value={color.s}
                                    onChange={(e) => updateColorFromHsv(color.h, Number(e.target.value), color.v)}
                                    style={{
                                        width: '100%', height: '10px', borderRadius: '5px', appearance: 'none',
                                        background: `linear-gradient(to right, #808080, hsl(${color.h}, 100%, 50%))`
                                    }}
                                />
                            </div>

                            {/* Brightness */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ fontWeight: '900', fontSize: '0.8rem', color: '#374151' }}>BRIGHTNESS</label>
                                <input
                                    type="range" min="0" max="100"
                                    value={color.v}
                                    onChange={(e) => updateColorFromHsv(color.h, color.s, Number(e.target.value))}
                                    style={{
                                        width: '100%', height: '10px', borderRadius: '5px', appearance: 'none',
                                        background: `linear-gradient(to right, black, hsl(${color.h}, ${color.s}%, 50%))`
                                    }}
                                />
                            </div>

                            {/* Hex */}
                            <div>
                                <label style={{ fontWeight: '900', fontSize: '0.8rem', color: '#374151' }}>HEX (#)</label>
                                <input
                                    type="text"
                                    value={hex.replace('#', '')}
                                    onChange={(e) => updateColorFromHex('#' + e.target.value)}
                                    style={{
                                        width: '100%', padding: '0.5rem', borderRadius: '0.5rem',
                                        border: '1px solid #E5E7EB', fontWeight: 'bold', color: '#374151'
                                    }}
                                />
                            </div>

                        </div>

                        <button
                            onClick={saveColor}
                            className="btn-cartoon btn-green"
                            style={{ width: '100%', marginTop: '1rem' }}
                        >
                            Save Color
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
