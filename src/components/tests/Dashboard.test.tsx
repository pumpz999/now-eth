import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
  });

  it('should render stats correctly', () => {
    expect(screen.getByText('Total Volume')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
  });

  it('should handle feature card clicks', () => {
    const templateCard = screen.getByText('Smart Contract Templates');
    fireEvent.click(templateCard);
    // Add navigation assertions
  });

  it('should show connect wallet prompt when not connected', () => {
    expect(screen.getByText('Connect Wallet to Get Started')).toBeInTheDocument();
  });
});
