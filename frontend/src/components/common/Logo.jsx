import logoImg from '../../assets/logo.jpg';

export default function Logo({ size = 42, className = '' }) {
  const isSmall = size <= 64;

  return (
    <img
      src={logoImg}
      alt="Shailendra Technology Logo"
      width={size}
      height={size}
      className={`logo-img ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: isSmall ? '50%' : '12px',
        objectFit: isSmall ? 'cover' : 'contain',
        objectPosition: isSmall ? 'center 36%' : 'center',
        border: '1.5px solid var(--gold)',
        backgroundColor: '#0a0a0a',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
      }}
    />
  );
}
