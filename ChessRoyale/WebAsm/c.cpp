#include <emscripten.h>
#include <iostream>
#include <vector>
#include "BoardState.h"

using namespace std;

BoardState *board = 0;

int main()
{
    cout << "ready\n";
}

//EMSCRIPTEN_KEEPALIVE interface

void EMSCRIPTEN_KEEPALIVE resetBoard(int w, int h)
{
    if (board != 0)
        delete board;

    board = new BoardState(w, h);
}

int EMSCRIPTEN_KEEPALIVE getPieceAt(int x, int y)
{
    board->getPieceAtPos({x,y})->getCode();
}

void EMSCRIPTEN_KEEPALIVE placePieceAt(int x, int y, int code, int owner)
{
    board->placePieceAt({x, y}, code, owner == 0 ? BLUE : RED);
}

void EMSCRIPTEN_KEEPALIVE step(int player)
{

    board->step(player == 0 ? BLUE : RED);
}