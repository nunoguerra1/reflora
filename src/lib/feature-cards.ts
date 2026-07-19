export type FeatureCard = {
    id: string;
    title: string;
    description: string;
};

export const FEATURE_CARDS: FeatureCard[] = [
    {
        id: "diario",
        title: "Diário de crescimento",
        description: "Fotos e notas ao longo do tempo, numa timeline visual.",
    },
    {
        id: "lembretes",
        title: "Lembretes automáticos",
        description: "Rega e adubação chegam na hora certa, sem esforço.",
    },
    {
        id: "mapa",
        title: "Mapa da comunidade",
        description: "Descubra jardins e árvores plantadas perto de você.",
    },
    {
        id: "impacto",
        title: "Impacto coletivo",
        description: "Veja o CO₂ estimado que a comunidade já absorveu.",
    },
];