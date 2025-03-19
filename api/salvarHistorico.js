import { writeFile, readFile } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const filePath = path.resolve('./public/historico.json'); // Arquivo JSON para armazenar os dados

    try {
        let historicoAtual = [];

        // Lê os dados existentes, se houver
        try {
            const data = await readFile(filePath, 'utf8');
            historicoAtual = JSON.parse(data);
        } catch (error) {
            console.log('Arquivo de histórico não encontrado, criando um novo.');
        }

        const novoHistorico = req.body;
        historicoAtual.push(novoHistorico);

        // Salva os novos dados no arquivo
        await writeFile(filePath, JSON.stringify(historicoAtual, null, 2));

        res.status(200).json({ message: 'Histórico salvo com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao salvar histórico', details: error.message });
    }
}
