#pragma once
#include <vector>
#include "Pieces/Piece.h"

class Piece;

class Board
{
public:
    vector<Piece *> pieces;

    Board(int width, int height)
    {
        this->width = width;
        this->height = height;
    }
    int width;
    int height;

    Piece *PieceAtPos(int x, int y)
    {
        for (Piece *p : pieces)
        {
            if (p->atPos(x, y))
                return p;
        }
        return 0;
    }

    void clearDead()
    {
        vector<Piece *> buff;

        for( auto it = pieces.begin() ; it < pieces.end(); it++ ){
            if( !(*it)->isAlive() ){
                pieces.erase(it);
            }
        }
    }
};
