import type { ClassFeature } from '../types';

// Fighter features by level (relevant up to 12)
export const FIGHTER_FEATURES: ClassFeature[] = [
  {
    name: 'Estilo de Luta',
    level: 1,
    description: 'Você escolhe um estilo de luta que oferece benefícios especiais em combate.',
  },
  {
    name: 'Retomar o Fôlego',
    level: 1,
    uses: { current: 1, max: 1 },
    description: 'Ação bônus: recupera 1d10 + nível de HP. Recarrega em descanso curto.',
  },
  {
    name: 'Surto de Ação',
    level: 2,
    uses: { current: 1, max: 1 },
    description: 'Uma ação adicional. Recarrega em descanso curto.',
  },
  {
    name: 'Ataque Extra',
    level: 5,
    description: 'Você pode atacar duas vezes, em vez de uma, quando usar a ação de Ataque em seu turno.',
  },
  {
    name: 'Ataque Extra (2)',
    level: 11,
    description:
      'Quando você usa a ação de Ataque em seu turno, você pode atacar três vezes, em vez de duas.',
  },
  {
    name: 'Indomável',
    level: 9,
    uses: { current: 1, max: 1 },
    description:
      'Quando você faz um teste de resistência que falha, você pode escolher ter sucesso. Recarrega em descanso longo.',
  },
];

// Psi Warrior features (level 3, 7, 10)
export const PSI_WARRIOR_FEATURES: ClassFeature[] = [
  {
    name: 'Campo Protetor',
    level: 3,
    description:
      'Reação: quando você ou um aliado a 9m de você toma dano, você pode reduzir esse dano em 1d10 + INT mod.',
  },
  {
    name: 'Golpe Psiônico',
    level: 3,
    description:
      'Quando você acerta um alvo com um ataque com arma, você pode gastar um dado psiônico para infligir 1d10 + INT mod de dano psíquico extra.',
  },
  {
    name: 'Movimento Telecinético',
    level: 3,
    description:
      'Ação: você pode mover um objeto Grande ou criatura voluntária até 9m. Requer linha de visão.',
  },
  {
    name: 'Salto Psiônico',
    level: 7,
    description: 'Ação bônus: você voa até 2× seu deslocamento. Termina ao final do turno.',
  },
  {
    name: 'Impulso Telecinético',
    level: 7,
    description:
      'Após Golpe Psiônico, o alvo faz save FOR ou é empurrado 3m e derrubado no chão.',
  },
  {
    name: 'Mente Guardada',
    level: 10,
    description:
      'Você ganha resistência a dano psíquico. Você pode gastar um dado psiônico para terminar uma condição amedrontado ou enfeitiçado.',
  },
];

// Psionic die size by level
export function getPsionicDieSize(level: number): number {
  if (level >= 11) return 10;
  if (level >= 5) return 8;
  return 6;
}

// Fighter fighting styles
export const FIGHTER_FIGHTING_STYLES = [
  {
    name: 'Defesa',
    description: '+1 CA quando você estiver usando armadura.',
  },
  {
    name: 'Duelo',
    description: '+2 dano quando estiver usando uma arma de uma mão e nenhuma outra arma.',
  },
  {
    name: 'Luta com Arma Grande',
    description:
      'Quando você rola um 1 ou 2 no dado de dano de um ataque com uma arma de duas mãos, você pode rerolá-lo.',
  },
  {
    name: 'Combate com Duas Armas',
    description: 'Você adiciona seu modificador de habilidade ao dano do seu ataque bônus.',
  },
  {
    name: 'Arqueria',
    description: '+2 em testes de ataque com armas à distância.',
  },
  {
    name: 'Proteção',
    description:
      'Quando um aliado que você pode ver dentro de 1,5m faz um teste de ataque, você pode usar sua reação para impor desvantagem nesse ataque.',
  },
];
