import React from 'react'; // Explicit React import to resolve the error
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import '@testing-library/jest-dom'; // Provides additional matchers for testing


describe('Footer Component', () => {
  test('renders the footer text correctly', () => {
    render(<Footer />);
    const footerText = screen.getByText('Created By Group 9');
    expect(footerText).toBeInTheDocument();
    expect(footerText).toHaveClass('text-center');
    expect(footerText).toHaveClass('text-gray-400');
  });


  test('footer is wrapped inside a div with correct class', () => {
    render(<Footer />);
    const footerDiv = screen.getByRole('heading', { name: 'Created By Group 9' }).closest('div');
    expect(footerDiv).toHaveClass('my-7');
  });
});
