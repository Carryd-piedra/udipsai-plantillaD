import api from './api';

export const pasantesService = {
  listar: async () => {
    try {
      const response = await api.get('/pasantes');
      return response.data;
    } catch (error) {
      console.error('Error al listar pasantes:', error);
      throw error;
    }
  },

  crear: async (data: any, file?: File) => {
    try {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        
        if (file) {
            formData.append("file", file);
        }

        const response = await api.post('/pasantes', formData);
        return response.data;
    } catch (error) {
        console.error('Error al crear pasante:', error);
        throw error;
    }
  },

  actualizar: async (id: number | string, data: any, file?: File) => {
    try {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        
        if (file) {
            formData.append("file", file);
        }

        const response = await api.put(`/pasantes/${id}`, formData);
        return response.data;
    } catch (error) {
      console.error('Error al actualizar pasante:', error);
      throw error;
    }
  },

  obtenerPorId: async (id: number | string) => {
    try {
      const response = await api.get(`/pasantes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener pasante:', error);
      throw error;
    }
  },

  buscar: async (search?: string, tutorId?: number | string) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (tutorId) params.append('tutorId', String(tutorId));

      const response = await api.get(`/pasantes/buscar?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar pasantes:', error);
      throw error;
    }
  },

  obtenerFoto: async (filename: string) => {
    try {
        const response = await api.get(`/pasantes/fotos/${filename}`, {
            responseType: 'blob'
        });
        return URL.createObjectURL(response.data);
    } catch (error) {
        console.error('Error al obtener foto:', error);
        throw error;
    }
  },

  eliminar: async (id: number | string) => {
    try {
      const response = await api.delete(`/pasantes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar pasante:', error);
      throw error;
    }
  },
};
