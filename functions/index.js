const { onCall, HttpsError } = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const databaseId = 'ai-studio-5354cc84-ebb9-46fb-aa8f-ce998e1a5b4a';

/**
 * deleteUserAccount:
 * Deletes a user from both Firestore and Firebase Auth.
 */
exports.deleteUserAccount = onCall({ region: 'asia-southeast1' }, async (request) => {
  console.log('deleteUserAccount v7 started');
  
  try {
    // Initialize services inside handler for resilience
    const app = admin.apps.length === 0 ? admin.initializeApp() : admin.app();
    const db = getFirestore(app, databaseId);
    const auth = admin.auth(app);

    // 1. Authentication Check
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be logged in.');
    }

    const adminEmail = request.auth.token.email;
    const adminUid = request.auth.uid;
    
    if (!adminEmail) {
      throw new HttpsError('unauthenticated', 'Admin email missing from token.');
    }

    // 2. Authorization Check
    const isMaster = adminEmail.toLowerCase() === 'aungsoe366@gmail.com';
    
    if (!isMaster) {
      // Check if the caller exists in the 'users' collection and has admin/owner role
      let adminDoc = await db.collection('users').doc(adminEmail.toLowerCase()).get();
      if (!adminDoc.exists) {
        adminDoc = await db.collection('users').doc(adminUid).get();
      }

      if (!adminDoc.exists) {
        console.error(`Admin record not found for ${adminEmail} or ${adminUid}`);
        throw new HttpsError('permission-denied', `Admin record not found.`);
      }
      
      const adminData = adminDoc.data();
      if (adminData.role !== 'super_admin' && adminData.role !== 'owner') {
        console.error(`Insufficient role for ${adminEmail}: ${adminData.role}`);
        throw new HttpsError('permission-denied', `Insufficient permissions.`);
      }
    }

    // 3. Input Validation
    const { targetEmail } = request.data;
    if (!targetEmail) {
      throw new HttpsError('invalid-argument', 'targetEmail is required.');
    }

    // Prevent self-deletion
    if (targetEmail.toLowerCase() === adminEmail.toLowerCase()) {
      throw new HttpsError('permission-denied', 'You cannot delete your own account.');
    }

    console.log(`Attempting to delete user: ${targetEmail}`);

    // 4. Find Target User
    const userRef = db.collection('users').doc(targetEmail.toLowerCase());
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.warn(`Target user ${targetEmail} not found in Firestore.`);
      throw new HttpsError('not-found', `User ${targetEmail} not found.`);
    }

    const targetData = userDoc.data();
    const targetRole = targetData.role;
    const targetUid = targetData.uid;

    // 5. Role-Based Protection (Server-Side)
    // Only master can delete super_admins
    if (targetRole === 'super_admin' && !isMaster) {
      throw new HttpsError('permission-denied', 'Only the master account can delete Super Admin accounts.');
    }

    // Owners can be deleted by Super Admins (including master)
    // But regular Owners cannot delete other Owners
    if (targetRole === 'owner') {
      const callerDoc = await db.collection('users').doc(adminEmail.toLowerCase()).get();
      const callerData = callerDoc.data() || {};
      const callerIsSuperAdmin = isMaster || callerData.role === 'super_admin';
      
      if (!callerIsSuperAdmin) {
        throw new HttpsError('permission-denied', 'Only Super Admins can delete Owner accounts.');
      }
    }

    // 6. Execution: Delete from Firestore
    await userRef.delete();
    console.log(`Firestore document deleted for ${targetEmail}`);

    // 6. Execution: Delete from Auth
    if (targetUid) {
      try {
        await auth.deleteUser(targetUid);
        console.log(`Auth user deleted for UID: ${targetUid}`);
      } catch (authErr) {
        console.error(`Auth deletion failed for ${targetEmail} (UID: ${targetUid}):`, authErr);
        // We don't throw here because the Firestore document is already gone, 
        // and the user might have been deleted from Auth manually or already.
      }
    }

    return { success: true, message: `Successfully deleted ${targetEmail}` };

  } catch (error) {
    console.error('Error in deleteUserAccount:', error);
    
    if (error instanceof HttpsError) throw error;

    // Return detailed error message for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : 'No stack trace';
    
    throw new HttpsError('internal', `Cloud Function Error: ${errorMessage}. Details: ${errorStack}`);
  }
});

