import { render, screen } from '@testing-library/react';
import Features from '../Features';

describe('Features Component', () => {
    it('renders all feature items', () => {
        render(<Features />);
        expect(screen.getAllByTestId('feature-item')).toHaveLength(3);
    });
}); 