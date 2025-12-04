import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Wheel } from '../components/Wheel';

const TEMPLATES = [
    {
        name: 'Lunch Options',
        segments: [
            { id: '1', label: 'Pizza', color: '#EF4444' },
            { id: '2', label: 'Burger', color: '#F97316' },
            { id: '3', label: 'Sushi', color: '#F59E0B' },
            { id: '4', label: 'Salad', color: '#84CC16' },
            { id: '5', label: 'Tacos', color: '#3B82F6' },
            { id: '6', label: 'Pasta', color: '#8B5CF6' }
        ]
    },
    {
        name: 'Popular Music',
        segments: [
            { id: '1', label: 'Pop', color: '#EC4899' },
            { id: '2', label: 'Rock', color: '#EF4444' },
            { id: '3', label: 'Hip Hop', color: '#F59E0B' },
            { id: '4', label: 'Jazz', color: '#3B82F6' },
            { id: '5', label: 'Classical', color: '#8B5CF6' }
        ]
    },
    {
        name: 'One Piece Characters',
        segments: [
            { id: '1', label: 'Luffy', color: '#EF4444' },
            { id: '2', label: 'Zoro', color: '#10B981' },
            { id: '3', label: 'Nami', color: '#F97316' },
            { id: '4', label: 'Sanji', color: '#3B82F6' },
            { id: '5', label: 'Chopper', color: '#EC4899' }
        ]
    },
    {
        name: 'Jujutsu Kaisen',
        segments: [
            { id: '1', label: 'Yuji', color: '#EF4444' },
            { id: '2', label: 'Megumi', color: '#3B82F6' },
            { id: '3', label: 'Nobara', color: '#F97316' },
            { id: '4', label: 'Gojo', color: '#8B5CF6' },
            { id: '5', label: 'Sukuna', color: '#EF4444' }
        ]
    },
    {
        name: 'Truth or Dare',
        segments: [
            { id: '1', label: 'Truth', color: '#3B82F6' },
            { id: '2', label: 'Dare', color: '#EF4444' },
            { id: '3', label: 'Truth', color: '#3B82F6' },
            { id: '4', label: 'Dare', color: '#EF4444' }
        ]
    },
    {
        name: 'Movie Genre',
        segments: [
            { id: '1', label: 'Action', color: '#EF4444' },
            { id: '2', label: 'Comedy', color: '#F59E0B' },
            { id: '3', label: 'Horror', color: '#111827' },
            { id: '4', label: 'Sci-Fi', color: '#8B5CF6' },
            { id: '5', label: 'Romance', color: '#EC4899' },
            { id: '6', label: 'Drama', color: '#3B82F6' }
        ]
    },
    {
        name: 'Workout',
        segments: [
            { id: '1', label: 'Pushups', color: '#EF4444' },
            { id: '2', label: 'Squats', color: '#84CC16' },
            { id: '3', label: 'Plank', color: '#F59E0B' },
            { id: '4', label: 'Burpees', color: '#3B82F6' },
            { id: '5', label: 'Lunges', color: '#8B5CF6' }
        ]
    },
    {
        name: 'Twister',
        segments: [
            { id: '1', label: 'Left Hand Green', color: '#22C55E' },
            { id: '2', label: 'Right Hand Red', color: '#EF4444' },
            { id: '3', label: 'Left Foot Yellow', color: '#EAB308' },
            { id: '4', label: 'Right Foot Blue', color: '#3B82F6' }
        ]
    },
    {
        name: 'Yes / No',
        segments: [
            { id: '1', label: 'YES', color: '#22C55E' },
            { id: '2', label: 'NO', color: '#EF4444' },
            { id: '3', label: 'MAYBE', color: '#EAB308' }
        ]
    }
];

export function Templates() {
    const navigate = useNavigate();

    const useTemplate = (template) => {
        const saved = localStorage.getItem('my-wheels');
        let wheels = saved ? JSON.parse(saved) : [];

        const newWheel = {
            id: Date.now().toString(),
            name: template.name,
            segments: template.segments,
            settings: { repeat: 2, duration: 3, fontSize: 4 }
        };

        wheels.push(newWheel);
        localStorage.setItem('my-wheels', JSON.stringify(wheels));
        navigate(`/edit/${newWheel.id}`);
    };

    return (
        <div className="container" style={{ padding: '1rem', height: 'auto', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/')}
                    className="btn-cartoon btn-yellow"
                    style={{ width: 48, height: 48, padding: 0, borderRadius: '50%', marginBottom: '1rem' }}
                >
                    <ArrowLeft size={28} strokeWidth={4} />
                </button>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <button
                        className="btn-cartoon"
                        style={{ background: '#C084FC', border: '3px solid white', flex: 1, maxWidth: '200px' }}
                    >
                        Create with AI
                    </button>
                    <button
                        onClick={() => navigate('/edit/new')}
                        className="btn-cartoon"
                        style={{ background: 'white', color: '#374151', border: '3px solid #E5E7EB', flex: 1, maxWidth: '200px' }}
                    >
                        Create from Scratch
                    </button>
                </div>

                <h1 className="header-title" style={{ fontSize: '1.8rem' }}>Choose a Template</h1>
            </div>

            {/* Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '1rem'
            }}>
                {TEMPLATES.map((template, index) => (
                    <div
                        key={index}
                        onClick={() => useTemplate(template)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <h3 style={{
                            color: 'white',
                            fontWeight: '900',
                            marginBottom: '0.5rem',
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                            textAlign: 'center',
                            fontSize: '0.9rem'
                        }}>
                            {template.name}
                        </h3>
                        <div className="card" style={{
                            padding: '0.5rem',
                            width: '100%',
                            aspectRatio: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            backdropFilter: 'blur(4px)'
                        }}>
                            <div style={{ transform: 'scale(0.45)' }}>
                                <Wheel segments={template.segments} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
