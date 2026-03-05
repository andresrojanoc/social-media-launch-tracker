import { apiClient } from '../utils/api.js';

/**
 * Frontend Service Layer for Company-related API calls.
 * Decouples components from endpoint paths and API client specifics.
 */
const companyService = {
    /**
     * Fetches all companies from the API.
     * @returns {Promise<Array>} List of companies
     */
    async fetchCompanies() {
        try {
            return await apiClient.get('/companies/');
        } catch (error) {
            console.error('Error fetching companies:', error);
            throw error;
        }
    },

    /**
     * Generates a DM draft for a specific company and platform.
     * @param {string} companyId 
     * @param {string} platform 
     * @returns {Promise<Object>} The generated draft object
     */
    async generateDraft(companyId, platform) {
        try {
            return await apiClient.post(`/companies/${companyId}/draft_dm/`, { platform });
        } catch (error) {
            console.error('Error generating draft:', error);
            throw error;
        }
    }
};

export default companyService;
