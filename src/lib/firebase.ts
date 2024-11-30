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
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import { Task } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyBbgk5wpYQDC_v_eRnD-SbOq4sn8W3zSl8",
  authDomain: "routine-master-62266.firebaseapp.com",
  projectId: "routine-master-62266",
  storageBucket: "routine-master-62266.appspot.com",
  messagingSenderId: "813159736212",
  appId: "1:813159736212:web:019faf13d8b09d9ee8e581"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

async function setupPersistence() {
  let retries = 3;
  while (retries > 0) {
    try {
      await enableIndexedDbPersistence(db);
      break;
    } catch (err: any) {
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        break;
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser doesn\'t support persistence.');
        break;
      } else {
        retries--;
        if (retries === 0) {
          console.error('Failed to enable persistence after multiple attempts');
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}

setupPersistence();

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
  if (!userId) {
    throw new Error('User ID is required');
  }

  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    try {
      await setDoc(userRef, {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      throw new Error('Failed to initialize user data');
    }
  }
}

function getUserTasksCollection(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }
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
      updatedAt: serverTimestamp(),
      lastCompletedDate: null
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
    const updateData = {
      ...taskData,
      updatedAt: serverTimestamp()
    };

    if (taskData.completed) {
      updateData.lastCompletedDate = new Date().toISOString().split('T')[0];
    }

    await updateDoc(taskRef, updateData);
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
    const today = new Date().toISOString().split('T')[0];
    
    // For calendar view (YYYY-MM format)
    if (date.length === 7) {
      const startDate = `${date}-01`;
      const [year, month] = date.split('-').map(Number);
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

      try {
        // Get non-recurring tasks for the month
        const regularTasksQuery = query(
          tasksRef,
          where('isRecurring', '==', false),
          where('date', '>=', startDate),
          where('date', '<', endDate),
          where('completed', '==', false),
          orderBy('date'),
          orderBy('time')
        );

        // Get recurring tasks
        const recurringTasksQuery = query(
          tasksRef,
          where('isRecurring', '==', true),
          orderBy('time')
        );

        const [regularTasks, recurringTasks] = await Promise.all([
          getDocs(regularTasksQuery),
          getDocs(recurringTasksQuery)
        ]);

        const tasks = [
          ...processQuerySnapshot(regularTasks),
          ...processQuerySnapshot(recurringTasks).map(task => ({
            ...task,
            completed: task.lastCompletedDate === today
          }))
        ];

        return tasks.sort((a, b) => {
          if (a.date === b.date) {
            return a.time.localeCompare(b.time);
          }
          return a.date.localeCompare(b.date);
        });
      } catch (error: any) {
        if (error.code === 'failed-precondition') {
          const allTasks = await getDocs(query(tasksRef));
          const tasks = processQuerySnapshot(allTasks)
            .filter(task => {
              if (task.isRecurring) {
                task.completed = task.lastCompletedDate === today;
                return true;
              }
              return !task.completed && task.date >= startDate && task.date < endDate;
            });
          return tasks.sort((a, b) => a.time.localeCompare(b.time));
        }
        throw error;
      }
    }
    
    // For daily view
    try {
      // Get non-recurring tasks for the specific date
      const regularTasksQuery = query(
        tasksRef,
        where('isRecurring', '==', false),
        where('date', '==', date),
        where('completed', '==', false),
        orderBy('time')
      );

      // Get recurring tasks
      const recurringTasksQuery = query(
        tasksRef,
        where('isRecurring', '==', true),
        orderBy('time')
      );

      const [regularTasks, recurringTasks] = await Promise.all([
        getDocs(regularTasksQuery),
        getDocs(recurringTasksQuery)
      ]);

      const tasks = [
        ...processQuerySnapshot(regularTasks),
        ...processQuerySnapshot(recurringTasks).map(task => ({
          ...task,
          completed: task.lastCompletedDate === today
        }))
      ];

      return tasks.sort((a, b) => a.time.localeCompare(b.time));
    } catch (error: any) {
      if (error.code === 'failed-precondition') {
        const allTasks = await getDocs(query(tasksRef));
        const tasks = processQuerySnapshot(allTasks)
          .filter(task => {
            if (task.isRecurring) {
              task.completed = task.lastCompletedDate === today;
              return true;
            }
            return !task.completed && task.date === date;
          });
        return tasks.sort((a, b) => a.time.localeCompare(b.time));
      }
      throw error;
    }
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw new Error('Failed to load tasks. Please try again.');
  }
}