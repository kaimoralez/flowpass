import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const ACTIVE_COLLECTION = 'active_students';
const QUEUE_COLLECTION = 'queue_students';

/**
 * Escuta em tempo real os alunos fora de sala (ativos)
 */
export function subscribeToActiveStudents(onUpdate, onError) {
  if (!isFirebaseConfigured) {
    console.warn('[Firebase] Usando modo local sem chave configurada no .env.local');
    return () => {};
  }

  const colRef = collection(db, ACTIVE_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const students = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      onUpdate(students);
    },
    (err) => {
      console.error('[Firebase Error - Active Students]:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Escuta em tempo real os alunos aguardando na fila
 */
export function subscribeToQueueStudents(onUpdate, onError) {
  if (!isFirebaseConfigured) {
    return () => {};
  }

  const colRef = collection(db, QUEUE_COLLECTION);
  const q = query(colRef, orderBy('createdAt', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const students = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      onUpdate(students);
    },
    (err) => {
      console.error('[Firebase Error - Queue Students]:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Cria uma nova solicitação na fila
 */
export async function createQueuePass(passData) {
  if (!isFirebaseConfigured) return null;

  const now = new Date();
  const requestTimeStr = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const payload = {
    gender: passData.gender,
    grade: passData.grade,
    classGroup: passData.classGroup || passData.grade,
    room: passData.room,
    teacher: passData.teacher,
    destination: passData.destination,
    destinationLabel: passData.destinationLabel,
    color: passData.color,
    requestTime: requestTimeStr,
    waitSeconds: 0,
    isPriority: Boolean(passData.isPriority),
    note: passData.note || '',
    dateString: now.toISOString().split('T')[0], // YYYY-MM-DD para controle diário
    createdAt: serverTimestamp(),
  };

  const colRef = collection(db, QUEUE_COLLECTION);
  const docRef = await addDoc(colRef, payload);
  return docRef.id;
}

/**
 * Libera um aluno da fila para a lista de ativos
 */
export async function approveStudentExit(student) {
  if (!isFirebaseConfigured) return;

  const now = new Date();
  const exitTimeStr = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const activePayload = {
    gender: student.gender,
    grade: student.grade,
    classGroup: student.classGroup,
    room: student.room,
    teacher: student.teacher,
    destination: student.destination,
    destinationLabel: student.destinationLabel,
    color: student.color,
    exitTime: exitTimeStr,
    elapsedSeconds: 0,
    isPriority: student.isPriority || false,
    dateString: now.toISOString().split('T')[0],
    createdAt: serverTimestamp(),
  };

  // 1. Remove da fila
  await deleteDoc(doc(db, QUEUE_COLLECTION, student.id));

  // 2. Adiciona aos ativos
  const activeCol = collection(db, ACTIVE_COLLECTION);
  await addDoc(activeCol, activePayload);
}

/**
 * Rejeita/Cancela um passe da fila
 */
export async function rejectStudentExit(studentId) {
  if (!isFirebaseConfigured) return;
  await deleteDoc(doc(db, QUEUE_COLLECTION, studentId));
}

/**
 * Confirma o retorno do aluno para a sala de aula
 */
export async function confirmStudentReturn(studentId) {
  if (!isFirebaseConfigured) return;
  await deleteDoc(doc(db, ACTIVE_COLLECTION, studentId));
}

/**
 * Limpa todos os passes ativos e na fila (Zerar quadro)
 */
export async function clearAllPasses() {
  if (!isFirebaseConfigured) return;

  try {
    const activeSnap = await getDocs(collection(db, ACTIVE_COLLECTION));
    const queueSnap = await getDocs(collection(db, QUEUE_COLLECTION));

    const deletePromises = [
      ...activeSnap.docs.map((d) => deleteDoc(d.ref)),
      ...queueSnap.docs.map((d) => deleteDoc(d.ref)),
    ];

    await Promise.all(deletePromises);
    console.log('[Firebase] Todos os passes foram zerados para o novo dia.');
  } catch (err) {
    console.error('[Firebase Clear Error]:', err);
  }
}
