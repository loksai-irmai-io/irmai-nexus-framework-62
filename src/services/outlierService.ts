
import apiClient from './apiClient';
import { mockActivityDistribution, mockResourceDistribution } from '../components/outlier-analysis/mockData';

// Types for the API responses
export interface OutlierDistributionResponse {
  name: string;
  value: number;
  deviation: number;
}

// Real API functions
export const fetchOutlierDistribution = async (type: 'activity' | 'resource'): Promise<OutlierDistributionResponse[]> => {
  try {
    const response = await apiClient.get<OutlierDistributionResponse[]>(`/outliers/distribution/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} distribution:`, error);
    
    // Fallback to mock data if API fails
    // In production, you'd likely just throw the error
    console.log(`Using mock ${type} distribution data as fallback`);
    return type === 'activity' ? mockActivityDistribution : mockResourceDistribution;
  }
};

// Function to send clicked outlier data to the backend
export const logOutlierClick = async (outlierData: any) => {
  try {
    await apiClient.post('/outliers/log-click', { data: outlierData });
    console.log('Outlier click logged successfully');
    return true;
  } catch (error) {
    console.error('Error logging outlier click:', error);
    return false;
  }
};
