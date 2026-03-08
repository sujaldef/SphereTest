/**
 * Basic Socket.io setup for SphereTest.
 *
 * - Logs connections and disconnections
 * - Allows clients to join a "sphere room" by ID
 */

const registerSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}`);

        // Client requests to join a sphere room
        socket.on('join_sphere', (sphereId) => {
            if (!sphereId) return;

            socket.join(sphereId);
            console.log(`Socket ${socket.id} joined sphere room: ${sphereId}`);
        });

        socket.on('disconnect', () => {
            console.log(`❌ Socket disconnected: ${socket.id}`);
        });
    });
};

module.exports = registerSocketHandlers;

