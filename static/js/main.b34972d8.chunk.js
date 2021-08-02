(this["webpackJsonpreact-game-snake"]=this["webpackJsonpreact-game-snake"]||[]).push([[0],[,,,,,function(e,r,n){e.exports={GameBoardCell:"GameBoardCell_GameBoardCell__2xIBz",FoodCell:"GameBoardCell_FoodCell__1MRRB",SnakeBodyPart:"GameBoardCell_SnakeBodyPart__2X-Qo"}},,,,,function(e,r,n){e.exports={GameBoard:"GameBoard_GameBoard__1-rkU"}},function(e,r,n){e.exports={GameOver:"GameOver_GameOver__1baa_"}},function(e,r,n){e.exports={RestartGame:"RestartGame_RestartGame__3Ph1C"}},function(e,r,n){e.exports={Score:"Score_Score__cfuHX"}},,,,,function(e,r,n){},,function(e,r,n){"use strict";n.r(r);var a=n(1),t=n.n(a),o=n(9),c=n.n(o),s=(n(18),n(7)),d=n(8),u=n(2),i=n(5),l=n.n(i),m=n(0),f=function(e){var r=e.isFoodCell,n=e.isSnakeBodyPart,a=[l.a.GameBoardCell];return r?a.push(l.a.FoodCell):n&&a.push(l.a.SnakeBodyPart),Object(m.jsx)("div",{className:a.join(" ")})},O=function(e){var r=e.totalCellAmount,n=e.foodCellIndex,a=e.snakeBodyIndexes,t=e.isMaxScoreReached;return new Array(r).fill().map((function(e,r){var o=a.some((function(e){return e===r}));return t&&(o=!0),Object(m.jsx)(f,{isFoodCell:n===r&&!t,isSnakeBodyPart:o},r)}))},j=n(10),C=n.n(j),b=function(e){var r=e.gameBoardRows,n=e.gameBoardColumns,a=e.totalCellAmount,t=e.foodCellIndex,o=e.snakeBodyIndexes,c=e.isMaxScoreReached,s={gridTemplateRows:"repeat(".concat(r,", 1fr)"),gridTemplateColumns:"repeat(".concat(n,", 1fr)")};return Object(m.jsx)("div",{style:s,className:C.a.GameBoard,children:Object(m.jsx)(O,{totalCellAmount:a,snakeBodyIndexes:o,foodCellIndex:t,isMaxScoreReached:c})})},_=n(11),x=n.n(_),E=function(){return Object(m.jsx)("h2",{className:x.a.GameOver,children:"GAME OVER"})},I=n(12),y=n.n(I),k=function(e){var r=e.restartHandler;return Object(m.jsx)("button",{onClick:r,className:y.a.RestartGame,type:"button",children:"Restart Game"})},v=n(13),G=n.n(v),p=function(e){var r=e.score,n=e.isMaxScoreReached;return Object(m.jsxs)("h2",{className:G.a.Score,children:[n?"Congratulations you reached maximum score ":"Current Score: ",r]})},R={snakeBodyCords:[{row:5,column:6,direction:"UP"},{row:6,column:6,direction:"UP"}],snakeHeadDirection:"UP",gameScore:0,foodCellIndex:null,gameOver:!1,isMaxScoreReached:!1,restartGame:{}},S=function(e,r){var n=r.type,a=r.payload;switch(n){case"SET_FOOD_CELL_INITIAL_INDEX":return B(e);case"CHANGE_SNAKE_HEAD_DIRECTION":return A(e,a);case"RUN_GAME_LOGIC":return M(e);case"RESTART_GAME":return h();default:throw new Error("Unknown action type provided!")}},h=function(){return Object(u.a)(Object(u.a)({},R),{},{restartGame:{}})},B=function(e){return Object(u.a)(Object(u.a)({},e),{},{foodCellIndex:D(e.snakeBodyCords)})},A=function(e,r){var n=Object(d.a)(e.snakeBodyCords);return n[0]=Object(u.a)(Object(u.a)({},n[0]),{},{direction:r}),Object(u.a)(Object(u.a)({},e),{},{snakeBodyCords:n,snakeHeadDirection:r})},N=function(){return Math.floor(110*Math.random())},g=function(e){return 11*(e.row-1)+e.column-1},w=function(e,r){return e.some((function(e){return g(e)===r}))},D=function(e){for(var r=N();w(e,r);)console.log("random index cell regenerate"),r=N();return r},T=function(e){return e.map((function(e){return g(e)}))},H=function(e){var r=e[0];return function(e){var r=e.row,n=e.column;return 0===r||11===r||0===n||12===n}(r)||function(e,r){for(var n=1;n<e.length;n++)if(g(e[n])===g(r))return!0}(e,r)},M=function(e){var r=e.snakeBodyCords,n=e.snakeHeadDirection,a=e.foodCellIndex,t=e.gameScore,o=function(e,r){for(var n,a=[],t=function(e,r,n){a.push({direction:e,row:r,column:n})},o=0;o<e.length;o++){var c=e[o],s=c.row,d=c.column,u=c.direction;switch(n=o>0?e[o-1].direction:r,u){case"UP":t(n,s-1,d);break;case"DOWN":t(n,s+1,d);break;case"LEFT":t(n,s,d-1);break;case"RIGHT":t(n,s,d+1)}}return a}(r,n);return function(e,r){var n=e[0];if(109===e.length&&g(n)===r)return!0}(o,a)?Object(u.a)(Object(u.a)({},e),{},{isMaxScoreReached:!0,gameScore:t+1}):H(o)?Object(u.a)(Object(u.a)({},e),{},{gameOver:!0}):function(e,r){return g(e)===r}(o[0],a)?function(e,r){var n=[r].concat(Object(d.a)(e.snakeBodyCords));return Object(u.a)(Object(u.a)({},e),{},{snakeBodyCords:n,foodCellIndex:D(n),gameScore:e.gameScore+1})}(e,o[0]):Object(u.a)(Object(u.a)({},e),{},{snakeBodyCords:o})},L=function(){var e=Object(a.useReducer)(S,R),r=Object(s.a)(e,2),n=r[0],t=r[1],o=Object(a.useState)(null),c=Object(s.a)(o,2),d=c[0],u=c[1],i=n.snakeBodyCords,l=n.snakeHeadDirection,f=n.gameScore,O=n.foodCellIndex,j=n.gameOver,C=n.isMaxScoreReached,_=n.restartGame,x=Object(a.useCallback)((function(e){var r="UP"===l||"DOWN"===l,n="LEFT"===l||"RIGHT"===l;switch(e.key){case"ArrowUp":n&&t({type:"CHANGE_SNAKE_HEAD_DIRECTION",payload:"UP"});break;case"ArrowDown":n&&t({type:"CHANGE_SNAKE_HEAD_DIRECTION",payload:"DOWN"});break;case"ArrowLeft":r&&t({type:"CHANGE_SNAKE_HEAD_DIRECTION",payload:"LEFT"});break;case"ArrowRight":r&&t({type:"CHANGE_SNAKE_HEAD_DIRECTION",payload:"RIGHT"})}}),[l]);return Object(a.useEffect)((function(){t({type:"SET_FOOD_CELL_INITIAL_INDEX"});var e=setInterval((function(){t({type:"RUN_GAME_LOGIC"})}),500);return u(e),function(){return clearInterval(e)}}),[_]),Object(a.useEffect)((function(){return(j||C)&&clearInterval(d),document.addEventListener("keydown",x,{once:!0}),function(){return document.removeEventListener("keydown",x,{once:!0})}}),[i]),Object(m.jsxs)(m.Fragment,{children:[j&&Object(m.jsx)(E,{}),Object(m.jsx)(p,{score:f,isMaxScoreReached:C}),j&&Object(m.jsx)(k,{restartHandler:function(){return function(e){e({type:"RESTART_GAME"})}(t)}}),Object(m.jsx)(b,{gameBoardRows:10,gameBoardColumns:11,totalCellAmount:110,foodCellIndex:O,isMaxScoreReached:C,snakeBodyIndexes:T(i)})]})},P=function(){return Object(m.jsx)(L,{})};c.a.render(Object(m.jsx)(t.a.StrictMode,{children:Object(m.jsx)(P,{})}),document.getElementById("root"))}],[[20,1,2]]]);
//# sourceMappingURL=main.b34972d8.chunk.js.map