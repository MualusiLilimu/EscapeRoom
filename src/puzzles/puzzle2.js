// Logic of the puzzle1 will be coded here, and of course you can add more files if we want to more puzzles
const puzzle2 = {
    solved:false,
    board: [1,2,3,4,5,6,7,8,-1]
}

function checkSolution(puzz){
    const board = puzz.board
    for(let i=1;i<=8;i++){
        if(board[i]!==i){
            return;
        }
    }
    puzz.solved=true;
}
