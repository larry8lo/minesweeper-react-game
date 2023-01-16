import { render, screen } from '@testing-library/react';
import Counter from '../../components/Counter.js';

test('renders counter with value of 0', () => {
    render(<Counter value="0" />);
    expect(screen.getByText("000")).toBeInTheDocument();
});

test('renders counter with value of 1', () => {
    render(<Counter value="1" />);
    expect(screen.getByText("001")).toBeInTheDocument();
});

test('renders counter with value of 12', () => {
    render(<Counter value="12" />);
    expect(screen.getByText("012")).toBeInTheDocument();
});

test('renders counter with value of 123', () => {
    render(<Counter value="123" />);
    expect(screen.getByText("123")).toBeInTheDocument();
});

test('renders counter with value of 1234', () => {
    render(<Counter value="1234" />);
    expect(screen.getByText("XXX")).toBeInTheDocument();
});
