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

Pos operator*(Pos a, int b)
{
    return {a.x * b, a.y * b};
}

Pos operator+(Pos a, Pos b)
{
    return {a.x + b.x, a.y + b.y};
}