import React from 'react';

import { render, cleanup } from '@testing-library/react';

import App from '~/App';

describe('find text true is truthy and false is falsy', () => {
    afterEach(() => cleanup());

    it('find text', () => {
        const { getByText } = render(<App />);
        expect(getByText('Typescript')).toBeTruthy();
    });

    it('true is truthy', () => {
        expect(true).toBe(true);
    });

    it('false is falsy', () => {
        expect(false).toBe(false);
    });
});
