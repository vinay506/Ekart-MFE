import React, { lazy } from 'react';
import { render, screen } from '@testing-library/react';
import RemoteLoader from './RemoteLoader';

const GoodRemote = lazy(() =>
  Promise.resolve({ default: () => <div data-testid="remote-ok">Remote loaded</div> })
);

const BadRemote = lazy(() => Promise.reject(new Error('chunk load failed')));

describe('RemoteLoader', () => {
  it('renders the fallback while loading', () => {
    render(
      <RemoteLoader
        component={GoodRemote}
        fallback={<div data-testid="fallback">Loading…</div>}
      />
    );
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });

  it('renders the remote component after it resolves', async () => {
    render(
      <RemoteLoader
        component={GoodRemote}
        fallback={<div>Loading…</div>}
      />
    );
    expect(await screen.findByTestId('remote-ok')).toHaveTextContent('Remote loaded');
  });

  it('renders errorFallback when the remote rejects', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <RemoteLoader
        component={BadRemote}
        fallback={<div>Loading…</div>}
        errorFallback={<div data-testid="error-fallback">Load failed</div>}
      />
    );

    expect(await screen.findByTestId('error-fallback')).toHaveTextContent('Load failed');
    consoleError.mockRestore();
  });
});
