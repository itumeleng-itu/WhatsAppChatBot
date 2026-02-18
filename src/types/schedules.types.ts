export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type EventType = 'bootcamp' | 'class_hours' | 'graduation' | string;

export interface Schedule {
  id: string;
  programme_id: string;
  event_type: EventType;
  description: string;
  start_date: string; 
  end_date: string;   
  days_of_week: DayOfWeek[];
  start_time: string; 
  end_time: string;  
  is_recurring: boolean;
  created_at: string; 
  updated_at: string; 
}

export interface SchedulePagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface ScheduleMeta {
  timestamp: string; 
  endpoint: string;
}

export interface SchedulesResponse {
  data: Schedule[];
  pagination: SchedulePagination;
  meta?: ScheduleMeta;
}

//? Query params for fetching schedules
export interface SchedulesQueryParams {
  limit?: number;   
  offset?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}