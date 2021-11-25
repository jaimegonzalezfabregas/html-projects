#pragma once
#include <vector>
#include "../BoardState.h"
#include "GlovalDef.h"

using namespace std;

class Piece
{
protected:
    Pos pos;
    bool alive;
    tPlayer owner;
    BoardState *board;

public:
    Piece(int x, int y, tPlayer owner)
    {
        this->pos = {x, y};
        this->owner = owner;
    }

    Piece(Pos pos, tPlayer owner)
    {
        this->pos = pos;
        this->owner = owner;
    }

    bool atPos(int x, int y)
    {
        return x == this->pos.x && y == this->pos.y;
    }

    bool atPos(Pos p)
    {
        return p.x == this->pos.x && p.y == this->pos.y;
    }

    tPlayer getOwner()
    {
        return owner;
    }

    void eat()
    {
        alive = false;
    }

    bool isAlive()
    {
        return alive;
    }

    bool moveTo(Pos p)
    {
        vector<Pos> moves = this->getMoves();
        if (find(moves.begin(), moves.end(), p) != moves.end())
        {
            this->x = p.x;
            this->y = p.y;
            return true;
        }
        return false;
    }

    virtual vector<Pos> getMoves() = 0;

    virtual void onDelete();
};

class Tower : Piece
{

    void dash(Pos dir, int lenght, vector<Pos> &ret)
    {
        for (int i = 0; i < lenght; i++)
        {
            Pos candidate = this->pos;
            candidate += dir * i;
            if (board->canPlayerMoveWithoutEatTo(this->owner, candidate))
            {
                ret.push_back(candidate);
            }
            else
            {
                if (board->canPlayerEatPieceAt(this->owner, candidate))
                {
                    ret.push_back(candidate);
                }
                break;
            }
        }
    }

    virtual vector<Pos> getMoves()
    {
        vector<Pos> ret;

        dash({0, 1}, board->getHeight(), ret);
        dash({0, -1}, board->getHeight(), ret);
        dash({1, 0}, board->getWidth(), ret);
        dash({-1, 0}, board->getWidth(), ret);

        return ret;
    }
};

class Pawn : Piece
{
    virtual vector<Pos> getMoves()
    {
        vector<Pos> ret;

        Pos front = {this->pos.x, this->pos.y + board->playerDirection(this->owner)};
        Pos eatRight = {this->pos.x + 1, this->pos.y + board->playerDirection(this->owner)};
        Pos eatLeft = {this->pos.x - 1, this->pos.y + board->playerDirection(this->owner)};

        if (board->canPlayerMoveWithoutEatTo(this->owner, front))
            ret.push_back(front);
        if (board->canPlayerEatPieceAt(this->owner, eatRight))
            ret.push_back(eatRight);
        if (board->canPlayerEatPieceAt(this->owner, eatLeft))
            ret.push_back(eatLeft);

        return ret;
    }
};