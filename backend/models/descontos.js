import { create, readAll, read, update, deleteRecord } from "../config/database.js";

export const Descontos = {
    create: async (data) => {
        return await create("descontos", data);
    },

    getAll: async () => {
        const result = await readAll("descontos");
        return Array.isArray(result) ? result : [];
    },

    getByNome: async (nome) => {
        console.log("Buscando desconto com nome:", nome);

        const query = `SELECT * FROM descontos WHERE nome = ?`;
        const [rows] = await connection.execute(query, [nome]);

        return rows.length > 0 ? rows[0] : null;
    },
};