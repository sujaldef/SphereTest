import React from 'react';

/**
 * GAMIFIED UI COMPONENTS
 * Reusable components following the retro 3D block design system
 */

/* ============================================
   GAME BUTTON
   ============================================ */

export const GameButton = ({
  variant = 'primary', // primary | secondary | danger
  size = 'md', // sm | md | lg | full
  disabled = false,
  onClick,
  children,
  className = '',
  icon: Icon,
  ...props
}) => {
  const variantClass = {
    primary: 'game-btn-primary',
    secondary: 'game-btn-secondary',
    danger: 'game-btn-danger',
  }[variant];

  const sizeClass = {
    sm: 'game-sm',
    md: '',
    lg: 'game-lg',
    full: 'game-full',
  }[size];

  const disabledClass = disabled ? 'disabled' : '';

  return (
    <button
      className={`game-box ${variantClass} ${sizeClass} ${disabledClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <div className="game-box-shadow" />
      {variant === 'primary' && <div className="game-dots" />}
      <div className="game-box-content">
        {Icon && <Icon size={16} />}
        {children}
      </div>
    </button>
  );
};

/* ============================================
   GAME CARD
   ============================================ */

export const GameCard = ({
  title,
  children,
  onClick,
  className = '',
  ...props
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div className={`game-card ${className}`} onClick={handleClick} {...props}>
      {title && <h3 className="game-card-title">{title}</h3>}
      <div className="game-card-text">{children}</div>
    </div>
  );
};

/* ============================================
   GAME INPUT
   ============================================ */

export const GameInput = ({
  placeholder = '',
  value,
  onChange,
  disabled = false,
  type = 'text',
  className = '',
  ...props
}) => {
  return (
    <div className={`game-input ${className}`}>
      <div className="game-input-wrapper">
        <div className="game-input-shadow" />
        <input
          className="game-input-field"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
      </div>
    </div>
  );
};

/* ============================================
   GAME FEATURE BOX
   ============================================ */

export const GameFeatureBox = ({
  icon: Icon,
  title,
  children,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`game-feature-box ${className}`}
      onClick={onClick}
      {...props}
    >
      {Icon && (
        <div className="game-feature-box-icon">
          <Icon size={40} />
        </div>
      )}
      {title && <h4 className="game-feature-box-title">{title}</h4>}
      <p className="game-feature-box-text">{children}</p>
    </div>
  );
};

/* ============================================
   GAME BADGE
   ============================================ */

export const GameBadge = ({
  children,
  variant = 'primary', // primary | secondary
  className = '',
  ...props
}) => {
  return (
    <span className={`game-badge ${className}`} {...props}>
      {children}
    </span>
  );
};

/* ============================================
   GAME SECTION HEADER
   ============================================ */

export const GameSectionHeader = ({
  title,
  subtitle,
  className = '',
  ...props
}) => {
  return (
    <div className={className} {...props}>
      <h2 className="game-section-title">{title}</h2>
      {subtitle && <p className="game-section-subtitle">{subtitle}</p>}
    </div>
  );
};

/* ============================================
   GAME CONTAINER / LAYOUT
   ============================================ */

export const GameContainer = ({
  children,
  variant = 'default', // default | dots
  className = '',
  ...props
}) => {
  const variantClass = {
    default: '',
    dots: 'game-dots-pattern',
  }[variant];

  return (
    <div className={`${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

/* ============================================
   GAME GRID
   ============================================ */

export const GameGrid = ({
  columns = 3,
  gap = 6,
  children,
  responsive = true,
  className = '',
  ...props
}) => {
  const responsiveClass = responsive
    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-' + columns
    : 'grid-cols-' + columns;
  const gapClass = `gap-${gap}`;

  return (
    <div
      className={`grid ${responsiveClass} ${gapClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/* ============================================
   GAME BOX (Low-level wrapper)
   ============================================ */

export const GameBox = ({
  variant = 'primary', // primary | secondary | white
  children,
  className = '',
  ...props
}) => {
  const variantClass = {
    primary: 'game-btn-primary',
    secondary: 'game-btn-secondary',
    white: '',
  }[variant];

  return (
    <div className={`game-box ${variantClass} ${className}`} {...props}>
      <div className="game-box-shadow" />
      {variant === 'primary' && <div className="game-dots" />}
      <div className="game-box-content">{children}</div>
    </div>
  );
};

export default {
  GameButton,
  GameCard,
  GameInput,
  GameFeatureBox,
  GameBadge,
  GameSectionHeader,
  GameContainer,
  GameGrid,
  GameBox,
};
