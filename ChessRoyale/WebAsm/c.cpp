#include <emscripten.h>
#include <iostream>
#include <vector>
#include "Board.h"

using namespace std;

Board *board = 0;

int main()
{
    cout << "ready\n";
}

//EMSCRIPTEN_KEEPALIVE interface

void EMSCRIPTEN_KEEPALIVE resetBoard(int w, int h)
{
    if (board != 0)
        delete board;

    board = new Board(w, h);
}

int EMSCRIPTEN_KEEPALIVE getPieceAt(int x, int y)
{
}

void EMSCRIPTEN_KEEPALIVE placePiece()
{
}

void EMSCRIPTEN_KEEPALIVE move(int player)
{
}