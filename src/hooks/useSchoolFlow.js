import { useState, useEffect, useMemo, useCallback } from 'react';
import { isFirebaseConfigured } from '../services/firebase';
import {
  subscribeToActiveStudents,
  subscribeToQueueStudents,
  createQueuePass,
  approveStudentExit,
  rejectStudentExit,
  confirmStudentReturn,
  clearAllPasses,
} from '../services/queueService';

const INITIAL_ACTIVE_STUDENTS = [];
const INITIAL_QUEUE_STUDENTS = [];

export default function useSchoolFlow() {
  const [activeStudents, setActiveStudents] = useState(INITIAL_ACTIVE_STUDENTS);
  const [queueStudents, setQueueStudents] = useState(INITIAL_QUEUE_STUDENTS);
  const [selectedGrade, setSelectedGrade] = useState('all'); // 'all', '1º EM', '2º EM', '3º EM'
  const [inspectorAlert, setInspectorAlert] = useState(null);

  // Efeito de verificação do reset diário às 00h
  useEffect(() => {
    const checkDailyReset = () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastReset = localStorage.getItem('flowpass_last_reset');

      if (lastReset && lastReset !== todayStr) {
        console.log('[FlowPass] Mudança de dia detectada (00h). Zerando lista de passes...');
        if (isFirebaseConfigured) {
          clearAllPasses();
        } else {
          setActiveStudents([]);
          setQueueStudents([]);
        }
      }
      localStorage.setItem('flowpass_last_reset', todayStr);
    };

    checkDailyReset();
    const resetInterval = setInterval(checkDailyReset, 60000); // Checa a cada minuto se deu meia-noite
    return () => clearInterval(resetInterval);
  }, []);

  // Efeito de conexão e sincronização com o Firebase Firestore
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    // Inscrição dos ouvintes em tempo real
    const unsubscribeActive = subscribeToActiveStudents((students) => {
      setActiveStudents(students);
    });

    const unsubscribeQueue = subscribeToQueueStudents((students) => {
      setQueueStudents(students);
    });

    return () => {
      unsubscribeActive();
      unsubscribeQueue();
    };
  }, []);

  // Relógio em tempo real para os cronômetros locais
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStudents((prev) =>
        prev.map((student) => ({
          ...student,
          elapsedSeconds: (student.elapsedSeconds || 0) + 1,
        }))
      );

      setQueueStudents((prev) =>
        prev.map((student) => ({
          ...student,
          waitSeconds: (student.waitSeconds || 0) + 1,
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /**
   * REGRA DE CIRCULAÇÃO:
   * No máximo 1 Aluno (M) e 1 Aluna (F) por série fora ao mesmo tempo nas 9 salas combinadas.
   */
  const canReleaseStudent = useCallback(
    (student) => {
      const alreadyOut = activeStudents.some(
        (s) => s.grade === student.grade && s.gender === student.gender
      );

      if (alreadyOut) {
        const genderLabel = student.gender === 'M' ? 'Aluno' : 'Aluna';
        return {
          allowed: false,
          reason: `Já existe 1 ${genderLabel} do ${student.grade} fora de sala.`,
        };
      }

      return { allowed: true };
    },
    [activeStudents]
  );

  /**
   * Libera a saída de um aluno da fila para a lista de ativos
   */
  const approveExit = useCallback(
    async (id) => {
      const student = queueStudents.find((s) => s.id === id);
      if (!student) return false;

      const check = canReleaseStudent(student);
      if (!check.allowed) {
        alert(check.reason);
        return false;
      }

      if (isFirebaseConfigured) {
        await approveStudentExit(student);
      } else {
        const now = new Date();
        const exitTimeStr = now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        });

        const newActive = {
          ...student,
          id: `act-${Date.now()}`,
          exitTime: exitTimeStr,
          elapsedSeconds: 0,
        };

        setQueueStudents((prev) => prev.filter((s) => s.id !== id));
        setActiveStudents((prev) => [newActive, ...prev]);
      }
      return true;
    },
    [queueStudents, canReleaseStudent]
  );

  /**
   * Nega ou cancela uma solicitação na fila
   */
  const rejectExit = useCallback(async (id) => {
    if (isFirebaseConfigured) {
      await rejectStudentExit(id);
    } else {
      setQueueStudents((prev) => prev.filter((s) => s.id !== id));
    }
  }, []);

  /**
   * Confirma o retorno de um aluno, liberando a vaga de circulação da sua série e gênero
   */
  const confirmReturn = useCallback(async (id) => {
    if (isFirebaseConfigured) {
      await confirmStudentReturn(id);
    } else {
      setActiveStudents((prev) => prev.filter((s) => s.id !== id));
    }
  }, []);

  /**
   * Cria um novo pedido de saída
   */
  const createPass = useCallback(async (passData) => {
    if (isFirebaseConfigured) {
      await createQueuePass(passData);
    } else {
      const now = new Date();
      const requestTimeStr = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newPass = {
        id: `q-${Date.now()}`,
        gender: passData.gender,
        grade: passData.grade,
        classGroup: passData.classGroup || `${passData.grade}`,
        room: passData.room,
        teacher: passData.teacher,
        destination: passData.destination,
        destinationLabel: passData.destinationLabel,
        color: passData.color,
        requestTime: requestTimeStr,
        waitSeconds: 0,
        isPriority: Boolean(passData.isPriority),
        note: passData.note || '',
      };

      if (newPass.isPriority) {
        setQueueStudents((prev) => [newPass, ...prev]);
      } else {
        setQueueStudents((prev) => [...prev, newPass]);
      }
    }
  }, []);

  /**
   * Aciona alerta de ronda / inspetor
   */
  const notifyInspector = useCallback((student) => {
    const genderLabel = student.gender === 'M' ? 'Aluno' : 'Aluna';
    setInspectorAlert(`Inspetor acionado para ${genderLabel} da ${student.room} (${student.grade})!`);
    setTimeout(() => setInspectorAlert(null), 4000);
  }, []);

  /**
   * Reseta/zera manualmente todos os passes
   */
  const handleClearAll = useCallback(async () => {
    if (isFirebaseConfigured) {
      await clearAllPasses();
    } else {
      setActiveStudents([]);
      setQueueStudents([]);
    }
  }, []);

  // Alunos filtrados pela série selecionada
  const filteredActiveStudents = useMemo(() => {
    if (selectedGrade === 'all') return activeStudents;
    return activeStudents.filter((s) => s.grade === selectedGrade);
  }, [activeStudents, selectedGrade]);

  const filteredQueueStudents = useMemo(() => {
    if (selectedGrade === 'all') return queueStudents;
    return queueStudents.filter((s) => s.grade === selectedGrade);
  }, [queueStudents, selectedGrade]);

  // Métricas gerais calculadas em tempo real
  const metrics = useMemo(() => {
    const totalActive = activeStudents.length;
    const totalQueue = queueStudents.length;

    const totalSeconds = activeStudents.reduce(
      (acc, curr) => acc + (curr.elapsedSeconds || 0),
      0
    );
    const avgMinutes = totalActive > 0 ? Math.floor(totalSeconds / totalActive / 60) : 0;
    const avgSecondsRemainder =
      totalActive > 0 ? Math.floor((totalSeconds / totalActive) % 60) : 0;
    const formattedAvg = `${String(avgMinutes).padStart(2, '0')}:${String(
      avgSecondsRemainder
    ).padStart(2, '0')}`;

    const overdueCount = activeStudents.filter(
      (s) => (s.elapsedSeconds || 0) >= 900
    ).length;

    return {
      totalActive,
      formattedAvg,
      totalQueue,
      overdueCount,
    };
  }, [activeStudents, queueStudents]);

  return {
    activeStudents: filteredActiveStudents,
    rawActiveCount: activeStudents.length,
    queueStudents: filteredQueueStudents,
    rawQueueCount: queueStudents.length,
    selectedGrade,
    setSelectedGrade,
    metrics,
    canReleaseStudent,
    approveExit,
    rejectExit,
    confirmReturn,
    createPass,
    clearAllPasses: handleClearAll,
    notifyInspector,
    inspectorAlert,
    isFirebaseConnected: isFirebaseConfigured,
  };
}
