export interface MuscleGroup {
  id: number;
  name: string;
  slug: string;
  category?: string;
  display_order?: number;
  order_index?: number;
}

export interface Exercise {
  id: number;
  name: string;
  primary_muscle_group_id: number;
  equipment_id?: number;
  notes?: string;
  is_compound: boolean;
  is_active: boolean;
  primary_muscle_group?: MuscleGroup;
  muscle_groups?: MuscleGroup[];
}

export interface IntensityType {
  id: number;
  name: string;
  slug: string;
}

export interface TechniqueType {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface PlannedExercise {
  id: number;
  training_day_id: number;
  exercise_id: number;
  order_index: number;
  sets: number;
  rep_range: string;
  intensity_type_id?: number;
  intensity_value?: number;
  technique_type_id?: number;
  notes?: string;
  superset_group_id?: string;
  exercise?: Exercise;
  intensity_type?: IntensityType;
  technique_type?: TechniqueType;
  formatted_intensity?: string;
}

export interface TrainingDay {
  id: number;
  mesocycle_week_id: number;
  day_number: number;
  name: string;
  order_index: number;
  notes?: string;
  is_second_session: boolean;
  parent_training_day_id?: number;
  planned_exercises?: PlannedExercise[];
  muscle_groups?: MuscleGroup[];
  total_sets?: number;
}

export interface MesocycleWeek {
  id: number;
  mesocycle_id: number;
  week_number: number;
  week_type: 'normal' | 'deload' | 'testing';
  intensity_modifier: number;
  volume_modifier: number;
  notes?: string;
  training_days?: TrainingDay[];
}

export interface Mesocycle {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  duration_weeks: number;
  training_days_per_week: number;
  status: 'draft' | 'active' | 'completed' | 'archived';
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  weeks?: MesocycleWeek[];
  current_week?: number;
  end_date: string;
}

export interface MesocyclePageProps {
  mesocycles: Mesocycle[];
}

export interface MesocycleShowPageProps {
  mesocycle: Mesocycle;
  exercises: Exercise[];
  muscle_groups: MuscleGroup[];
  intensity_types: IntensityType[];
  technique_types: TechniqueType[];
}

export interface MesocycleCreatePageProps {
  muscle_groups: MuscleGroup[];
}