/**
 * reactivateUser: Handles sign-up for previously deleted users.
 */
exports.reactivateUser = onCall({ region: 'asia-southeast1' }, async (request) => {
  console.log('reactivateUser started');
  try {
    const app = admin.apps.length === 0 ? admin.initializeApp() : admin.app();
    const db = getFirestore(app, databaseId);
    const auth = admin.auth(app);

    const { phone, password, name, dob } = request.data;
    if (!phone || !password || !name || !dob) {
      throw new HttpsError('invalid-argument', 'Missing required fields.');
    }

    const dummyEmail = `${phone}@nailpro.com`;
    const userRef = db.collection('users').doc(dummyEmail);
    const userDoc = await userRef.get();

    // Create or update Auth user
    let newUser;
    try {
      newUser = await auth.createUser({
        email: dummyEmail,
        password: password,
        displayName: name
      });
    } catch (authErr) {
      if (authErr.code === 'auth/email-already-exists') {
        // If user exists in Auth but marked as deleted in Firestore, we might need to update password
        const existingUser = await auth.getUserByEmail(dummyEmail);
        await auth.updateUser(existingUser.uid, { password, displayName: name });
        newUser = existingUser;
      } else {
        throw authErr;
      }
    }

    await userRef.set({
      uid: newUser.uid,
      email: dummyEmail,
      phone: phone,
      name: name,
      dob: dob,
      status: 'active',
      role: 'client',
      mustChangePassword: false,
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: userDoc.exists ? userDoc.data().createdAt : FieldValue.serverTimestamp()
    }, { merge: true });

    return { success: true, uid: newUser.uid };
  } catch (error) {
    console.error('Error in reactivateUser:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', error.message);
  }
});

/**
 * verifyIdentityAndResetPassword
 */
exports.verifyIdentityAndResetPassword = onCall({ region: 'asia-southeast1' }, async (request) => {
  console.log('verifyIdentityAndResetPassword started');
  try {
    const app = admin.apps.length === 0 ? admin.initializeApp() : admin.app();
    const db = getFirestore(app, databaseId);
    const auth = admin.auth(app);

    const { name, phone, dob, newPassword } = request.data;
    if (!name || !phone || !dob || !newPassword) {
      throw new HttpsError('invalid-argument', 'Missing required fields.');
    }

    const querySnapshot = await db.collection('users')
      .where('phone', '==', phone)
      .where('dob', '==', dob)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      throw new HttpsError('not-found', 'Information does not match our records.');
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (userData.name.toLowerCase() !== name.toLowerCase()) {
      throw new HttpsError('not-found', 'Information does not match our records.');
    }

    await auth.updateUser(userData.uid, { password: newPassword });
    await userDoc.ref.update({
      mustChangePassword: false,
      updatedAt: FieldValue.serverTimestamp()
    });

    return { success: true, message: 'Password updated successfully.' };
  } catch (error) {
    console.error('Error in verifyIdentityAndResetPassword:', error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', error.message);
  }
});

/**
 * pingFunctions: Simple test function
 */
exports.pingFunctions = onCall({ region: 'asia-southeast1' }, async () => {
  let dbStatus = 'unknown';
  try {
    const app = admin.apps.length === 0 ? admin.initializeApp() : admin.app();
    const db = getFirestore(app, databaseId);
    await db.collection('users').limit(1).get();
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = `failed: ${e.message}`;
  }
  return { 
    status: 'online', 
    timestamp: new Date().toISOString(), 
    databaseId,
    dbStatus,
    region: 'asia-southeast1'
  };
});
