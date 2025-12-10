import { DuffelSlice } from '@/types';

/**
 * Get departure time from slice or first segment
 * Duffel API may return times at slice level or nested in segments
 */
export const getDepartureTime = (slice: DuffelSlice | undefined): string | null => {
  if (!slice) return null;
  // Try slice level first
  if (slice.departure_time) return slice.departure_time;
  // Fall back to first segment
  if (slice.segments && slice.segments.length > 0) {
    return slice.segments[0].departing_at;
  }
  return null;
};

/**
 * Get arrival time from slice or last segment
 * Duffel API may return times at slice level or nested in segments
 */
export const getArrivalTime = (slice: DuffelSlice | undefined): string | null => {
  if (!slice) return null;
  // Try slice level first
  if (slice.arrival_time) return slice.arrival_time;
  // Fall back to last segment
  if (slice.segments && slice.segments.length > 0) {
    return slice.segments[slice.segments.length - 1].arriving_at;
  }
  return null;
};
