♟️ Chess Game
A simple yet functional chess game built from scratch.
This project focuses on the core mechanics of chess while keeping the codebase lightweight and easy to expand.

✨ Features
Chessboard Rendering: Fully responsive, interactive chessboard.

Coordinates Display: Ranks (1–8) and files (a–h) are shown clearly.

Legal Piece Movement: All pieces can move and capture following standard chess rules.

Square Highlighting: Selected piece's square is highlighted for better UX.

Hint Squares: After selecting a piece, all possible legal move squares are visually hinted.

FEN Loading: Load any game position instantly using a valid FEN (Forsyth–Edwards Notation) string.

Move Validation: Movement respects chess rules such as piece-specific movement, captures, and blocking by other pieces.

(More minor improvements may exist that reflect attention to detail and user experience.)

🚧 Upcoming Features (TODOs)
Check and Checkmate Detection: Warn or end the game when a king is in check or checkmated.

Stalemate and Draw Handling: Detect stalemates, threefold repetitions, insufficient material, etc.

Castling: Implement short and long castling rules.

En Passant: Add support for the special en passant capture move.

Pawn Promotion: Allow pawns to promote when reaching the final rank.

Move History: Keep track of all moves made during the game.

Undo/Redo Moves: Support undoing and redoing moves.

Basic AI Opponent: (Optional) Play against a simple computer opponent.

Multiplayer Support: Play against another human on the same device or over a network.

UI/UX Improvements: Animations, better highlighting, sound effects, and piece dragging.

Saving & Loading Games: Save game progress locally or via cloud.

Analysis Mode: View all legal moves from any position without playing.

📦 Installation
bash
Copy
Edit
git clone https://github.com/your-username/your-chess-repo.git
cd your-chess-repo
npm install   # or yarn
npm run dev   # or yarn dev
🛠️ Built With
[Your stack here, e.g., React / TypeScript / JavaScript / HTML5 Canvas]

🤝 Contributions
Contributions, suggestions, and issues are welcome!
Please fork the repository and open a pull request or issue if you have something to add or fix.

📜 License
This project is licensed under the MIT License.
