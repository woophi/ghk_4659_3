import { globalStyle, style } from '@vanilla-extract/css';

const bottomBtn = style({
  position: 'fixed',
  zIndex: 2,
  width: '100%',
  padding: '12px',
  bottom: 0,
});

const container = style({
  display: 'flex',
  padding: '1rem',
  flexDirection: 'column',
  gap: '1rem',
});

const box = style({
  padding: '1rem',
  borderRadius: '12px',
  backgroundColor: '#F3F4F5',
});

const row = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const stepStyle = style({});

globalStyle(`${stepStyle} > div > div > div:first-child`, {
  backgroundColor: 'var(--color-light-neutral-translucent-1300)',
  color: 'var(--color-light-text-primary-inverted)',
});

const img = style({ margin: '0 auto', maxWidth: '328px', objectFit: 'contain' });

export const appSt = {
  bottomBtn,
  container,
  box,
  row,
  stepStyle,
  img,
};
