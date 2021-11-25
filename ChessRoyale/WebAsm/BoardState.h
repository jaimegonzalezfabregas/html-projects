#pragma once
#include <vector>
#include "Piece.h"
#include "GlovalDef.h"
#include "algorithm"
class BoardState
{
public:
    BoardState(int width, int height)
    {
        this->nextTurn = BLUE;
        this->width = width;
        this->height = height;
    }
    BoardState(int width, int height, tPlayer currentTurn, vector<Piece> piecesBlue, vector<Piece> piecesRed)
    {
        this->nextTurn = !currentTurn;
        this->width = width;
        this->height = height;
        this->piecesBlue = piecesBlue;
        this->piecesRed = piecesRed;
    }

    vector<BoardState> getNextBoards()
    {
        auto piecesThatCanMove = *getPiecesOfPlayer(nextTurn);
        vector<BoardState> ret;
        for (int i = 0; i < piecesThatCanMove.size(); i++)
        {
            Piece *p = &piecesThatCanMove[i];
            vector<Pos> moves = p->getMoves();

            for (Pos m : moves)
            {
                ret.push_back(this->GetMovedBoard(m, p));
            }
        }
    }

    Piece *getPieceAtPos(Pos p, vector<Piece> v)
    {
        if (!insideOfBounds(p))
            return 0;
        for (int i = 0; i < v.size(); i++)
        {
            if (v[i].atPos(p))
            {
                return &v[i];
            }
        }
        return 0;
    }

    Piece *getPieceAtPos(Pos p)
    {
        if (!insideOfBounds(p))
            return 0;
        Piece *B = getPieceAtPos(p, piecesBlue);
        Piece *R = getPieceAtPos(p, piecesRed);
        return B == 0 ? R : B;
    }

    bool insideOfBounds(Pos pos)
    {
        return pos.x >= 0 && pos.x < this->width && pos.y >= 0 && pos.y < this->height;
    }

    bool canPlayerMoveTo(tPlayer player, Pos pos)
    {
        Piece *p = getPieceAtPos(pos);
        return p == 0 || p->getOwner() != player;
    }

    bool canPlayerMoveWithoutEatTo(tPlayer player, Pos pos)
    {
        if (!insideOfBounds(pos))
            return false;
        Piece *p = getPieceAtPos(pos);
        if (p == 0)
            return true;
        return false;
    }

    bool canPlayerEatPieceAt(tPlayer player, Pos pos)
    {
        if (!insideOfBounds(pos))
            return false;
        Piece *p = getPieceAtPos(pos);
        if (p == 0)
            return false;
        if (player != p->getOwner())
        {
            return true;
        }
        return false;
    }

    bool playerEatsPieceAt(tPlayer player, Pos pos)
    {
        Piece *p = getPieceAtPos(pos);
        if (player != p->getOwner())
        {
            p->eat();
            return true;
        }
        return false;
    }

    bool movePiece(Pos pos, Piece *p, tPlayer player)
    {
        if (p->getOwner() == player)
        {
            this->playerEatsPieceAt(player, pos);
            return p->moveTo(pos);
        }
        return true;
    }

    int getHeight()
    {
        return height;
    }

    int getWidth()
    {
        return width;
    }

    int playerDirection(tPlayer player)
    {
        return player == BLUE ? -1 : 1;
    }

    int evaluate(int r, tPlayer perspective)
    {
        if (r == 0)
            return euristic(perspective);
    }

    void placePieceAt(Pos p, int code, tPlayer owner)
    {
        getPiecesOfPlayer(owner)->push_back(PieceFactory::create(p,code,owner));
    }

    void step(tPlayer mover){
        
    }

private:
    int width;
    int height;
    tPlayer nextTurn;
    vector<Piece> piecesBlue;
    vector<Piece> piecesRed;

    vector<Piece> *getPiecesOfPlayer(tPlayer p)
    {
        return p == BLUE ? &piecesBlue : &piecesRed;
    }

    BoardState GetMovedBoard(Pos m, Piece *p)
    {
        BoardState ret(width, height, nextTurn, piecesBlue, piecesRed);
        ret.movePiece(m, p, nextTurn);
        return ret;
    }

    int euristic(tPlayer perspective)
    {
        return sumValues(getPiecesOfPlayer(perspective)) - sumValues(getPiecesOfPlayer(!perspective));
    }

    int sumValues(vector<Piece> *v)
    {
        int ret = 0;
        for (int i = 0; i < v->size(); i++)
        {
            ret += (*v)[i].getValue();
        }
        return ret;
    }
};
