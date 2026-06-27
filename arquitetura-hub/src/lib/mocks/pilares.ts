import type { Pilar } from '@/types'

export const mockPilares: Pilar[] = [
  {
    id: 'pilar-1',
    user_id: 'member-1',
    nome: 'Conteúdo de Autoridade',
    descricao: 'Produzir conteúdo que demonstre expertise e gere reconhecimento no mercado',
    cor: '#1B3A5C',
    ordem: 1,
    acoes: [
      { id: 'a1', pilar_id: 'pilar-1', texto: 'Publicar 3 artigos no LinkedIn por semana', concluida: true, ordem: 1 },
      { id: 'a2', pilar_id: 'pilar-1', texto: 'Gravar 1 vídeo de case study por mês', concluida: true, ordem: 2 },
      { id: 'a3', pilar_id: 'pilar-1', texto: 'Criar newsletter semanal para base de contatos', concluida: false, ordem: 3 },
      { id: 'a4', pilar_id: 'pilar-1', texto: 'Escrever capítulo para ebook da área', concluida: false, ordem: 4 },
    ],
  },
  {
    id: 'pilar-2',
    user_id: 'member-1',
    nome: 'Rede Estratégica',
    descricao: 'Construir e nutrir relacionamentos com pessoas-chave do setor',
    cor: '#D97706',
    ordem: 2,
    acoes: [
      { id: 'a5', pilar_id: 'pilar-2', texto: 'Participar de 2 eventos de networking por mês', concluida: true, ordem: 1 },
      { id: 'a6', pilar_id: 'pilar-2', texto: 'Fazer 5 conexões estratégicas no LinkedIn por semana', concluida: false, ordem: 2 },
      { id: 'a7', pilar_id: 'pilar-2', texto: 'Agendar 2 reuniões de café com referências do mercado', concluida: false, ordem: 3 },
    ],
  },
  {
    id: 'pilar-3',
    user_id: 'member-1',
    nome: 'Presença em Eventos',
    descricao: 'Ocupar palcos e espaços que ampliem a visibilidade e autoridade',
    cor: '#7C3AED',
    ordem: 3,
    acoes: [
      { id: 'a8', pilar_id: 'pilar-3', texto: 'Submeter proposta para 3 eventos como palestrante', concluida: true, ordem: 1 },
      { id: 'a9', pilar_id: 'pilar-3', texto: 'Participar de painel em conferência da área', concluida: false, ordem: 2 },
      { id: 'a10', pilar_id: 'pilar-3', texto: 'Organizar webinar próprio com convidados', concluida: false, ordem: 3 },
    ],
  },
  {
    id: 'pilar-4',
    user_id: 'member-1',
    nome: 'Cobertura de Mídia',
    descricao: 'Ser citado e mencionado em veículos relevantes do setor',
    cor: '#059669',
    ordem: 4,
    acoes: [
      { id: 'a11', pilar_id: 'pilar-4', texto: 'Enviar press release para 5 veículos especializados', concluida: false, ordem: 1 },
      { id: 'a12', pilar_id: 'pilar-4', texto: 'Conceder entrevista para podcast de referência', concluida: true, ordem: 2 },
      { id: 'a13', pilar_id: 'pilar-4', texto: 'Colaborar com coluna em publicação do setor', concluida: false, ordem: 3 },
    ],
  },
]
