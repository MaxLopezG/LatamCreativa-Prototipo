import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const onFollowerCreated = functions.firestore
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

/**
 * Migration function to copy artistId to authorId for legacy projects.
 * 
 * This is a one-time callable function to migrate old projects that only have
 * artistId to also include authorId (the new standard field).
 * 
 * Call via Firebase Console or Admin SDK:
 * - Go to Firebase Console > Functions
 * - Or use: firebase functions:call migrateArtistIdToAuthorId
 * 
 * This function is idempotent - safe to run multiple times.
 */
export const migrateArtistIdToAuthorId = functions.https.onCall(async (data, context) => {
    // Require admin authentication (optional - uncomment for production)
    // if (!context.auth || !context.auth.token.admin) {
    //     throw new functions.https.HttpsError('permission-denied', 'Must be an admin');
    // }

    const dryRun = data?.dryRun === true;
    const batchSize = 500;
    let totalUpdated = 0;
    let totalSkipped = 0;
    let totalProcessed = 0;

    console.log(`Starting migration (dryRun: ${dryRun})`);

    // Query projects that have artistId but no authorId
    const projectsRef = db.collection('projects');
    let lastDoc: admin.firestore.DocumentSnapshot | null = null;

    while (true) {
        let query = projectsRef
            .orderBy(admin.firestore.FieldPath.documentId())
            .limit(batchSize);

        if (lastDoc) {
            query = query.startAfter(lastDoc);
        }

        const snapshot = await query.get();

        if (snapshot.empty) {
            break;
        }

        const batch = db.batch();
        let batchUpdates = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            totalProcessed++;

            // Skip if already has authorId
            if (data.authorId) {
                totalSkipped++;
                continue;
            }

            // Skip if no artistId either
            if (!data.artistId) {
                totalSkipped++;
                continue;
            }

            // Copy artistId to authorId
            if (!dryRun) {
                batch.update(doc.ref, { authorId: data.artistId });
            }
            batchUpdates++;
            totalUpdated++;

            console.log(`${dryRun ? '[DRY RUN] Would update' : 'Updating'} ${doc.id}: artistId=${data.artistId}`);
        }

        if (batchUpdates > 0 && !dryRun) {
            await batch.commit();
        }

        lastDoc = snapshot.docs[snapshot.docs.length - 1];

        // Safety limit
        if (totalProcessed > 10000) {
            console.warn('Reached safety limit of 10000 documents');
            break;
        }
    }

    const result = {
        success: true,
        dryRun,
        totalProcessed,
        totalUpdated,
        totalSkipped,
        message: dryRun
            ? `Dry run complete. Would update ${totalUpdated} projects.`
            : `Migration complete. Updated ${totalUpdated} projects.`
    };

    console.log('Migration result:', result);
    return result;
});
