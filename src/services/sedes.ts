import api from './api';

export const sedesService = {
  listar: async () => {
    try {
      const response = await api.get('/sedes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener sedes:', error);
      throw error;
    }
  },

  crear: async (request: any) => {
    try {
      const response = await api.post('/sedes', request);
      return response.data;
    } catch (error) {
      console.error('Error al crear sede:', error);
      throw error;
    }
  },

  actualizar: async (id: number | string, request: any) => {
    try {
      const response = await api.put(`/sedes/${id}`, request);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar sede:', error);
      throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/sedes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar sede:', error);
      throw error;
    }
  },

  obtenerPorId: async (id: number | string) => {
    try {
      const response = await api.get(`/sedes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener sede:', error);
      throw error;
    }
  },
};
