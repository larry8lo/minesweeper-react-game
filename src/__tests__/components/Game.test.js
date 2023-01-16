import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Game from '../../components/Game.js';

function testBombPlanter(width, height, bombs) {
    return [{x:0,y:0}, {x:2,y:0}];
}

test('launch game', () => {

    // create game with two bombs; note important to use the bomb planter function above 
    // so we always get the following layout:
    // [* 2 *]
    // [1 2 1]
    // [0 0 0]
    render(<Game width="3" height="3" bombs="2" bombPlanter={testBombPlanter} />);

    // check some tiles
    expect(screen.getByTestId('t0_0')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t0_1')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t0_2')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t1_0')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t1_1')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t1_2')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t2_0')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t2_1')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t2_2')).toHaveClass('hiddenTile');
   
    // click on the bottom right tile
    userEvent.click(screen.getByTestId('t2_2'));

    // check tiles after clicking
    expect(screen.getByTestId('t0_0')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t0_1')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t0_2')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t1_0')).toHaveClass('revealedTile');
    expect(screen.getByTestId('t1_0')).toHaveTextContent('1');
    expect(screen.getByTestId('t1_1')).toHaveClass('revealedTile');
    expect(screen.getByTestId('t1_1')).toHaveTextContent('2');
    expect(screen.getByTestId('t1_2')).toHaveClass('revealedTile');
    expect(screen.getByTestId('t1_2')).toHaveTextContent('1');
    expect(screen.getByTestId('t2_0')).toHaveClass('revealedTile');
    expect(screen.getByTestId('t2_0')).toHaveTextContent('');
    expect(screen.getByTestId('t2_1')).toHaveClass('revealedTile');
    expect(screen.getByTestId('t2_1')).toHaveTextContent('');
    expect(screen.getByTestId('t2_2')).toHaveClass('revealedTile');
    expect(screen.getByTestId('t2_2')).toHaveTextContent('');
});

