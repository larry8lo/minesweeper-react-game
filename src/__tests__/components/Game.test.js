import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Game, * as GC from '../../components/Game.js';
import * as TC from '../../components/Tile.js';

function testBombPlanter(width, height, bombs) {
    return [{x:0,y:0}, {x:2,y:0}];
}

test('play game for the win', () => {

    // create game with two bombs; note important to use the bomb planter function above 
    // so we always get the following layout:
    // [* 2 *]
    // [1 2 1]
    // [0 0 0]
    render(<Game width="3" height="3" bombs="2" bombPlanter={testBombPlanter} />);

    // the restart game button should be showing the playing icon
    expect(screen.getByText(GC.GAME_BUTTON_VALUES[GC.PLAYING]))
        .toBeInTheDocument();

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

    // click on the last non-bomb tile
    userEvent.click(screen.getByTestId('t0_1'));

    // the restart game button should be showing the WON icon
    expect(screen.getByText(GC.GAME_BUTTON_VALUES[GC.WON]))
        .toBeInTheDocument();

    // restart game
    userEvent.click(screen.getByText(GC.GAME_BUTTON_VALUES[GC.WON]));

    // the restart game button should be showing the playing icon again
    expect(screen.getByText(GC.GAME_BUTTON_VALUES[GC.PLAYING]))
        .toBeInTheDocument();

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
});

test('play game to a loss', () => {

    // create game with two bombs; note important to use the bomb planter function above 
    // so we always get the following layout:
    // [* 2 *]
    // [1 2 1]
    // [0 0 0]
    render(<Game width="3" height="3" bombs="2" bombPlanter={testBombPlanter} />);

    // the restart game button should be showing the playing icon
    expect(screen.getByText(GC.GAME_BUTTON_VALUES[GC.PLAYING]))
        .toBeInTheDocument();

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
    userEvent.click(screen.getByTestId('t0_0'));

    // hit a bomb!
    expect(screen.getByTestId('t0_0')).toHaveClass('revealedTile');
    expect(screen.getByTestId('t0_0')).toHaveTextContent(TC.BOMB_VALUE);

    // the restart game button should be showing the LOST icon
    expect(screen.getByText(GC.GAME_BUTTON_VALUES[GC.LOST]))
        .toBeInTheDocument();

    // restart game
    userEvent.click(screen.getByText(GC.GAME_BUTTON_VALUES[GC.LOST]));

    // the restart game button should be showing the playing icon again
    expect(screen.getByText(GC.GAME_BUTTON_VALUES[GC.PLAYING]))
        .toBeInTheDocument();

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
});

test('restart game while still playing', () => {

    // create game with two bombs; note important to use the bomb planter function above 
    // so we always get the following layout:
    // [* 2 *]
    // [1 2 1]
    // [0 0 0]
    render(<Game width="3" height="3" bombs="2" bombPlanter={testBombPlanter} />);

    // the restart game button should be showing the playing icon
    expect(screen.getByText(GC.GAME_BUTTON_VALUES[GC.PLAYING]))
        .toBeInTheDocument();

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

    // the restart game button should still be showing the PLAYING icon
    expect(screen.getByText(GC.GAME_BUTTON_VALUES[GC.PLAYING]))
        .toBeInTheDocument();

    // restart game
    userEvent.click(screen.getByText(GC.GAME_BUTTON_VALUES[GC.PLAYING]));

    // the restart game button should be showing the playing icon
    expect(screen.getByText(GC.GAME_BUTTON_VALUES[GC.PLAYING]))
        .toBeInTheDocument();

    // tiles should be hidden again
    expect(screen.getByTestId('t0_0')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t0_1')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t0_2')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t1_0')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t1_1')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t1_2')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t2_0')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t2_1')).toHaveClass('hiddenTile');
    expect(screen.getByTestId('t2_2')).toHaveClass('hiddenTile');
});
