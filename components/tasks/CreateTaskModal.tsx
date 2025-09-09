import { TaskDifficulty } from "@/models/enums/TaskDifficulty";
import { TaskStatus } from '@/models/enums/TaskStatus';
import { TaskType } from "@/models/enums/TaskType";
import { Task } from '@/models/Task';
import { CreateTaskData, createTaskSchema, UpdateTaskData, updateTaskSchema } from "@/schema/validationSchema";
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => void;
  task?: Task | null;
}

export default function CreateTaskModal({ visible, onClose, onSubmit, task }: CreateTaskModalProps) {

  const isEditMode = !!task;
  const schema = isEditMode ? updateTaskSchema : createTaskSchema;

  const { control, handleSubmit, formState: { errors }, reset, clearErrors } = useForm<CreateTaskData | UpdateTaskData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      title: "",
      difficulty: TaskDifficulty.NORMAL,
      description: "",
      type: TaskType.DAILY,
      status: TaskStatus.PENDING,
      timezone: "UTC",
      dateStart: null,
      dateEnd: null,
    },
  });

  useEffect(() => {
    if (task && visible) {
      reset({
        title: task.title,
        difficulty: task.difficulty,
        description: task.description,
        type: task.type,
        status: task.status,
        timezone: task.timezone || "UTC",
        dateStart: task.dateStart,
        dateEnd: task.dateEnd,
      });
    } else if (!task && visible) {
      reset({
        title: "",
        difficulty: TaskDifficulty.NORMAL,
        description: "",
        type: TaskType.DAILY,
        status: TaskStatus.PENDING,
        timezone: "UTC",
        dateStart: null,
        dateEnd: null,
      });
    }
  }, [task, visible, reset]);

  const handleClose = () => {
    reset();
    clearErrors();
    onClose();
  };

  const handleFormSubmit = (data: CreateTaskData | UpdateTaskData) => {
    try {
      const validatedData = isEditMode
          ? updateTaskSchema.parse(data)
          : createTaskSchema.parse(data);

      onSubmit(validatedData as CreateTaskData);
      handleClose();
    } catch (validationError) {
      console.error("Erreur de validation Zod:", validationError);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case TaskDifficulty.EASY: return '#4CAF50';
      case TaskDifficulty.NORMAL: return '#FF9800';
      case TaskDifficulty.HARD: return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case TaskDifficulty.EASY: return 'Facile';
      case TaskDifficulty.NORMAL: return 'Normal';
      case TaskDifficulty.HARD: return 'Difficile';
      default: return 'Inconnu';
    }
  };

  if (!visible) return null;

  return (
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isEditMode ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Titre *</Text>
                      <TextInput
                          style={[styles.input, errors.title && styles.inputError]}
                          placeholder="Titre de la tâche"
                          value={value}
                          onChangeText={onChange}
                      />
                      {errors.title && (
                          <Text style={styles.errorText}>{errors.title.message}</Text>
                      )}
                    </View>
                )}
            />

            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Description *</Text>
                      <TextInput
                          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                          placeholder="Description de la tâche"
                          value={value}
                          onChangeText={onChange}
                          multiline
                          numberOfLines={3}
                      />
                      {errors.description && (
                          <Text style={styles.errorText}>{errors.description.message}</Text>
                      )}
                    </View>
                )}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Difficulté</Text>
              <View style={styles.difficultyButtons}>
                {([TaskDifficulty.EASY, TaskDifficulty.NORMAL, TaskDifficulty.HARD] as const).map((difficulty) => (
                    <Controller
                        key={difficulty}
                        control={control}
                        name="difficulty"
                        render={({ field: { onChange, value } }) => (
                            <TouchableOpacity
                                style={[
                                  styles.difficultyButton,
                                  value === difficulty && styles.difficultyButtonActive,
                                  { borderColor: getDifficultyColor(difficulty) }
                                ]}
                                onPress={() => onChange(difficulty)}
                            >
                              <Text style={[
                                styles.difficultyButtonText,
                                value === difficulty && styles.difficultyButtonTextActive,
                                { color: value === difficulty ? '#FFFFFF' : getDifficultyColor(difficulty) }
                              ]}>
                                {getDifficultyLabel(difficulty)}
                              </Text>
                            </TouchableOpacity>
                        )}
                    />
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Type de tâche</Text>
              <View style={styles.typeButtons}>
                {([
                  { value: TaskType.DAILY, label: 'Journalière' },
                  { value: TaskType.WEEKLY, label: 'Hebdomadaire' },
                  { value: TaskType.ONE_TIME, label: 'Permanente' },
                  { value: TaskType.REPEATABLE, label: 'Répétable' }
                ] as const).map((type) => (
                    <Controller
                        key={type.value}
                        control={control}
                        name="type"
                        render={({ field: { onChange, value } }) => (
                            <TouchableOpacity
                                style={[
                                  styles.typeButton,
                                  value === type.value && styles.typeButtonActive
                                ]}
                                onPress={() => onChange(type.value)}
                            >
                              <Text style={[
                                styles.typeButtonText,
                                value === type.value && styles.typeButtonTextActive
                              ]}>
                                {type.label}
                              </Text>
                            </TouchableOpacity>
                        )}
                    />
                ))}
              </View>
            </View>

            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit(handleFormSubmit)}
            >
              <Text style={styles.submitButtonText}>
                {isEditMode ? 'Modifier la tâche' : 'Créer la tâche'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width - 40,
    maxHeight: height - 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  scrollContent: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  difficultyButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  difficultyButtonTextActive: {
    color: '#FFFFFF',
  },
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  typeButtonActive: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});