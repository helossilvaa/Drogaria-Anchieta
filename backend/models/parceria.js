import { create, readAll, read, update, deleteRecord } from "../config/database.js";

export const Parcerias = {
    create: async (data) => {
        return await create("parcerias", data);
    },

    getAll: async () => {
        const result = await readAll("parcerias");
        return Array.isArray(result) ? result : [];
    },
};