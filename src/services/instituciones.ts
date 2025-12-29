import api from './api';

export const institucionesService = {
  listar: async () => {
    try {
      const response = await api.get('/instituciones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener instituciones:', error);
      throw error;
    }
  },

  crear: async (request: any) => {
    try {
      const response = await api.post('/instituciones', request);
      return response.data;
    } catch (error) {
      console.error('Error al crear institución:', error);
      throw error;
    }
  },

  obtenerPorId: async (id: number | string) => {
    try {
      const response = await api.get(`/instituciones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener institución:', error);
      throw error;
    }
  },

  actualizar: async (id: number | string, request: any) => {
    try {
      const response = await api.put(`/instituciones/${id}`, request);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar institución:', error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/instituciones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar institución:', error);
      throw error;
    }
  },
};
