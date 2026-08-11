import { useInView, useScrollProgress } from '../hooks/useAnimations';
import './SvgTransition.css';

type TransitionVariant =
  | 'dark-to-light'
  | 'light-to-dark'
  | 'dark-to-green'
  | 'green-to-purple'
  | 'purple-to-dark'
  | 'dark-glow';

interface SvgTransitionProps {
  variant: TransitionVariant;
}

const configs: Record<
  TransitionVariant,
  {
    bgColor: string;
    revealColor: string;
    chevrons: { d: string; fill: string; opacity: number }[];
    revealD: string;
    reverse?: boolean;
    glow?: boolean;
  }
> = {
  'dark-to-light': {
    bgColor: '#0D0D12',
    revealColor: '#F5F0E8',
    chevrons: [
      { d: 'M-200 0 L200 200 L-200 400 L200 400 L600 200 L200 0Z', fill: '#7B61FF', opacity: 0.8 },
      { d: 'M-400 0 L0 200 L-400 400 L-50 400 L350 200 L-50 0Z', fill: '#3EC96A', opacity: 0.6 },
      { d: 'M700 0 L1100 200 L700 400 L1440 400 L1440 0Z', fill: '#FF5733', opacity: 0.7 },
    ],
    revealD: 'M400 0 L800 200 L400 400 L1440 400 L1440 0Z',
  },
  'light-to-dark': {
    bgColor: '#F5F0E8',
    revealColor: '#0E0D14',
    chevrons: [
      { d: 'M1640 0 L1240 200 L1640 400 L1240 400 L840 200 L1240 0Z', fill: '#4A90FF', opacity: 0.7 },
      { d: 'M1440 0 L1040 200 L1440 400 L900 400 L500 200 L900 0Z', fill: '#FFB830', opacity: 0.6 },
    ],
    revealD: 'M1040 0 L640 200 L1040 400 L0 400 L0 0Z',
    reverse: true,
  },
  'dark-to-green': {
    bgColor: '#0E0D14',
    revealColor: '#3EC96A',
    chevrons: [
      { d: 'M-100 0 L300 200 L-100 400 L300 400 L700 200 L300 0Z', fill: '#FFB830', opacity: 0.5 },
      { d: 'M100 0 L500 200 L100 400 L500 400 L900 200 L500 0Z', fill: '#7B61FF', opacity: 0.8 },
    ],
    revealD: 'M500 0 L900 200 L500 400 L1440 400 L1440 0Z',
  },
  'green-to-purple': {
    bgColor: '#3EC96A',
    revealColor: '#7B61FF',
    chevrons: [
      { d: 'M1640 0 L1240 200 L1640 400 L1200 400 L800 200 L1200 0Z', fill: '#4A90FF', opacity: 0.6 },
      { d: 'M1440 0 L1040 200 L1440 400 L950 400 L550 200 L950 0Z', fill: '#FF5733', opacity: 0.8 },
    ],
    revealD: 'M1040 0 L640 200 L1040 400 L0 400 L0 0Z',
    reverse: true,
  },
  'purple-to-dark': {
    bgColor: '#7B61FF',
    revealColor: '#0D0D12',
    chevrons: [
      { d: 'M-100 0 L300 200 L-100 400 L300 400 L700 200 L300 0Z', fill: '#FFB830', opacity: 0.5 },
      { d: 'M200 0 L600 200 L200 400 L600 400 L1000 200 L600 0Z', fill: '#4A90FF', opacity: 0.6 },
    ],
    revealD: 'M500 0 L900 200 L500 400 L1440 400 L1440 0Z',
  },
  'dark-glow': {
    bgColor: '#0D0D12',
    revealColor: 'transparent',
    chevrons: [
      { d: 'M0 0 L400 150 L0 300 L400 300 L800 150 L400 0Z', fill: '#7B61FF', opacity: 0.15 },
      { d: 'M200 0 L600 150 L200 300 L600 300 L1000 150 L600 0Z', fill: '#3EC96A', opacity: 0.15 },
      { d: 'M500 0 L900 150 L500 300 L900 300 L1300 150 L900 0Z', fill: '#FF5733', opacity: 0.15 },
    ],
    revealD: '',
    glow: true,
  },
};

export default function SvgTransition({ variant }: SvgTransitionProps) {
  const { ref: inViewRef, isInView } = useInView();
  const { ref: scrollRef, progress } = useScrollProgress();

  const config = configs[variant];
  const viewBoxH = config.glow ? 300 : 400;

  return (
    <div
      ref={(node) => {
        // Merge refs
        (inViewRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={`svg-transition ${isInView ? 'in-view' : ''} ${config.reverse ? 'svg-transition--reverse' : ''} ${config.glow ? 'svg-transition--glow' : ''}`}
      style={{ '--scroll-progress': progress } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg
        className="svg-transition__svg"
        viewBox={`0 0 1440 ${viewBoxH}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="1440" height={viewBoxH} fill={config.bgColor} />

        <g className={`svg-chevron-group ${config.reverse ? 'svg-chevron-group--reverse' : ''} ${config.glow ? 'svg-chevron-group--glow' : ''}`}>
          {config.chevrons.map((chev, i) => (
            <path
              key={i}
              className="svg-chevron"
              d={chev.d}
              fill={chev.fill}
              opacity={chev.opacity}
            />
          ))}
        </g>

        {config.revealD && (
          <path className="svg-reveal-bg" d={config.revealD} fill={config.revealColor} />
        )}
      </svg>
    </div>
  );
}
