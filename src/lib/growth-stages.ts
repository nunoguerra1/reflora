export const STAGE_COUNT = 4;

export const STAGE_CONTENT = [
    {
        key: "seed",
        label: "Semente",
        text: "Toda árvore começa igual: uma semente no escuro, esperando o momento certo.",
    },
    {
        key: "sprout",
        label: "Broto",
        text: "Registre o primeiro broto com foto e data — o início da timeline de crescimento.",
    },
    {
        key: "sapling",
        label: "Muda",
        text: "Lembretes de rega e adubação chegam na hora certa, sem você precisar lembrar.",
    },
    {
        key: "tree",
        label: "Árvore",
        text: "Cada árvore registrada entra no mapa da comunidade e no impacto coletivo.",
    },
] as const;

const FADE = 0.08;

export function getStageOpacity(progress: number, stageIndex: number) {
    const segment = 1 / STAGE_COUNT;
    const start = stageIndex * segment;
    const end = start + segment;

    if (progress < start - FADE || progress > end + FADE) return 0;
    if (progress < start) return (progress - (start - FADE)) / FADE;
    if (progress > end) return 1 - (progress - end) / FADE;
    return 1;
}