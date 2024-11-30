import { 
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
  where
} from 'firebase/firestore';
import { db } from './db';
import { auth } from './auth';
import { Task } from '../../types';
import { ensureUserDocument } from './users';

function processQuerySnapshot(querySnapshot: QuerySnapshot<DocumentData>): Task[] {
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.() || null,
    updatedAt: doc.data().updatedAt?.toDate?.() || null
  })) as Task[];
}

function getUserTasksCollection(userId: string) {
  if (!userId) {
    throw new Error('User ID is required');
  }
  return collection(db, 'users', userId, 'tasks');
}

export async function createTask(taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task> {
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

      const regularTasksQuery = query(
        tasksRef,
        where('isRecurring', '==', false),
        where('date', '>=', startDate),
        where('date', '<', endDate),
        where('completed', '==', false),
        orderBy('date'),
        orderBy('time')
      );

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
    }
    
    // For daily view
    const regularTasksQuery = query(
      tasksRef,
      where('isRecurring', '==', false),
      where('date', '==', date),
      where('completed', '==', false),
      orderBy('time')
    );

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
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw new Error('Failed to load tasks. Please try again.');
  }
}