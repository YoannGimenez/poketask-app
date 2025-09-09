import CreateTaskModal from '@/components/tasks/CreateTaskModal';
import TaskCard from '@/components/tasks/TaskCard';
import TaskTabs from '@/components/tasks/TaskTabs';
import { Task } from "@/models/Task";
import { TaskType } from "@/models/enums/TaskType";
import { CreateTaskData } from "@/schema/validationSchema";
import { useToast } from "@/contexts/ToastContext";
import { Ionicons } from '@expo/vector-icons';
import taskService from '@/api/taskService';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useAuth} from "@/contexts/AuthContext";

type TabType = 'duration' | 'permanent' | 'repeatable';

export default function TasksScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('duration');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError, showWarning } = useToast();
  const { updateUser } = useAuth();

  const handleCloseTaskForm = () => {
    setShowCreateForm(false);
    setSelectedTask(null);
  };

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const result = await taskService.getMyTasks();

      if (result.success) {
        setTasks(result.data.tasks);
      } else if (result.error) {
        showError('Erreur de chargement', result.error.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      showError('Erreur de connexion', 'Impossible de charger les tâches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleRefresh = () => {
    fetchTasks();
  };

  const dailyTasks = useMemo(() => {
    return tasks.filter(task => task.type === TaskType.DAILY);
  }, [tasks]);

  const weeklyTasks = useMemo(() => {
    return tasks.filter(task => task.type === TaskType.WEEKLY);
  }, [tasks]);

  const permanentTasks = useMemo(() => {
    return tasks.filter(task => task.type === TaskType.ONE_TIME);
  }, [tasks]);

  const repeatableTasks = useMemo(() => {
    return tasks.filter(task => task.type === TaskType.REPEATABLE);
  }, [tasks]);

  const handleCompleteTask = async (taskId: string) => {
    try {
      const result = await taskService.completeTask(taskId);

      if (result.success) {
        if (result.data.user) {
          updateUser({
            level: result.data.user.level,
            experience: result.data.user.experience,
            money: result.data.user.money,
            nextLevelExperience: result.data.user.nextLevelExperience,
            completedTasksCount: result.data.user.completedTasksCount,
            pokemonsCount: result.data.user.pokemonsCount,
          });
        }

        showSuccess('Tâche complétée !', 'Excellent travail ! 🎉');

        if (result.data.leveledUp) {
          showSuccess(
              'Nouveau niveau !',
              `Félicitations ! Vous êtes maintenant niveau ${result.data.user.level} !`,
          );
        }

        if (result.data.evolvedPokemons && result.data.evolvedPokemons.length > 0) {
          result.data.evolvedPokemons.forEach((evolution: any) => {
            showSuccess(
                'Pokémon évolué !',
                `${evolution.basePokemonName} a évolué en ${evolution.evolvedPokemonName} !`,
                evolution.evolvedPokemonSpriteUrl,
            );
          });
        }
        handleRefresh();
      } else if (result.error) {
        showError('Erreur de validation', result.error.message);
      }
    } catch (error) {
      console.error('Erreur lors de la complétion de la tâche:', error);
      showError('Erreur', 'Impossible de compléter la tâche');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const result = await taskService.deleteTask(taskId);

      if (result.success) {
        showWarning('Tâche supprimée', 'La tâche a été supprimée avec succès');
        handleRefresh();
      } else if (result.error) {
        showError('Erreur de suppression', result.error.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
      showError('Erreur', 'Impossible de supprimer la tâche');
    }
  };

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      let result;

      if (selectedTask) {
        // Modification d'une tâche existante
        result = await taskService.updateTask(selectedTask.id, data);

        if (result.success) {
          showSuccess('Tâche modifiée !', 'Les modifications ont été sauvegardées');
          handleRefresh();
          handleCloseTaskForm();
        } else if (result.error) {
          showError('Erreur de modification', result.error.message);
        }
      } else {
        // Création d'une nouvelle tâche
        result = await taskService.createTask(data);

        if (result.success) {
          showSuccess('Tâche créée !', 'Nouvelle tâche ajoutée à votre liste');
          handleRefresh();
          handleCloseTaskForm();
        } else if (result.error) {
          showError('Erreur de création', result.error.message);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      showError('Erreur de connexion', 'Problème de connexion');
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setShowCreateForm(true);
  };

  const renderDurationTasks = () => (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tâches journalières</Text>
          {dailyTasks.map((task: Task) => (
              <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
              />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tâches hebdomadaires</Text>
          {weeklyTasks.map((task) => (
              <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
              />
          ))}
        </View>
      </ScrollView>
  );

  const renderPermanentTasks = () => (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {permanentTasks.map((task) => (
            <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
            />
        ))}
      </ScrollView>
  );

  const renderRepeatableTasks = () => (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {repeatableTasks.map((task) => (
            <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
            />
        ))}
      </ScrollView>
  );

  return (
      <View style={styles.container}>
        <LinearGradient
            colors={['#FF6B6B', '#FFFFFF']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0.5 }}
            locations={[0, 0.80]}
            style={styles.background}
        />

        <SafeAreaView style={styles.safeArea}>
          {/* Header simple */}
          <View style={styles.header}>
            <Text style={styles.title}>Mes Tâches</Text>
          </View>

          {/* Bouton de création */}
          <View style={styles.createButtonContainer}>
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => setShowCreateForm(true)}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Nouvelle tâche</Text>
            </TouchableOpacity>
          </View>

          {/* Onglets */}
          <TaskTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Contenu des onglets */}
          {activeTab === 'duration' && renderDurationTasks()}
          {activeTab === 'permanent' && renderPermanentTasks()}
          {activeTab === 'repeatable' && renderRepeatableTasks()}

          {/* Modal de création */}
          <CreateTaskModal
              visible={showCreateForm}
              onClose={() => handleCloseTaskForm()}
              onSubmit={handleCreateTask}
              task={selectedTask}
          />
        </SafeAreaView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  createButtonContainer: {
    paddingHorizontal: 20,
    marginTop: -15,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
});