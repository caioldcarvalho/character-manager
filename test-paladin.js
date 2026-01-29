import { createSamplePaladin } from './src/lib/utils/sample-paladin.ts';

const paladin = createSamplePaladin();

console.log('✅ Sample Paladin Created Successfully!');
console.log('\n📋 Character Details:');
console.log(`Name: ${paladin.name}`);
console.log(`Level: ${paladin.level}`);
console.log(`Race: ${paladin.race?.name}`);
console.log(`Class: ${paladin.class?.name}`);
console.log(`\n💪 Ability Scores:`);
console.log(`STR: ${paladin.abilityScores.strength}`);
console.log(`DEX: ${paladin.abilityScores.dexterity}`);
console.log(`CON: ${paladin.abilityScores.constitution}`);
console.log(`INT: ${paladin.abilityScores.intelligence}`);
console.log(`WIS: ${paladin.abilityScores.wisdom}`);
console.log(`CHA: ${paladin.abilityScores.charisma}`);
console.log(`\n❤️ HP: ${paladin.hitPoints.current}/${paladin.hitPoints.max}`);
console.log(`🛡️ AC: ${paladin.combatStats.armorClass}`);
console.log(`⚡ Proficiency Bonus: +${paladin.combatStats.proficiencyBonus}`);
console.log(`\n✨ Spell Slots:`);
console.log(`Level 1: ${paladin.spellSlots.level1.current}/${paladin.spellSlots.level1.max}`);
console.log(`Level 2: ${paladin.spellSlots.level2.current}/${paladin.spellSlots.level2.max}`);
console.log(`\n🙏 Paladin Resources:`);
console.log(`Lay on Hands: ${paladin.paladinResources.layOnHands.current}/${paladin.paladinResources.layOnHands.max}`);
console.log(`Channel Divinity: ${paladin.paladinResources.channelDivinity.current}/${paladin.paladinResources.channelDivinity.max}`);
console.log(`\n⚔️ Fighting Style: ${paladin.fightingStyle}`);
console.log(`\n📚 Class Features: ${paladin.classFeatures.length}`);
console.log(`📖 Known Spells: ${paladin.knownSpells.length}`);
console.log(`\n🎯 Proficient Skills:`);
Object.entries(paladin.skills).forEach(([key, skill]) => {
  if (skill.proficient) {
    console.log(`  - ${skill.name}`);
  }
});

console.log('\n✨ All tests passed! Paladin is ready to use.');
