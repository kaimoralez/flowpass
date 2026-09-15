import { useState, useEffect, useMemo, useCallback } from 'react';

// Dados iniciais baseados nas telas do Stitch adaptados para a regra Aluno/Aluna do Ensino Médio
const INITIAL_ACTIVE_STUDENTS = [
  {
    id: 'act-1',
    gender: 'M', // Aluno
    grade: '3º EM',
    classGroup: '3º EM B',
    room: 'Sala 205',
    teacher: 'Prof. Carlos Eduardo',
    destination: 'banheiro',
    destinationLabel: 'Banheiro',
    color: '#00B4D8',
    exitTime: '10:32',
    elapsedSeconds: 860, // 14:20 min
    isPriority: false,
  },
  {
    id: 'act-2',
    gender: 'M', // Aluno
    grade: '1º EM',
    classGroup: '1º EM A',
    room: 'Sala 101',
    teacher: 'Profa. Fernanda Souza',
    destination: 'coordenacao',
    destinationLabel: 'Coordenação',
    color: '#F37900',
    exitTime: '10:28',
    elapsedSeconds: 1120, // 18:40 min (>15min -> tempo excedido)
    isPriority: false,
  },
  {
    id: 'act-3',
    gender: 'F', // Aluna
    grade: '2º EM',
    classGroup: '2º EM C',
    room: 'Sala 203',
    teacher: 'Prof. Marcos Silva',
    destination: 'bebedouro',
    destinationLabel: 'Bebedouro',
    color: '#2563EB',
    exitTime: '10:40',
    elapsedSeconds: 375, // 06:15 min
    isPriority: false,
  },
  {
    id: 'act-4',
    gender: 'F', // Aluna
    grade: '2º EM',
    classGroup: '2º EM B',
    room: 'Sala 202',
    teacher: 'Profa. Helena Ramos',
    destination: 'biblioteca',
    destinationLabel: 'Biblioteca',
    color: '#B53EA9',
    exitTime: '10:38',
    elapsedSeconds: 510, // 08:30 min
    isPriority: false,
  },
];

const INITIAL_QUEUE_STUDENTS = [
  {
    id: 'q-1',
    gender: 'M', // Aluno
    grade: '3º EM',
    classGroup: '3º EM A',
    room: 'Sala 204',
    teacher: 'Prof. Carlos Eduardo',
    destination: 'banheiro',
    destinationLabel: 'Banheiro',
    color: '#00B4D8',
    requestTime: '10:42',
    waitSeconds: 240, // 4 min
    isPriority: false,
    note: '',
  },
  {
    id: 'q-2',
    gender: 'F', // Aluna
    grade: '1º EM',
    classGroup: '1º EM B',
    room: 'Sala 102',
    teacher: 'Profa. Helena Ramos',
    destination: 'coordenacao',
    destinationLabel: 'Coordenação',
    color: '#F37900',
    requestTime: '10:44',
    waitSeconds: 135, // 2:15 min
    isPriority: false,
    note: '',
  },
  {
    id: 'q-3',
    gender: 'M', // Aluno
    grade: '2º EM',
    classGroup: '2º EM A',
    room: 'Sala 201',
    teacher: 'Prof. Ricardo Mendes',
    destination: 'bebedouro',
    destinationLabel: 'Bebedouro',
    color: '#2563EB',
    requestTime: '10:45',
    waitSeconds: 70, // 1:10 min
    isPriority: false,
    note: '',
  },
  {
    id: 'q-4',
    gender: 'F', // Aluna
    grade: '3º EM',
    classGroup: '3º EM C',
    room: 'Sala 206',
    teacher: 'Profa. Mariana Lima',
    destination: 'enfermaria',
    destinationLabel: 'Enfermaria',
    color: '#FF0000',
    requestTime: '10:46',
    waitSeconds: 30, // 30 seg
    isPriority: true,
    note: 'Urgência Médica',
  },
];

export default function useSchoolFlow() {
  const [activeStudents, setActiveStudents] = useState(INITIAL_ACTIVE_STUDENTS);
  const [queueStudents, setQueueStudents] = useState(INITIAL_QUEUE_STUDENTS);
  const [selectedGrade, setSelectedGrade] = useState('all'); // 'all', '1º EM', '2º EM', '3º EM'
  const [inspectorAlert, setInspectorAlert] = useState(null);

  // Relógio em tempo real para os cronômetros
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStudents((prev) =>
        prev.map((student) => ({
          ...student,
          elapsedSeconds: student.elapsedSeconds + 1,
        }))
      );

      setQueueStudents((prev) =>
        prev.map((student) => ({
          ...student,
          waitSeconds: student.waitSeconds + 1,
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
    (id) => {
      const student = queueStudents.find((s) => s.id === id);
      if (!student) return false;

      const check = canReleaseStudent(student);
      if (!check.allowed) {
        alert(check.reason);
        return false;
      }

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
      return true;
    },
    [queueStudents, canReleaseStudent]
  );

  /**
   * Nega ou cancela uma solicitação na fila
   */
  const rejectExit = useCallback((id) => {
    setQueueStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  /**
   * Confirma o retorno de um aluno, liberando a vaga de circulação da sua série e gênero
   */
  const confirmReturn = useCallback((id) => {
    setActiveStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  /**
   * Cria um novo pedido de saída
   */
  const createPass = useCallback(
    (passData) => {
      const now = new Date();
      const requestTimeStr = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newPass = {
        id: `q-${Date.now()}`,
        gender: passData.gender, // 'M' ou 'F'
        grade: passData.grade, // '1º EM', '2º EM', '3º EM'
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
    },
    []
  );

  /**
   * Aciona alerta de ronda / inspetor
   */
  const notifyInspector = useCallback((student) => {
    const genderLabel = student.gender === 'M' ? 'Aluno' : 'Aluna';
    setInspectorAlert(`Inspetor acionado para ${genderLabel} da ${student.room} (${student.grade})!`);
    setTimeout(() => setInspectorAlert(null), 4000);
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

    // Tempo médio em minutos
    const totalSeconds = activeStudents.reduce(
      (acc, curr) => acc + curr.elapsedSeconds,
      0
    );
    const avgMinutes = totalActive > 0 ? Math.floor(totalSeconds / totalActive / 60) : 0;
    const avgSecondsRemainder =
      totalActive > 0 ? Math.floor((totalSeconds / totalActive) % 60) : 0;
    const formattedAvg = `${String(avgMinutes).padStart(2, '0')}:${String(
      avgSecondsRemainder
    ).padStart(2, '0')}`;

    // Alertas (> 15 min = 900 segundos)
    const overdueCount = activeStudents.filter(
      (s) => s.elapsedSeconds >= 900
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
    notifyInspector,
    inspectorAlert,
  };
}
