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
    },

    /**
     * Deletes a company.
     * @param {string} companyId 
     */
    async deleteCompany(companyId) {
        try {
            return await apiClient.delete(`/companies/${companyId}/`);
        } catch (error) {
            console.error('Error deleting company:', error);
            throw error;
        }
    },

    /**
     * Creates a new company entry from search data.
     * @param {Object} data 
     */
    async createCompany(data) {
        try {
            return await apiClient.post('/companies/', data);
        } catch (error) {
            console.error('Error creating company:', error);
            throw error;
        }
    }
};

export default companyService;
