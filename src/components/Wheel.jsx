import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';

export function Wheel({ segments, repeat = 1, spinDuration = 3, fontSize = 4, onFinished, onSegmentClick }) {
    const canvasRef = useRef(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winner, setWinner] = useState(null);

    // Physics state refs
    const stateRef = useRef({
        rotation: 0,
        velocity: 0,
        lastFrameTime: 0,
        targetRotation: 0,
        startTime: 0,
        isDecelerating: false
    });

    // Generate the full list of segments based on repeat count
    const repeatedSegments = [];
    for (let i = 0; i < repeat; i++) {
        repeatedSegments.push(...segments);
    }

    const drawWheel = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2 - 25; // Padding for border

        ctx.clearRect(0, 0, width, height);

        // Draw outer rim
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#E0F2FE'; // Light blue rim
        ctx.fill();
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#3B82F6'; // Darker blue border
        ctx.stroke();

        // Draw knobs on the rim
        const knobCount = 8;
        for (let i = 0; i < knobCount; i++) {
            const angle = (i / knobCount) * Math.PI * 2;
            const kx = centerX + (radius + 15) * Math.cos(angle);
            const ky = centerY + (radius + 15) * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(kx, ky, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.strokeStyle = '#CBD5E1';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        const totalSegments = repeatedSegments.length;
        if (totalSegments === 0) return;

        const arcSize = (2 * Math.PI) / totalSegments;
        const rotation = stateRef.current.rotation;

        repeatedSegments.forEach((segment, index) => {
            const startAngle = index * arcSize + rotation;
            const endAngle = startAngle + arcSize;

            // Draw segment
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.fillStyle = segment.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.stroke();

            // Draw text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + arcSize / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            // Font size scaling: 1-10 range maps to 10px-40px roughly
            const actualFontSize = 10 + (fontSize * 3);
            ctx.font = `900 ${actualFontSize}px Nunito, sans-serif`;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;

            // Truncate text if too long
            const maxWidth = radius - 40;
            let text = segment.label;
            if (ctx.measureText(text).width > maxWidth) {
                // Simple truncation
                while (ctx.measureText(text + '...').width > maxWidth && text.length > 0) {
                    text = text.slice(0, -1);
                }
                text += '...';
            }

            ctx.fillText(text, radius - 20, actualFontSize / 3);
            ctx.restore();
        });

        // Draw center circle (hub)
        ctx.beginPath();
        ctx.arc(centerX, centerY, 35, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        // Inner shadow for depth
        const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 35);
        gradient.addColorStop(0, '#f8fafc');
        gradient.addColorStop(1, '#e2e8f0');
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#cbd5e1';
        ctx.stroke();

        // Draw pointer (Gold teardrop)
        ctx.save();
        ctx.translate(centerX, centerY - radius - 20);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(10, -10, 10, -25, 0, -35); // Right curve
        ctx.bezierCurveTo(-10, -25, -10, -10, 0, 0); // Left curve
        ctx.fillStyle = '#FCD34D'; // Gold
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#B45309'; // Dark gold border
        ctx.stroke();

        // Pointer dot
        ctx.beginPath();
        ctx.arc(0, -25, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#78350F';
        ctx.fill();
        ctx.restore();
    };

    useEffect(() => {
        drawWheel();
    }, [segments, repeat, fontSize]);

    const spin = () => {
        if (isSpinning || repeatedSegments.length === 0) return;

        setIsSpinning(true);
        setWinner(null);

        // Calculate target rotation
        const extraSpins = 5 + Math.random() * 5; // 5 to 10 full spins
        const targetAngle = (extraSpins * 2 * Math.PI) + (Math.random() * 2 * Math.PI);

        stateRef.current = {
            ...stateRef.current,
            startTime: performance.now(),
            startRotation: stateRef.current.rotation % (2 * Math.PI),
            targetRotation: stateRef.current.rotation + targetAngle,
            duration: spinDuration * 1000
        };

        requestAnimationFrame(animate);
    };

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (time) => {
        const state = stateRef.current;
        const elapsed = time - state.startTime;
        const progress = Math.min(elapsed / state.duration, 1);

        const easedProgress = easeOutCubic(progress);

        state.rotation = state.startRotation + (state.targetRotation - state.startRotation) * easedProgress;

        if (progress < 1) {
            drawWheel();
            requestAnimationFrame(animate);
        } else {
            setIsSpinning(false);
            determineWinner();
        }
    };

    const determineWinner = () => {
        const totalSegments = repeatedSegments.length;
        const arcSize = (2 * Math.PI) / totalSegments;
        const rotation = stateRef.current.rotation % (2 * Math.PI);

        // Pointer is at -PI/2 (top)
        let pointerAngle = (1.5 * Math.PI - rotation) % (2 * Math.PI);
        if (pointerAngle < 0) pointerAngle += 2 * Math.PI;

        const winningIndex = Math.floor(pointerAngle / arcSize);
        const winningSegment = repeatedSegments[winningIndex];

        setWinner(winningSegment);
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: [winningSegment.color, '#ffffff', '#FFD700']
        });
        drawWheel();

        if (onFinished) onFinished(winningSegment);
    };

    const handleClick = (e) => {
        if (isSpinning) return;

        if (onFinished && !onSegmentClick) {
            // Spin mode
            spin();
            return;
        }

        // Calculate click position relative to center
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - canvas.width / 2;
        const y = e.clientY - rect.top - canvas.height / 2;

        // Calculate angle
        let angle = Math.atan2(y, x); // -PI to PI
        if (angle < 0) angle += 2 * Math.PI; // 0 to 2PI

        // Adjust for current rotation
        const rotation = stateRef.current.rotation % (2 * Math.PI);
        let relativeAngle = angle - rotation;
        if (relativeAngle < 0) relativeAngle += 2 * Math.PI;

        const totalSegments = repeatedSegments.length;
        const arcSize = (2 * Math.PI) / totalSegments;

        const index = Math.floor(relativeAngle / arcSize) % totalSegments;
        const segment = repeatedSegments[index];

        if (onSegmentClick) {
            onSegmentClick(segment);
        } else {
            spin();
        }
    };

    return (
        <div style={{ textAlign: 'center', position: 'relative' }}>
            <canvas
                ref={canvasRef}
                width={340}
                height={340}
                style={{
                    maxWidth: '100%',
                    cursor: isSpinning ? 'default' : 'pointer',
                    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))'
                }}
                onClick={handleClick}
            />
        </div>
    );
}
