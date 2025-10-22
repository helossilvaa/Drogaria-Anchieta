import { readAll } from "../config/database.js";

export const TipoDesconto = {
  getAll: async () => {
    const result = await readAll("tipos_desconto");
    return Array.isArray(result) ? result : [];
  },
};
