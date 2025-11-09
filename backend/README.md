🧱 Root Level (backend/)
File / Folder	Purpose
src/	The main source folder — all your backend logic lives here.
.env	Holds environment variables (like database URL, API keys, and PORT). Never commit it to Git.
.gitignore	Tells Git which files/folders to ignore (like node_modules, .env).
package.json	Keeps track of your dependencies, scripts, and project metadata.
README.md	Documentation about your backend — setup steps, usage, API reference, etc.
🧩 Inside /src

This is the core logic of your backend — all organized by responsibility.

1. config/

Purpose: Holds configuration files (database, third-party services, etc.)

db.js → connects to MongoDB using Mongoose and handles connection success/errors.

2. controllers/

Purpose: Contains logic for each API endpoint.

userController.js → defines what happens when someone calls a user-related route (e.g., get users, create user, etc.).

Later you can add roomController.js, testController.js, etc.
Each controller handles the business logic, not routing.

3. models/

Purpose: Defines data structures (schemas) for MongoDB collections.

User.js → defines user fields like name, email, role.

Room.js → defines each testing room (admin, participants, active state).

Result.js → defines test result data for each user.

These models connect your code to MongoDB collections.

4. routes/

Purpose: Handles API endpoints and maps them to controllers.

userRoutes.js → all /api/users endpoints (like GET users).

roomRoutes.js → all /api/rooms endpoints (like create/join room).

Keeps routes separate from logic — clean and maintainable.

5. sockets/

Purpose: Manages real-time communication using WebSockets.

socketHandler.js → handles socket connections, disconnections, messages, broadcasts, etc.

Used for live test updates, participant join/leave, leaderboards, etc.

6. utils/

Purpose: Reusable helper functions.

logger.js → utility for custom logs, error tracking, or reusable logic like formatting, validation, etc.

Keeps your controllers clean and DRY (Don’t Repeat Yourself).

7. app.js

Purpose: Initializes the Express application.

Sets up middleware (cors, express.json), loads routes, and defines base routes like /api/users, /api/rooms.

It’s your main API layer.

8. server.js

Purpose: The entry point of your backend.

Loads environment variables, connects to MongoDB, starts the HTTP server, and attaches the WebSocket server.

It’s where everything comes together and the server actually runs.

⚙️ How It All Connects
server.js  →  starts server + websocket
   ↓
app.js     →  loads express app + routes
   ↓
routes/    →  maps HTTP endpoints
   ↓
controllers/ →  runs the logic for those routes
   ↓
models/    →  defines and interacts with MongoDB
   ↓
config/db.js →  connects to database


Meanwhile:

sockets/ handles live events (real-time messages).

utils/ provides reusable helpers.