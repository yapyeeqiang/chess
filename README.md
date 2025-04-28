# ♟️ Chess Game
A simple yet functional chess game built from scratch.
This project focuses on the core mechanics of chess while keeping the codebase lightweight and easy to expand.

![Chess Demo](https://github.com/user-attachments/assets/af4c436d-09c7-4daa-99f6-64de08f53141)


## ✨ Features
1. **Chessboard Rendering**: Fully responsive, interactive chessboard.

2. **Coordinates Display**: Ranks (1–8) and files (a–h) are shown clearly.

3. **Legal Piece Movement**: All pieces can move and capture following standard chess rules. (Including castling, and en passant!)

4. **Square Highlighting**: Selected piece's square is highlighted for better UX.

5. **Hint Squares**: After selecting a piece, all possible legal move squares are visually hinted.

6. **FEN Loading**: Load any game position instantly using a valid FEN (Forsyth–Edwards Notation) string.

(More minor improvements may exist that reflect attention to detail and user experience.)

## 🚧 Upcoming Features (TODOs)
1. **Check and Checkmate Detection**: Warn or end the game when a king is in check or checkmated.

2. **Stalemate and Draw Handling**: Detect stalemates, threefold repetitions, insufficient material, etc.

3. **Pawn Promotion**: Allow pawns to promote when reaching the final rank.

4. **Move History**: Keep track of all moves made during the game.

5. **Undo/Redo Moves**: Support undoing and redoing moves.

6. **Basic AI Opponent**: Play against a simple computer opponent.

7. **Multiplayer Support**: Play against another human on the same device or over a network.

8. **UI/UX Improvements**: Animations, better highlighting, sound effects, and piece dragging.

9. **Saving & Loading Games**: Save game progress locally or via cloud.

10. **Analysis Mode**: View all legal moves from any position without playing.

## 📦 Installation
```bash
git clone https://github.com/yapyeeqiang/chess.git
cd chess
npm install   # or yarn
npm run dev   # or yarn dev
```

## 🛠️ Built With
- Next.js (App Router)
- TypeScript
- TailwindCSS

## 🤝 Contributions
Contributions, suggestions, and issues are welcome!
Please fork the repository and open a pull request or issue if you have something to add or fix.

## 📜 License
This project is licensed under the MIT License.
