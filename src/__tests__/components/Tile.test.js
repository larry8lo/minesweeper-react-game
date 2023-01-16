import { render, screen } from '@testing-library/react';
import Tile from '../../components/Tile.js';

test('renders unrevealed tile', () => {
    const tileState = { x: 0, y: 0, revealed: false, isBomb: false, flagged: false };
    render(<Tile tileState={tileState} onClick={() => {}} onContextMenu={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("hiddenTile");
});

test('renders revealed 0 tile', () => {
    const tileState = { x: 0, y: 0, revealed: true, isBomb: false, flagged: false, value: 0 };
    render(<Tile tileState={tileState} onClick={() => {}} onContextMenu={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("revealedTile");
    expect(button).not.toHaveTextContent();
});

test('renders revealed 1 tile', () => {
    const tileState = { x: 0, y: 0, revealed: true, isBomb: false, flagged: false, value: 1 };
    render(<Tile tileState={tileState} onClick={() => {}} onContextMenu={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("revealedTile");
    expect(button).toHaveTextContent("1");
});
