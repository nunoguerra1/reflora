export const CAMERA_BEATS = [
    {
        position: [2.4, 0.8, 3.6] as [number, number, number],
        label: "Visão geral",
        text: "Cada árvore começa como uma muda — e uma história pra contar.",
    },
    {
        position: [0.3, 1.7, 1.6] as [number, number, number],
        label: "Crescimento",
        text: "Registre o crescimento com fotos. Cada estágio vira parte da timeline.",
    },
    {
        position: [-2.0, 0.5, 1.7] as [number, number, number],
        label: "Cuidado",
        text: "Lembretes de rega e adubação chegam na hora certa, sem esforço.",
    },
    {
        position: [0.4, -0.3, 2.4] as [number, number, number],
        label: "Comunidade",
        text: "Cada planta registrada entra no mapa da comunidade e no impacto coletivo.",
    },
];

const FADE = 0.08;

export function getBeatOpacity(progress: number, index: number, total: number) {
    const segment = 1 / total;
    const start = index * segment;
    const end = start + segment;

    if (progress < start - FADE || progress > end + FADE) return 0;
    if (progress < start) return (progress - (start - FADE)) / FADE;
    if (progress > end) return 1 - (progress - end) / FADE;
    return 1;
}