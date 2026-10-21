// UI strings (typed dictionary). Extra EX1 adds `en.ts` with the same shape.
export const pt = {
  brand: 'KURIO',
  skipToContent: 'Pular para o conteúdo',
  comingSoon: 'Em breve',
  comingSoonToast: 'Disponível em breve — fora do escopo desta demonstração.',
  nav: {
    label: 'Navegação principal',
    home: 'Início',
    market: 'Mercado',
    creators: 'Criadores',
    learn: 'Aprenda',
  },
  header: {
    search: 'Buscar NFTs',
    cart: (count: number) => (count > 0 ? `Carrinho, ${count} ${count === 1 ? 'item' : 'itens'}` : 'Carrinho'),
    signIn: 'Entrar',
  },
  tabBar: {
    label: 'Navegação',
    home: 'Início',
    favorites: 'Favoritos',
    scan: 'Escanear',
    cart: 'Carrinho',
    profile: 'Perfil',
  },
  footer: {
    features: [
      { letter: 'W', title: 'Segurança da carteira', body: 'Proteja sua carteira e colecione arte digital verificada com confiança.' },
      { letter: 'C', title: 'Criadores em destaque', body: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.' },
      { letter: 'D', title: 'Alertas de lançamentos', body: 'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.' },
    ],
    newsletterTitle: 'Antecipe-se ao próximo lançamento',
    newsletterLabel: 'E-mail para novidades',
    newsletterPlaceholder: 'digite seu e-mail...',
    newsletterSubmit: 'Enviar',
    newsletterNote: 'Receba lançamentos selecionados, histórias de criadores e novidades do mercado.',
    tagline: 'Feito para colecionadores, criadores e cultura',
    email: 'contato@email.com',
    phone: '+55 11 4002 8922',
    columns: {
      profile: { title: 'Meu perfil', items: ['Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse'] },
      help: { title: 'Central de ajuda', items: ['Central de ajuda', 'Como comprar NFTs', 'Carteira e segurança', 'Política do mercado', 'Denunciar item'] },
      collections: {
        title: 'Coleções',
        items: [
          { label: 'Arte digital', slug: 'arte-digital' },
          { label: 'Fotografia', slug: 'fotografia' },
          { label: 'Música', slug: 'musica' },
          { label: 'Arte 3D', slug: 'arte-3d' },
          { label: 'Utilidade', slug: 'utilidade' },
        ],
      },
    },
    social: 'Redes sociais',
    wallets: 'Carteiras compatíveis',
    walletsList: 'METAMASK • WALLETCONNECT • COINBASE',
    copyright: '© 2026 Kurio. Propriedade digital para todos.',
    version: (commit: string) => `Versão ${commit}`,
  },
  notFound: { title: 'Página não encontrada', back: 'Voltar ao início' },
} as const

export type Dictionary = typeof pt
