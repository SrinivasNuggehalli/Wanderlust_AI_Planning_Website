import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Packages from './Packages';
import '@testing-library/jest-dom';

describe('Packages Component', () => {
  const mockOnSelectPackage = jest.fn();

  const renderComponent = (trip = { location: 'New York' }) => {
    render(
      <MemoryRouter>
        <Packages trip={trip} onSelectPackage={mockOnSelectPackage} />
      </MemoryRouter>
    );
  };

  it('renders with default location title when no trip location is provided', () => {
    renderComponent({});

    expect(screen.getByText(/Packages for Your Destination/i)).toBeInTheDocument();
  });

  it('renders with specified location title when trip location is provided', () => {
    renderComponent({ location: 'New York' });

    expect(screen.getByText(/Packages for New York/i)).toBeInTheDocument();
  });

  it('displays correct packages for New York', () => {
    renderComponent({ location: 'New York' });

    expect(screen.getByText(/NYC Adventure Package/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore NYC's top attractions including the Statue of Liberty and Central Park/i)).toBeInTheDocument();
    expect(screen.getByText(/Duration: 3 days \/ 2 nights/i)).toBeInTheDocument();
    expect(screen.getByText(/Price: \$399/i)).toBeInTheDocument();

    expect(screen.getByText(/NYC Cultural Package/i)).toBeInTheDocument();
    expect(screen.getByText(/Experience Broadway shows, museums, and historical neighborhoods/i)).toBeInTheDocument();
    expect(screen.getByText(/Duration: 2 days \/ 1 night/i)).toBeInTheDocument();
    expect(screen.getByText(/Price: \$299/i)).toBeInTheDocument();
  });

  it('displays default packages when no location matches', () => {
    renderComponent({ location: 'Unknown' });

    expect(screen.getByText(/Adventure Package/i)).toBeInTheDocument();
    expect(screen.getByText(/Outdoor activities including hiking, zip-lining, and rafting/i)).toBeInTheDocument();

    expect(screen.getByText(/Relaxation Package/i)).toBeInTheDocument();
    expect(screen.getByText(/Unwind with spa treatments, beach access, and yoga/i)).toBeInTheDocument();
  });

  it('calls onSelectPackage and navigates on package selection', () => {
    renderComponent({ location: 'California' });

    const packageCard = screen.getByText(/California Beach Getaway/i);
    fireEvent.click(packageCard);

    expect(mockOnSelectPackage).toHaveBeenCalledWith({
      packageName: 'California Beach Getaway',
      description: 'Relax at Santa Monica Beach, visit Malibu, and enjoy coastal views.',
      price: 499,
      duration: '4 days / 3 nights',
    });

    expect(screen.getByText(/Packages for California/i)).toBeInTheDocument();
  });
});
