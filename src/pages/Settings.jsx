import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Globe,
    Volume2,
    Music,
    Smartphone,
    Mail,
    Share2,
    Star,
    Lock,
    Ban
} from 'lucide-react';
import { Toggle } from '../components/ui/Toggle';

const SettingItem = ({ icon: Icon, label, action, isToggle, toggleValue, onToggle }) => (
    <div
        onClick={!isToggle ? action : undefined}
        style={{
            background: '#374151',
            borderRadius: '999px',
            padding: '0.5rem 1rem', // Reduced padding
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem', // Reduced margin
            cursor: isToggle ? 'default' : 'pointer',
            border: '2px solid rgba(255,255,255,0.1)',
            boxShadow: '0 2px 0 rgba(0,0,0,0.2)' // Reduced shadow
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Icon size={20} color="white" strokeWidth={2.5} /> {/* Smaller icon */}
            <span style={{
                color: 'white',
                fontSize: '1rem', // Smaller font
                fontWeight: '700',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}>
                {label}
            </span>
        </div>
        {isToggle && (
            <div style={{ transform: 'scale(0.7)', marginRight: '-8px' }}> {/* Smaller toggle */}
                <Toggle checked={toggleValue} onChange={onToggle} />
            </div>
        )}
    </div>
);

export function Settings() {
    const navigate = useNavigate();
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [musicEnabled, setMusicEnabled] = useState(false);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);

    return (
        <div className="container" style={{ padding: '1rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', position: 'relative' }}>
                <button
                    onClick={() => navigate('/')}
                    className="btn-cartoon btn-yellow"
                    style={{ width: 40, height: 40, padding: 0, borderRadius: '50%', position: 'absolute', left: 0 }}
                >
                    <ArrowLeft size={24} strokeWidth={4} />
                </button>
                <h1 className="header-title" style={{ width: '100%', margin: 0, fontSize: '1.5rem' }}>Settings</h1>
            </div>

            <div>
                {/* No ADS Button */}
                <div
                    onClick={() => alert('Premium features coming soon!')}
                    style={{
                        background: 'white',
                        borderRadius: '999px',
                        padding: '0.4rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        cursor: 'pointer',
                        border: '3px solid #EF4444',
                        boxShadow: '0 2px 0 rgba(0,0,0,0.1)'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        color: '#EF4444',
                        fontWeight: '800',
                        fontSize: '1.2rem'
                    }}>
                        <Ban size={24} strokeWidth={3} />
                        <span>No ADS</span>
                    </div>
                </div>

                {/* Settings List */}
                <SettingItem
                    icon={Globe}
                    label="Language"
                    action={() => alert('Language selection')}
                />

                <SettingItem
                    icon={Volume2}
                    label="Sound"
                    isToggle
                    toggleValue={soundEnabled}
                    onToggle={() => setSoundEnabled(!soundEnabled)}
                />

                <SettingItem
                    icon={Music}
                    label="Music"
                    isToggle
                    toggleValue={musicEnabled}
                    onToggle={() => setMusicEnabled(!musicEnabled)}
                />

                <SettingItem
                    icon={Smartphone}
                    label="Vibration"
                    isToggle
                    toggleValue={vibrationEnabled}
                    onToggle={() => setVibrationEnabled(!vibrationEnabled)}
                />

                <div style={{ height: '1rem' }}></div>

                <SettingItem
                    icon={Mail}
                    label="Send Feedback"
                    action={() => window.location.href = 'mailto:support@example.com'}
                />

                <SettingItem
                    icon={Share2}
                    label="Share App"
                    action={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Decision Maker',
                                text: 'Check out this awesome app!',
                                url: window.location.href,
                            });
                        } else {
                            alert('Share feature not supported on this device');
                        }
                    }}
                />

                <SettingItem
                    icon={Star}
                    label="Write Review"
                    action={() => alert('Thank you for your review!')}
                />

                <SettingItem
                    icon={Lock}
                    label="Privacy"
                    action={() => alert('Privacy Policy')}
                />

                <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '2rem', fontWeight: 'bold' }}>
                    Version 5.5.0
                </div>
            </div>
        </div>
    );
}
