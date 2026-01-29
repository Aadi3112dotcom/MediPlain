import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getBytes, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { encryptData, decryptData } from '../utils/encryption';

/**
 * Save patient health data
 */
export const savePatientData = async (patientId, healthData) => {
  try {
    const encryptedData = encryptData(healthData);
    
    await setDoc(doc(db, 'patients', patientId), {
      ...healthData,
      encryptedData,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    
    return { success: true, patientId };
  } catch (error) {
    console.error('Error saving patient data:', error);
    throw error;
  }
};

/**
 * Get patient health data
 */
export const getPatientData = async (patientId) => {
  try {
    const docSnap = await getDoc(doc(db, 'patients', patientId));
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting patient data:', error);
    throw error;
  }
};

/**
 * Update patient health data
 */
export const updatePatientData = async (patientId, updates) => {
  try {
    const encryptedData = encryptData(updates);
    
    await updateDoc(doc(db, 'patients', patientId), {
      ...updates,
      encryptedData,
      updatedAt: serverTimestamp()
    });
    
    return { success: true, patientId };
  } catch (error) {
    console.error('Error updating patient data:', error);
    throw error;
  }
};

/**
 * Upload medical report
 */
export const uploadMedicalReport = async (patientId, file, metadata = {}) => {
  try {
    const fileName = `${patientId}/${Date.now()}_${file.name}`;
    const fileRef = ref(storage, `medical-reports/${fileName}`);
    
    const snapshot = await uploadBytes(fileRef, file);
    
    // Save report metadata to Firestore
    await addDoc(collection(db, 'patients', patientId, 'reports'), {
      fileName: file.name,
      uploadedAt: serverTimestamp(),
      fileSize: file.size,
      storagePath: snapshot.metadata.fullPath,
      ...metadata
    });
    
    return {
      success: true,
      path: snapshot.metadata.fullPath,
      name: file.name
    };
  } catch (error) {
    console.error('Error uploading medical report:', error);
    throw error;
  }
};

/**
 * Get patient reports
 */
export const getPatientReports = async (patientId) => {
  try {
    const reportsRef = collection(db, 'patients', patientId, 'reports');
    const q = query(reportsRef);
    const querySnapshot = await getDocs(q);
    
    const reports = [];
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return reports;
  } catch (error) {
    console.error('Error getting patient reports:', error);
    throw error;
  }
};

/**
 * Save emergency access record
 */
export const saveEmergencyAccess = async (patientId, accessData) => {
  try {
    const encryptedAccessData = encryptData(accessData);
    
    const docRef = await addDoc(collection(db, 'patients', patientId, 'emergencyAccess'), {
      ...accessData,
      encryptedData: encryptedAccessData,
      accessedAt: serverTimestamp(),
      expiresAt: new Date(accessData.expiresAt)
    });
    
    return {
      success: true,
      accessId: docRef.id
    };
  } catch (error) {
    console.error('Error saving emergency access:', error);
    throw error;
  }
};

/**
 * Get emergency access record
 */
export const getEmergencyAccess = async (patientId, accessId) => {
  try {
    const docSnap = await getDoc(
      doc(db, 'patients', patientId, 'emergencyAccess', accessId)
    );
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    
    return null;
  } catch (error) {
    console.error('Error getting emergency access:', error);
    throw error;
  }
};

/**
 * Delete report
 */
export const deleteReport = async (patientId, reportId, storagePath) => {
  try {
    // Delete from storage
    if (storagePath) {
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
    }
    
    // Delete from Firestore
    await deleteDoc(doc(db, 'patients', patientId, 'reports', reportId));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};

/**
 * Save medication reminder
 */
export const saveMedicationReminder = async (patientId, reminder) => {
  try {
    const docRef = await addDoc(collection(db, 'patients', patientId, 'reminders'), {
      ...reminder,
      createdAt: serverTimestamp(),
      status: 'active'
    });
    
    return {
      success: true,
      reminderId: docRef.id
    };
  } catch (error) {
    console.error('Error saving medication reminder:', error);
    throw error;
  }
};

/**
 * Get all reminders for patient
 */
export const getPatientReminders = async (patientId) => {
  try {
    const remindersRef = collection(db, 'patients', patientId, 'reminders');
    const q = query(remindersRef, where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    
    const reminders = [];
    querySnapshot.forEach((doc) => {
      reminders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return reminders;
  } catch (error) {
    console.error('Error getting patient reminders:', error);
    throw error;
  }
};
