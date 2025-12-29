import api from './api';

export const seguimientosService = {
  listar: async () => {
    try {
      const response = await api.get('/seguimientos');
      return response.data;
    } catch (error) {
      console.error('Error al listar seguimientos:', error);
      throw error;
    }
  },

  listarPorPaciente: async (id: number | string) => {
    try {
      const response = await api.get(`/seguimientos/paciente/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener seguimientos del paciente:', error);
      throw error;
    }
  },

  crear: async (request: any) => {
    try {
      const response = await api.post('/seguimientos', request);
      return response.data;
    } catch (error) {
      console.error('Error al crear seguimiento:', error);
      throw error;
    }
  },

  actualizar: async (id: number | string, request: any) => {
    try {
      const response = await api.put(`/seguimientos/${id}`, request);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar seguimiento:', error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/seguimientos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar seguimiento:', error);
      throw error;
    }
  },
};
