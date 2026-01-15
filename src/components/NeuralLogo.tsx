import { useEffect, useRef } from 'react';

export default function NeuralLogo({ size = 80, animated = true }: { size?: number; animated?: boolean }) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!animated || !svgRef.current) return;

        const nodes = svgRef.current.querySelectorAll('.node-circle');
        nodes.forEach((node, index) => {
            (node as SVGElement).style.animationDelay = `${index * 0.1}s`;
        });
    }, [animated]);

    return (
        <svg
            ref={svgRef}
            width={size}
            height={size}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="neural-logo"
        >
            <defs>
                {/* Gradiente cyan a magenta */}
                <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00D9FF" />
                    <stop offset="50%" stopColor="#7B68EE" />
                    <stop offset="100%" stopColor="#E91E63" />
                </linearGradient>

                {/* Filtro de glow */}
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Glow más intenso para el centro */}
                <filter id="glowIntense">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Nodo central */}
            <circle
                cx="100"
                cy="100"
                r="15"
                fill="url(#neuralGradient)"
                filter="url(#glowIntense)"
                className={animated ? 'node-circle animate-neural-pulse' : 'node-circle'}
            />
            <circle cx="100" cy="100" r="10" fill="#fff" opacity="0.3" />

            {/* Anillos concéntricos */}
            <circle
                cx="100"
                cy="100"
                r="35"
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
            />
            <circle
                cx="100"
                cy="100"
                r="55"
                stroke="url(#neuralGradient)"
                strokeWidth="1"
                fill="none"
                opacity="0.2"
            />

            {/* Nodos externos - 8 direcciones */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
                const radian = (angle * Math.PI) / 180;
                const x = 100 + Math.cos(radian) * 70;
                const y = 100 + Math.sin(radian) * 70;

                // Color basado en el ángulo
                const color = angle < 180 ? '#00D9FF' : '#E91E63';

                return (
                    <g key={angle}>
                        {/* Línea de conexión */}
                        <line
                            x1="100"
                            y1="100"
                            x2={x}
                            y2={y}
                            stroke="url(#neuralGradient)"
                            strokeWidth="1.5"
                            opacity="0.4"
                            filter="url(#glow)"
                        />

                        {/* Nodo externo */}
                        <circle
                            cx={x}
                            cy={y}
                            r="8"
                            fill={color}
                            filter="url(#glow)"
                            className={animated ? 'node-circle animate-neural-pulse' : 'node-circle'}
                            style={{ animationDelay: `${index * 0.15}s` }}
                        />
                        <circle cx={x} cy={y} r="5" fill="#fff" opacity="0.4" />

                        {/* Nodos secundarios */}
                        {index % 2 === 0 && (
                            <>
                                <line
                                    x1={x}
                                    y1={y}
                                    x2={100 + Math.cos(radian) * 90}
                                    y2={100 + Math.sin(radian) * 90}
                                    stroke={color}
                                    strokeWidth="1"
                                    opacity="0.3"
                                />
                                <circle
                                    cx={100 + Math.cos(radian) * 90}
                                    cy={100 + Math.sin(radian) * 90}
                                    r="4"
                                    fill={color}
                                    opacity="0.6"
                                    filter="url(#glow)"
                                    className={animated ? 'node-circle animate-neural-pulse' : 'node-circle'}
                                    style={{ animationDelay: `${index * 0.2}s` }}
                                />
                            </>
                        )}
                    </g>
                );
            })}

            {/* Partículas de datos circulando */}
            {animated && [0, 120, 240].map((angle, index) => {
                const radian = (angle * Math.PI) / 180;
                return (
                    <circle
                        key={`particle-${angle}`}
                        cx={100 + Math.cos(radian) * 35}
                        cy={100 + Math.sin(radian) * 35}
                        r="2"
                        fill="#00D9FF"
                        opacity="0.8"
                        className="animate-particle-float"
                        style={{ animationDelay: `${index * 0.5}s` }}
                    />
                );
            })}
        </svg>
    );
}
