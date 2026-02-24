// Unit conversion utilities for inventory management

export interface UnitType {
  name: string;
  symbol: string;
  category: 'weight' | 'volume' | 'length' | 'piece';
  baseUnit: string;
  toBaseMultiplier: number;
}

export const UNIT_TYPES: Record<string, UnitType> = {
  // Weight
  kg: { name: 'Kilogram', symbol: 'kg', category: 'weight', baseUnit: 'kg', toBaseMultiplier: 1 },
  g: { name: 'Gram', symbol: 'g', category: 'weight', baseUnit: 'kg', toBaseMultiplier: 0.001 },
  mg: { name: 'Milligram', symbol: 'mg', category: 'weight', baseUnit: 'kg', toBaseMultiplier: 0.000001 },
  ton: { name: 'Ton', symbol: 'ton', category: 'weight', baseUnit: 'kg', toBaseMultiplier: 1000 },
  lb: { name: 'Pound', symbol: 'lb', category: 'weight', baseUnit: 'kg', toBaseMultiplier: 0.453592 },
  oz: { name: 'Ounce', symbol: 'oz', category: 'weight', baseUnit: 'kg', toBaseMultiplier: 0.0283495 },
  
  // Volume
  liter: { name: 'Liter', symbol: 'L', category: 'volume', baseUnit: 'liter', toBaseMultiplier: 1 },
  ml: { name: 'Milliliter', symbol: 'ml', category: 'volume', baseUnit: 'liter', toBaseMultiplier: 0.001 },
  gallon: { name: 'Gallon', symbol: 'gal', category: 'volume', baseUnit: 'liter', toBaseMultiplier: 3.78541 },
  
  // Length
  meter: { name: 'Meter', symbol: 'm', category: 'length', baseUnit: 'meter', toBaseMultiplier: 1 },
  cm: { name: 'Centimeter', symbol: 'cm', category: 'length', baseUnit: 'meter', toBaseMultiplier: 0.01 },
  mm: { name: 'Millimeter', symbol: 'mm', category: 'length', baseUnit: 'meter', toBaseMultiplier: 0.001 },
  km: { name: 'Kilometer', symbol: 'km', category: 'length', baseUnit: 'meter', toBaseMultiplier: 1000 },
  inch: { name: 'Inch', symbol: 'in', category: 'length', baseUnit: 'meter', toBaseMultiplier: 0.0254 },
  foot: { name: 'Foot', symbol: 'ft', category: 'length', baseUnit: 'meter', toBaseMultiplier: 0.3048 },
  yard: { name: 'Yard', symbol: 'yd', category: 'length', baseUnit: 'meter', toBaseMultiplier: 0.9144 },
  
  // Piece/Count
  piece: { name: 'Piece', symbol: 'pc', category: 'piece', baseUnit: 'piece', toBaseMultiplier: 1 },
  dozen: { name: 'Dozen', symbol: 'doz', category: 'piece', baseUnit: 'piece', toBaseMultiplier: 12 },
  pack: { name: 'Pack', symbol: 'pack', category: 'piece', baseUnit: 'piece', toBaseMultiplier: 1 },
  box: { name: 'Box', symbol: 'box', category: 'piece', baseUnit: 'piece', toBaseMultiplier: 1 },
};

/**
 * Convert a quantity from one unit to another
 */
export function convertUnit(
  quantity: number,
  fromUnit: string,
  toUnit: string
): number | null {
  const from = UNIT_TYPES[fromUnit];
  const to = UNIT_TYPES[toUnit];

  if (!from || !to) {
    console.error(`Invalid unit: ${fromUnit} or ${toUnit}`);
    return null;
  }

  // Can only convert within the same category
  if (from.category !== to.category) {
    console.error(`Cannot convert between ${from.category} and ${to.category}`);
    return null;
  }

  // Convert to base unit first, then to target unit
  const inBaseUnit = quantity * from.toBaseMultiplier;
  const result = inBaseUnit / to.toBaseMultiplier;

  return result;
}

/**
 * Get all units in a category
 */
export function getUnitsInCategory(category: UnitType['category']): UnitType[] {
  return Object.values(UNIT_TYPES).filter(unit => unit.category === category);
}

/**
 * Format a quantity with its unit
 */
export function formatQuantity(quantity: number, unit: string): string {
  const unitType = UNIT_TYPES[unit];
  if (!unitType) return `${quantity}`;
  
  return `${quantity.toLocaleString()} ${unitType.symbol}`;
}

/**
 * Check if conversion is possible between two units
 */
export function canConvert(fromUnit: string, toUnit: string): boolean {
  const from = UNIT_TYPES[fromUnit];
  const to = UNIT_TYPES[toUnit];
  
  if (!from || !to) return false;
  return from.category === to.category;
}

/**
 * Get suggested conversions for a unit
 */
export function getSuggestedConversions(unit: string): UnitType[] {
  const unitType = UNIT_TYPES[unit];
  if (!unitType) return [];
  
  return getUnitsInCategory(unitType.category).filter(u => u.name !== unitType.name);
}
