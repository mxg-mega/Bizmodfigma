import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { appCache } from "../utils/localCache";

interface Business {
  id: string;
  userId: string;
  name: string;
  industry: string;
  currency: string;
  locations: string[];
  createdAt: string;
  updatedAt: string;
}

interface Location {
  id: string;
  businessId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BusinessContextType {
  businesses: Business[];
  currentBusiness: Business | null;
  locations: Location[];
  currentLocation: Location | null;
  loading: boolean;
  setCurrentBusiness: (business: Business) => void;
  setCurrentLocation: (location: Location) => void;
  createBusiness: (data: Partial<Business>) => Promise<Business>;
  createLocation: (data: Partial<Location>) => Promise<Location>;
  refreshBusinesses: () => Promise<void>;
  refreshLocations: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6451509a`;

  const getAuthHeader = () => {
    const session = JSON.parse(localStorage.getItem("supabase.auth.token") || "{}");
    const accessToken = session?.currentSession?.access_token || publicAnonKey;
    return { Authorization: `Bearer ${accessToken}` };
  };

  const refreshBusinesses = async () => {
    if (!user) return;
    
    try {
      // Try to load from cache first for faster initial load
      const cachedBusinesses = appCache.get<Business[]>(`businesses:${user.id}`);
      if (cachedBusinesses) {
        console.log('Loaded businesses from cache');
        setBusinesses(cachedBusinesses);
        
        // Set current business if not set
        if (!currentBusiness && cachedBusinesses.length > 0) {
          setCurrentBusiness(cachedBusinesses[0]);
        }
      }

      // Fetch from server
      const response = await fetch(`${apiUrl}/businesses`, {
        headers: getAuthHeader(),
      });
      const data = await response.json();
      
      if (data.businesses) {
        setBusinesses(data.businesses);
        
        // Cache the businesses for 1 hour
        appCache.set(`businesses:${user.id}`, data.businesses, 60 * 60 * 1000);
        
        // Set current business if not set
        if (!currentBusiness && data.businesses.length > 0) {
          setCurrentBusiness(data.businesses[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
      
      // If fetch fails, try to use cached data as fallback
      const cachedBusinesses = appCache.get<Business[]>(`businesses:${user.id}`);
      if (cachedBusinesses) {
        console.log('Using cached businesses as fallback');
        setBusinesses(cachedBusinesses);
        
        if (!currentBusiness && cachedBusinesses.length > 0) {
          setCurrentBusiness(cachedBusinesses[0]);
        }
      }
    }
  };

  const refreshLocations = async () => {
    if (!currentBusiness) return;
    
    try {
      const response = await fetch(`${apiUrl}/locations/${currentBusiness.id}`, {
        headers: getAuthHeader(),
      });
      const data = await response.json();
      setLocations(data.locations || []);
      
      // Set current location if not set
      if (!currentLocation && data.locations?.length > 0) {
        const defaultLocation = data.locations.find((l: Location) => l.isDefault) || data.locations[0];
        setCurrentLocation(defaultLocation);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const createBusiness = async (data: Partial<Business>): Promise<Business> => {
    const response = await fetch(`${apiUrl}/businesses`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.business) {
      await refreshBusinesses();
      return result.business;
    }
    throw new Error(result.error || "Failed to create business");
  };

  const createLocation = async (data: Partial<Location>): Promise<Location> => {
    if (!currentBusiness) throw new Error("No business selected");
    
    const response = await fetch(`${apiUrl}/locations/${currentBusiness.id}`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.location) {
      await refreshLocations();
      return result.location;
    }
    throw new Error(result.error || "Failed to create location");
  };

  useEffect(() => {
    if (user) {
      refreshBusinesses().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (currentBusiness) {
      refreshLocations();
    }
  }, [currentBusiness]);

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        currentBusiness,
        locations,
        currentLocation,
        loading,
        setCurrentBusiness,
        setCurrentLocation,
        createBusiness,
        createLocation,
        refreshBusinesses,
        refreshLocations,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}