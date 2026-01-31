import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UnitSystem = 'imperial' | 'metric';

interface UnitsContextType {
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => Promise<void>;
  formatDistance: (miles: number) => string;
  formatDistanceShort: (miles: number) => string;
  getDistanceUnit: () => string;
  getDistanceUnitShort: () => string;
  formatElevation: (feet: number) => string;
  formatElevationShort: (feet: number) => string;
  getElevationUnit: () => string;
  getElevationUnitShort: () => string;
  convertDistance: (miles: number) => number;
  convertElevation: (feet: number) => number;
}

const UnitsContext = createContext<UnitsContextType | undefined>(undefined);

const UNITS_STORAGE_KEY = 'app_units';
const MILES_TO_KM = 1.60934;
const FEET_TO_METERS = 0.3048;

export function UnitsProvider({ children }: { children: ReactNode }) {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>('imperial');

  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      const saved = await AsyncStorage.getItem(UNITS_STORAGE_KEY);
      if (saved === 'imperial' || saved === 'metric') {
        setUnitSystemState(saved);
      }
    } catch (error) {
      console.error('Error loading units:', error);
    }
  };

  const setUnitSystem = async (system: UnitSystem) => {
    try {
      await AsyncStorage.setItem(UNITS_STORAGE_KEY, system);
      setUnitSystemState(system);
    } catch (error) {
      console.error('Error saving units:', error);
    }
  };

  const convertDistance = (miles: number): number => {
    return unitSystem === 'metric' ? miles * MILES_TO_KM : miles;
  };

  const formatDistance = (miles: number): string => {
    if (unitSystem === 'metric') {
      return `${(miles * MILES_TO_KM).toFixed(1)} kilometers`;
    }
    return `${miles.toFixed(1)} miles`;
  };

  const formatDistanceShort = (miles: number): string => {
    if (unitSystem === 'metric') {
      return `${(miles * MILES_TO_KM).toFixed(1)} km`;
    }
    return `${miles.toFixed(1)} mi`;
  };

  const getDistanceUnit = (): string => {
    return unitSystem === 'metric' ? 'kilometers' : 'miles';
  };

  const getDistanceUnitShort = (): string => {
    return unitSystem === 'metric' ? 'km' : 'mi';
  };

  const convertElevation = (feet: number): number => {
    return unitSystem === 'metric' ? feet * FEET_TO_METERS : feet;
  };

  const formatElevation = (feet: number): string => {
    if (unitSystem === 'metric') {
      return `${Math.round(feet * FEET_TO_METERS).toLocaleString()} meters`;
    }
    return `${Math.round(feet).toLocaleString()} feet`;
  };

  const formatElevationShort = (feet: number): string => {
    if (unitSystem === 'metric') {
      return `${Math.round(feet * FEET_TO_METERS).toLocaleString()} m`;
    }
    return `${Math.round(feet).toLocaleString()} ft`;
  };

  const getElevationUnit = (): string => {
    return unitSystem === 'metric' ? 'meters' : 'feet';
  };

  const getElevationUnitShort = (): string => {
    return unitSystem === 'metric' ? 'm' : 'ft';
  };

  return (
    <UnitsContext.Provider value={{
      unitSystem,
      setUnitSystem,
      formatDistance,
      formatDistanceShort,
      getDistanceUnit,
      getDistanceUnitShort,
      formatElevation,
      formatElevationShort,
      getElevationUnit,
      getElevationUnitShort,
      convertDistance,
      convertElevation,
    }}>
      {children}
    </UnitsContext.Provider>
  );
}

export function useUnits() {
  const context = useContext(UnitsContext);
  if (context === undefined) {
    throw new Error('useUnits must be used within a UnitsProvider');
  }
  return context;
}