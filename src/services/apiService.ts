import { POPULAR_ATTRACTIONS, DESTINATIONS, deduplicateAttractions } from '../data/mockData';
import { Attraction, Destination } from '../types';

/**
 * A simulated API service to handle data fetching with robust error handling.
 * In a real application, these would be actual fetch/axios calls to a backend.
 */
export const ApiService = {
  /**
   * Fetches all popular attractions
   */
  async getPopularAttractions(): Promise<Attraction[]> {
    return new Promise((resolve, reject) => {
      // Simulate network latency
      setTimeout(() => {
        try {
          // Success case
          resolve(deduplicateAttractions(POPULAR_ATTRACTIONS));
        } catch (error) {
          console.error('Error in getPopularAttractions:', error);
          reject(new Error('Failed to fetch popular attractions. Please try again later.'));
        }
      }, 500);
    });
  },

  /**
   * Fetches attractions for a specific destination
   */
  async getAttractionsByDestination(destinationName: string): Promise<Attraction[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!destinationName) {
            throw new Error('Destination name is required');
          }

          const destLower = destinationName.toLowerCase();
          const filtered = POPULAR_ATTRACTIONS.filter(attr => {
            const cityLower = attr.city.toLowerCase();
            const locationLower = attr.location.toLowerCase();
            const nameLower = attr.name.toLowerCase();

            let matchesDest = false;
            if (destLower === 'europe') {
              matchesDest = locationLower.includes('spain') || locationLower.includes('france') || locationLower.includes('switzerland') || locationLower.includes('italy') || locationLower.includes('germany') || locationLower.includes('netherlands');
            } else if (destLower === 'usa' || destLower === 'north america' || destLower === 'united states') {
              matchesDest = cityLower === 'usa' || locationLower.includes('usa') || locationLower.includes('united states') || cityLower === 'new york' || locationLower.includes('new york');
            } else if (destLower === 'uae' || destLower === 'middle east') {
              matchesDest = cityLower === 'dubai' || locationLower.includes('dubai') || locationLower.includes('uae') || locationLower.includes('emirates') || cityLower === 'istanbul' || locationLower.includes('istanbul') || locationLower.includes('turkey');
            } else if (destLower === 'asia') {
              matchesDest = cityLower === 'tokyo' || cityLower === 'osaka' || cityLower === 'singapore' || cityLower === 'bangkok' || locationLower.includes('japan') || locationLower.includes('singapore') || locationLower.includes('thailand');
            } else if (destLower === 'oceania' || destLower === 'australia') {
              matchesDest = cityLower === 'sydney' || locationLower.includes('australia');
            } else {
              const cleanDest = destLower.replace(/[^a-z0-9]/g, '');
              const cleanCity = cityLower.replace(/[^a-z0-9]/g, '');
              const cleanLocation = locationLower.replace(/[^a-z0-9]/g, '');
              const cleanName = nameLower.replace(/[^a-z0-9]/g, '');

              matchesDest = cityLower.includes(destLower) || 
                            locationLower.includes(destLower) || 
                            nameLower.includes(destLower) ||
                            cleanCity.includes(cleanDest) ||
                            cleanLocation.includes(cleanDest) ||
                            cleanName.includes(cleanDest);
            }
            return matchesDest;
          });

          resolve(deduplicateAttractions(filtered));
        } catch (error) {
          console.error(`Error in getAttractionsByDestination for "${destinationName}":`, error);
          reject(new Error(`Failed to fetch attractions for ${destinationName}.`));
        }
      }, 500);
    });
  },

  /**
   * Fetches all destinations
   */
  async getDestinations(): Promise<Destination[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(DESTINATIONS);
        } catch (error) {
          console.error('Error in getDestinations:', error);
          reject(new Error('Failed to fetch destinations.'));
        }
      }, 500);
    });
  }
};
