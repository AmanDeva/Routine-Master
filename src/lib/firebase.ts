import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection,
  doc,
  query, 
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
  QuerySnapshot,
  DocumentData,
  setDoc,
  getDoc,
  where,
  QueryConstraint
} from 'firebase/firestore';
import { Task } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyBbgk5wpYQDC_v_eRnD-SbOq4sn8W3zSl8",
  authDomain: "routine-master-62266.firebaseapp.com",
  databaseURL: "https://routine-master-62266-default-rtdb.firebaseio.com",
  projectId: "routine-master-62266",
  storageBucket: "routine-master-62266.firebasestorage.app",
  messagingSenderId: "813159736212",
  appId: "1:813159736212:web:019faf13d8b09d9ee8e581",
  measurementId: "G-7QPWCXRTZP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

function processQuerySnapshot(querySnapshot: QuerySnapshot<DocumentData>): Task[] {
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() || null,
    updatedAt: doc.data().updatedAt?.toDate?.() || null
  })) as Task[];
}

interface CreateTaskData {
  title: string;
  time: string;
  completed: boolean;
  date: string;
  isRecurring: boolean;
}

async function ensureUserDocument(userId: string) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error ensuring user document:', error);
    throw new Error('Failed to initialize user data');
  }
}

function getUserTasksCollection(userId: string) {
  return collection(db, 'users', userId, 'tasks');
}

export async function createTask(taskData: CreateTaskData): Promise<Task> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to create tasks');
  }

  try {
    await ensureUserDocument(user.uid);

    const tasksRef = getUserTasksCollection(user.uid);
    const task = {
      ...taskData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(tasksRef, task);
    return {
      id: docRef.id,
      ...task,
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Task;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task. Please try again.');
  }
}

export async function updateTask(taskId: string, taskData: Partial<Task>): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to update tasks');
  }

  try {
    const taskRef = doc(getUserTasksCollection(user.uid), taskId);
    await updateDoc(taskRef, {
      ...taskData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task. Please try again.');
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to delete tasks');
  }

  try {
    const taskRef = doc(getUserTasksCollection(user.uid), taskId);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw new Error('Failed to delete task. Please try again.');
  }
}

export async function getTasks(date: string): Promise<Task[]> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('You must be logged in to view tasks');
  }

  try {
    await ensureUserDocument(user.uid);
    const tasksRef = getUserTasksCollection(user.uid);
    
    // For calendar view (YYYY-MM format)
    if (date.length === 7) {
      const [year, month] = date.split('-').map(Number);
      const startDate = `${date}-01`;
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

      const constraints: QueryConstraint[] = [
        where('isRecurring', '==', false),
        where('date', '>=', startDate),
        where('date', '<', endDate)
      ];

      const q = query(tasksRef, ...constraints);
      const querySnapshot = await getDocs(q);
      const tasks = processQuerySnapshot(querySnapshot);
      
      // Sort tasks by date and time after fetching
      return tasks.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
      });
    }
    
    // For daily view
    const dailyQuery = query(tasksRef, orderBy('time'));
    const querySnapshot = await getDocs(dailyQuery);
    const allTasks = processQuerySnapshot(querySnapshot);
    
    // Filter tasks for daily view
    return allTasks.filter(task => {
      if (task.isRecurring) return true;
      return task.date === date;
    });
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw new Error('Failed to load tasks. Please try again.');
  }
}