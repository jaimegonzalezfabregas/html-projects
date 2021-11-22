#pragma once
#include <vector>
#include "../Board.h"
#include "../Move.h"
using namespace std;

class Piece
{
private:
    int x;
    int y;
    bool alive;
    Board *board;

public:
    Piece(int x, int y)
    {
        this->x = x;
        this->y = y;
    }

    bool atPos(int x, int y)
    {
        return x == this->x && y == this->y;
    }

    void getEaten(){
        alive = false;
    }

    bool isAlive(){
        return alive;
    }

    virtual vector<Move> getMoves() = 0;

    virtual void onDelete();
};
