import { supabase } from './supabase';

const BUCKET_NAME = 'contratos';

/**
 * Guarda un archivo PDF en el Storage de Supabase.
 * @param key Clave única (ej: RUT del comercio)
 * @param file El objeto File del PDF
 */
export const saveFile = async (key: string, file: File): Promise<string> => {

    const cleanKey = key.replace(/[^a-zA-Z0-9]/g, "");
  const fileExt = file.name.split('.').pop();
  const fileName = `${cleanKey}.${fileExt}`;
  const filePath = `municipales/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      upsert: true,
      contentType: 'application/pdf'
    });

  if (error) throw error;

  // Obtenemos la URL pública del archivo
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return publicUrl;
};

/**
 * Recupera un archivo del Storage como un objeto Blob para visualización/descarga controlada.
 */
export const getFile = async (filePath: string): Promise<Blob | null> => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(filePath);

  if (error) {
    console.error('Error downloading file:', error);
    return null;
  }

  return data;
};

/**
 * Elimina un archivo del Storage.
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) throw error;
};
