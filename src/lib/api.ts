import type { Race, CharacterClass, APIReference, ClassLevelData, FeatureDetails, SpellcastingInfo } from './types';

const API_BASE_URL = 'https://www.dnd5eapi.co/api/2014';

export async function getRaces(): Promise<{ count: number; results: APIReference[] }> {
  const response = await fetch(`${API_BASE_URL}/races`);
  if (!response.ok) {
    throw new Error(`Failed to fetch races: ${response.statusText}`);
  }
  return response.json();
}

export async function getRaceDetails(index: string): Promise<Race> {
  const response = await fetch(`${API_BASE_URL}/races/${index}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch race details: ${response.statusText}`);
  }
  return response.json();
}

export async function getClasses(): Promise<{ count: number; results: APIReference[] }> {
  const response = await fetch(`${API_BASE_URL}/classes`);
  if (!response.ok) {
    throw new Error(`Failed to fetch classes: ${response.statusText}`);
  }
  return response.json();
}

export async function getClassDetails(index: string): Promise<CharacterClass> {
  const response = await fetch(`${API_BASE_URL}/classes/${index}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch class details: ${response.statusText}`);
  }
  return response.json();
}

export async function getClassLevel(classIndex: string, level: number): Promise<ClassLevelData> {
  const response = await fetch(`${API_BASE_URL}/classes/${classIndex}/levels/${level}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch class level: ${response.statusText}`);
  }
  return response.json();
}

export async function getClassLevels(classIndex: string): Promise<ClassLevelData[]> {
  const response = await fetch(`${API_BASE_URL}/classes/${classIndex}/levels`);
  if (!response.ok) {
    throw new Error(`Failed to fetch class levels: ${response.statusText}`);
  }
  return response.json();
}

export async function getFeatureDetails(featureIndex: string): Promise<FeatureDetails> {
  const response = await fetch(`${API_BASE_URL}/features/${featureIndex}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch feature details: ${response.statusText}`);
  }
  return response.json();
}

export async function getClassSpellcasting(classIndex: string): Promise<SpellcastingInfo> {
  const response = await fetch(`${API_BASE_URL}/classes/${classIndex}/spellcasting`);
  if (!response.ok) {
    throw new Error(`Failed to fetch spellcasting info: ${response.statusText}`);
  }
  return response.json();
}
