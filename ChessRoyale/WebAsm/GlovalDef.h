#pragma once

typedef enum
{
    RED,
    BLUE
} tPlayer;

tPlayer operator!(tPlayer p)
{
    return p == BLUE ? RED : BLUE;
}

struct Pos
{
    int x;
    int y;
};
