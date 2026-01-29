import type { Spell } from '$lib/types';

export const PALADIN_SPELLS: Spell[] = [
  // 1st Level Spells
  {
    name: 'Bênção',
    level: 1,
    school: 'Encantamento',
    castingTime: '1 ação',
    range: '9 metros',
    duration: 'Concentração, até 1 minuto',
    concentration: true,
    description: 'Você abençoa até três criaturas à sua escolha, dentro do alcance. Sempre que um alvo fizer uma jogada de ataque ou um teste de resistência antes da magia acabar, o alvo pode rolar um d4 e adicionar o resultado à jogada de ataque ou ao teste de resistência.',
    prepared: false
  },
  {
    name: 'Comando',
    level: 1,
    school: 'Encantamento',
    castingTime: '1 ação',
    range: '18 metros',
    duration: '1 rodada',
    concentration: false,
    description: 'Você profere um comando de uma palavra para uma criatura que você possa ver, dentro do alcance. O alvo deve ser bem sucedido num teste de resistência de Sabedoria ou seguir o comando no próximo turno dele. A magia não produz efeito se o alvo for um morto-vivo, se ele não entender o seu idioma ou se o seu comando for diretamente nocivo a ele.',
    prepared: false
  },
  {
    name: 'Curar Ferimentos',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação',
    range: 'Toque',
    duration: 'Instantânea',
    concentration: false,
    description: 'Uma criatura que você tocar recupera um número de pontos de vida igual a 1d8 + seu modificador de habilidade de conjuração. Essa magia não produz efeito em mortos-vivos ou constructos.',
    prepared: false
  },
  {
    name: 'Detectar Bem e Mal',
    level: 1,
    school: 'Adivinhação',
    castingTime: '1 ação',
    range: 'Pessoal',
    duration: 'Concentração, até 10 minutos',
    concentration: true,
    description: 'Pela duração, você sabe se existe uma aberração, celestial, corruptor, elemental, fada ou morto-vivo a até 9 metros de você, assim como onde a criatura está localizada. Similarmente, você sabe se existe um local ou objeto a até 9 metros de você que tenha sido consagrado ou profanado magicamente.',
    prepared: false
  },
  {
    name: 'Favor Divino',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação bônus',
    range: 'Pessoal',
    duration: 'Concentração, até 1 minuto',
    concentration: true,
    description: 'Sua prece o fortalece com radiância divina. Até a magia acabar, suas jogadas de ataque com arma causam 1d4 de dano radiante extra em um acerto.',
    prepared: false
  },
  {
    name: 'Heroísmo',
    level: 1,
    school: 'Encantamento',
    castingTime: '1 ação',
    range: 'Toque',
    duration: 'Concentração, até 1 minuto',
    concentration: true,
    description: 'Uma criatura voluntária que você tocar é imbuída com bravura. Até a magia acabar, a criatura é imune a estar amedrontada e ganha pontos de vida temporários iguais ao seu modificador de habilidade de conjuração no começo de cada um dos turnos dela.',
    prepared: false
  },
  {
    name: 'Proteção Contra Bem e Mal',
    level: 1,
    school: 'Abjuração',
    castingTime: '1 ação',
    range: 'Toque',
    duration: 'Concentração, até 10 minutos',
    concentration: true,
    description: 'Até a magia acabar, uma criatura voluntária que você tocar estará protegida contra certos tipos de criaturas: aberrações, celestiais, corruptores, elementais, fadas e mortos-vivos. A proteção garante diversos benefícios.',
    prepared: false
  },
  {
    name: 'Escudo da Fé',
    level: 1,
    school: 'Abjuração',
    castingTime: '1 ação bônus',
    range: '18 metros',
    duration: 'Concentração, até 10 minutos',
    concentration: true,
    description: 'Um campo cintilante aparece e envolve uma criatura, à sua escolha, dentro do alcance, concedendo a ela +2 de bônus em CA pela duração.',
    prepared: false
  },
  {
    name: 'Golpe Trovejante',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação bônus',
    range: 'Pessoal',
    duration: 'Concentração, até 1 minuto',
    concentration: true,
    description: 'Na primeira vez que você atingir com um ataque corpo a corpo com arma durante a duração da magia, sua arma retumba com trovão, que é audível a 90 metros de distância, e o ataque causa 2d6 de dano de trovão extra ao alvo. Além disso, se o alvo for uma criatura, ela deve ser bem sucedida num teste de resistência de Força ou será empurrada 3 metros para longe de você.',
    prepared: false
  },
  {
    name: 'Golpe Colérico',
    level: 1,
    school: 'Evocação',
    castingTime: '1 ação bônus',
    range: 'Pessoal',
    duration: 'Concentração, até 1 minuto',
    concentration: true,
    description: 'Na primeira vez que você atingir com um ataque corpo a corpo com arma durante a duração da magia, seu ataque causa 1d6 de dano psíquico extra. Além disso, se o alvo for uma criatura, ela deve fazer um teste de resistência de Sabedoria ou ficará amedrontada de você até a magia acabar.',
    prepared: false
  },
  // 2nd Level Spells
  {
    name: 'Ajuda',
    level: 2,
    school: 'Abjuração',
    castingTime: '1 ação',
    range: '9 metros',
    duration: '8 horas',
    concentration: false,
    description: 'Sua magia fortalece seus aliados com vigor e determinação. Escolha até três criaturas dentro do alcance. O máximo de pontos de vida e os pontos de vida atuais de cada alvo aumentam em 5 pela duração.',
    prepared: false
  },
  {
    name: 'Encontrar Montaria',
    level: 2,
    school: 'Conjuração',
    castingTime: '10 minutos',
    range: '9 metros',
    duration: 'Instantânea',
    concentration: false,
    description: 'Você invoca um espírito que assume a forma de uma montaria incrivelmente inteligente, forte e leal, criando um vínculo duradouro com ela. Aparecendo em um espaço desocupado dentro do alcance, a montaria adquire a forma que você escolher.',
    prepared: false
  },
  {
    name: 'Restauração Menor',
    level: 2,
    school: 'Abjuração',
    castingTime: '1 ação',
    range: 'Toque',
    duration: 'Instantânea',
    concentration: false,
    description: 'Você toca uma criatura e pode terminar uma doença ou uma condição que a esteja afligindo. A condição pode ser cega, surda, paralisada ou envenenada.',
    prepared: false
  },
  {
    name: 'Localizar Objeto',
    level: 2,
    school: 'Adivinhação',
    castingTime: '1 ação',
    range: 'Pessoal',
    duration: 'Concentração, até 10 minutos',
    concentration: true,
    description: 'Descreva ou nomeie um objeto que seja familiar para você. Você sente a direção para a localização do objeto, contanto que o objeto esteja a até 300 metros de você. Se o objeto estiver em movimento, você sabe a direção do movimento dele.',
    prepared: false
  },
  {
    name: 'Arma Mágica',
    level: 2,
    school: 'Transmutação',
    castingTime: '1 ação bônus',
    range: 'Toque',
    duration: 'Concentração, até 1 hora',
    concentration: true,
    description: 'Você toca uma arma não-mágica. Até a magia acabar, essa arma se torna uma arma mágica com +1 de bônus nas jogadas de ataque e de dano.',
    prepared: false
  },
  {
    name: 'Proteção Contra Veneno',
    level: 2,
    school: 'Abjuração',
    castingTime: '1 ação',
    range: 'Toque',
    duration: '1 hora',
    concentration: false,
    description: 'Você toca uma criatura. Se ela estiver envenenada, você neutraliza o veneno. Se mais de um veneno afligir o alvo, você neutraliza um veneno que saiba estar presente ou neutraliza um veneno aleatório.',
    prepared: false
  },
  {
    name: 'Zona da Verdade',
    level: 2,
    school: 'Encantamento',
    castingTime: '1 ação',
    range: '18 metros',
    duration: '10 minutos',
    concentration: false,
    description: 'Você cria uma zona mágica que protege contra mentiras em uma esfera de 4,5 metros de raio centrada num ponto, à sua escolha, dentro do alcance. Até a magia acabar, uma criatura que entrar na área da magia pela primeira vez em um turno ou começar o turno dela lá, deve realizar um teste de resistência de Carisma.',
    prepared: false
  }
];
