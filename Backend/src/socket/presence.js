import { SOCKET_EVENTS } from "./Config/socketEvents.js";
import { redis } from "../../index.js";

// *** SOCKET-PRESENCE METHODS ***  

const listenForOnlineUsersEvent = (io, socket) => {
    socket.on(SOCKET_EVENTS.PRESENCE_ONLINE, async({ userId, conversationIds }) => {
        if(userId && Array.isArray(conversationIds)) {
            // Update Redis for each conversation
            for (const conversationId of conversationIds) {
                await redis.hset(`presence:${conversationId}:${userId}`, {
                    status: "online",
                    lastSeen: Date.now(),
                });

                await redis.expire(`presence:${conversationId}:${userId}`, 120);

                // Fetch all members in this conversation
                const keys = await redis.keys(`presence:${conversationId}:*`);
                const members = [];
                for (const key of keys) {
                    const data = await redis.hgetall(key);
                    members.push({ userId: key.split(":")[2], ...data });
                }

                io.to(conversationId).emit(SOCKET_EVENTS.PRESENCE_ONLINE, { conversationId, members });
            }
        }
    })
}

const listenForOfflineUsersEvent = (io, socket) => {
    socket.on(SOCKET_EVENTS.PRESENCE_OFFLINE, async({ userId, conversationIds }) => {
        if(userId && Array.isArray(conversationIds)) {
            // Update Redis for each conversation
            for (const conversationId of conversationIds) {
                await redis.hset(`presence:${conversationId}:${userId}`, {
                    status: "offline",
                    lastSeen: Date.now(),
                });

                // Fetch all members in this conversation
                const keys = await redis.keys(`presence:${conversationId}:*`);
                const members = [];
                for (const key of keys) {
                    const data = await redis.hgetall(key);
                    members.push({ userId: key.split(":")[2], ...data });
                }

                io.to(conversationId).emit(SOCKET_EVENTS.PRESENCE_OFFLINE, { conversationId, members });
            }
        }
    })
}

const listenForPresencePingEvent = (io, socket) => {
    socket.on(SOCKET_EVENTS.PRESENCE_PING, async ({ userId, conversationIds }) => {
        for (const conversationId of conversationIds) {
            await redis.hset(`presence:${conversationId}:${userId}`, {
                status: "online",
                lastSeen: Date.now()
            });
            
            await redis.expire(`presence:${conversationId}:${userId}`, 120);
        }
    });

}

export {
    listenForOnlineUsersEvent,
    listenForOfflineUsersEvent,
    listenForPresencePingEvent
}