"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onFollowerCreated = void 0;
const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
admin.initializeApp();
// const db = admin.firestore();
exports.onFollowerCreated = functions.firestore
    .document('users/{userId}/followers/{followerId}')
    .onCreate(async (snapshot, context) => {
    // Disabled to favor client-side implementation (users.ts) which handles date formatting correctly
    // and avoids duplicates.
    return null;
    /*
    const userId = context.params.userId;
    const followerData = snapshot.data();

    if (!followerData) {
        console.log('No data found');
        return null;
    }

    try {
        const notification = {
            type: 'follow',
            content: 'comenzó a seguirte',
            user: followerData.followerName,
            avatar: followerData.followerAvatar,
            link: `/user/${followerData.followerUsername}`,
            time: admin.firestore.FieldValue.serverTimestamp(),
            read: false
        };

        await db.collection('users').doc(userId).collection('notifications').add(notification);
        console.log(`Notification created for user ${userId}`);
    } catch (error) {
        console.error(error);
    }
    return null;
    */
});
//# sourceMappingURL=index.js.map