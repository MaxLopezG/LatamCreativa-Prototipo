import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const onFollowerCreated = functions.firestore
    .document('users/{userId}/followers/{followerId}')
    .onCreate(async (snapshot, context) => {
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
    });
