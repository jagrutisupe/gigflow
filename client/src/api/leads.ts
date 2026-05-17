import api from './axios';
import type { LeadFilters, Lead } from '../types';

export const fetchLeads = (filters: LeadFilters) =>
  api.get('/leads', { params: filters });

export const fetchLead = (id: string) =>
  api.get(`/leads/${id}`);

export const createLead = (data: Partial<Lead>) =>
  api.post('/leads', data);

export const updateLead = (id: string, data: Partial<Lead>) =>
  api.put(`/leads/${id}`, data);

export const deleteLead = (id: string) =>
  api.delete(`/leads/${id}`);

export const exportLeads = (filters: LeadFilters) =>
  api.get('/leads/export', { params: filters, responseType: 'blob' });