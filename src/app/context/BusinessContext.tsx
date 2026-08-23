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
  
  // Helper to detect if we're in demo mode (using mock tokens)
  const isDemoMode = () => {
    try {
      const sessionStr = localStorage.getItem('supabase.auth.token');
      if (!sessionStr) return false;
      const session = JSON.parse(sessionStr);
      const token = session?.currentSession?.access_token;
      // Demo tokens start with 'token-' or are 'demo-token'
      return token && (token.startsWith('token-') || token === 'demo-token');
    } catch {
      return false;
    }
  };
  
  // Load initial data from localStorage in one pass to ensure consistency
  const getInitialState = () => {
    if (!user) {
      return {
        businesses: [],
        currentBusiness: null,
        locations: [],
        currentLocation: null,
      };
    }
    
    try {
      // Load businesses
      const localBusinessesStr = localStorage.getItem(`local-businesses-${user.id}`);
      const businesses: Business[] = localBusinessesStr ? JSON.parse(localBusinessesStr) : [];
      const currentBusiness = businesses.length > 0 ? businesses[0] : null;
      
      // Load locations if we have a current business
      let locations: Location[] = [];
      let currentLocation: Location | null = null;
      if (currentBusiness) {
        const localLocationsStr = localStorage.getItem(`local-locations-${currentBusiness.id}`);
        locations = localLocationsStr ? JSON.parse(localLocationsStr) : [];
        currentLocation = locations.length > 0 ? (locations.find(l => l.isDefault) || locations[0]) : null;
      }
      
      if (businesses.length > 0) {
        console.log('Initialized from localStorage:', { 
          businesses: businesses.length, 
          locations: locations.length 
        });
      }
      
      return { businesses, currentBusiness, locations, currentLocation };
    } catch (error) {
      console.error('Error loading initial state:', error);
      return {
        businesses: [],
        currentBusiness: null,
        locations: [],
        currentLocation: null,
      };
    }
  };
  
  const initialState = getInitialState();
  const [businesses, setBusinesses] = useState<Business[]>(initialState.businesses);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(initialState.currentBusiness);
  const [locations, setLocations] = useState<Location[]>(initialState.locations);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(initialState.currentLocation);
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
      } else {
        // Try localStorage as last resort
        const localBusinesses = JSON.parse(localStorage.getItem(`local-businesses-${user.id}`) || '[]');
        if (localBusinesses.length > 0) {
          console.log('Using local businesses as fallback');
          setBusinesses(localBusinesses);
          
          if (!currentBusiness && localBusinesses.length > 0) {
            setCurrentBusiness(localBusinesses[0]);
          }
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
      
      // Try localStorage as fallback
      const localLocations = JSON.parse(localStorage.getItem(`local-locations-${currentBusiness.id}`) || '[]');
      if (localLocations.length > 0) {
        console.log('Using local locations as fallback');
        setLocations(localLocations);
        
        if (!currentLocation && localLocations.length > 0) {
          const defaultLocation = localLocations.find((l: Location) => l.isDefault) || localLocations[0];
          setCurrentLocation(defaultLocation);
        }
      }
    }
  };

  const createBusiness = async (data: Partial<Business>): Promise<Business> => {
    if (!user) throw new Error("User not authenticated");
    
    // ALWAYS try server first - even in demo mode
    // The server handles both real and demo tokens via getUserId()
    console.log('🚀 Attempting to create business on server...');
    
    const apiUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6451509a`;
    const getAuthHeader = () => {
      const session = JSON.parse(localStorage.getItem("supabase.auth.token") || "{}");
      const accessToken = session?.currentSession?.access_token || publicAnonKey;
      return { Authorization: `Bearer ${accessToken}` };
    };
    
    try {
      const response = await fetch(`${apiUrl}/businesses`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (response.ok && result.business) {
        console.log('✅ Business created successfully on server:', result.business);
        
        // Also save to localStorage for offline access
        const localBusinesses = JSON.parse(localStorage.getItem(`local-businesses-${user.id}`) || '[]');
        localBusinesses.push(result.business);
        localStorage.setItem(`local-businesses-${user.id}`, JSON.stringify(localBusinesses));
        
        // Invalidate cache and refresh
        appCache.remove(`businesses:${user.id}`);
        await refreshBusinesses();
        return result.business;
      }
      
      throw new Error(result.error || "Failed to create business - no business object in response");
    } catch (error) {
      console.error('⚠️ Server error, falling back to localStorage:', error);
      
      // Fallback: Create business locally if server is unavailable
      const businessId = crypto.randomUUID();
      const business: Business = {
        id: businessId,
        userId: user.id,
        name: data.name || "My Business",
        industry: data.industry || "General",
        currency: data.currency || "NGN",
        locations: data.locations || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      const localBusinesses = JSON.parse(localStorage.getItem(`local-businesses-${user.id}`) || '[]');
      localBusinesses.push(business);
      localStorage.setItem(`local-businesses-${user.id}`, JSON.stringify(localBusinesses));

      console.log('✅ Business created locally in fallback mode:', business);
      
      // Update state
      setBusinesses([...businesses, business]);
      setCurrentBusiness(business);
      appCache.set(`businesses:${user.id}`, [...businesses, business]);
      
      return business;
    }
  };

  const createLocation = async (data: Partial<Location>): Promise<Location> => {
    // Use provided businessId or fall back to currentBusiness
    const businessId = data.businessId || currentBusiness?.id;
    if (!businessId) throw new Error("No business selected");
    
    // ALWAYS try server first - even in demo mode
    // The server handles both real and demo tokens via getUserId()
    console.log('🚀 Attempting to create location on server...');
    
    try {
      const response = await fetch(`${apiUrl}/locations/${businessId}`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const responseText = await response.text();
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}`);
      }
      
      if (response.ok && result.location) {
        console.log('✅ Location created successfully on server:', result.location);
        
        // Also save to localStorage for offline access
        const localLocations = JSON.parse(localStorage.getItem(`local-locations-${businessId}`) || '[]');
        localLocations.push(result.location);
        localStorage.setItem(`local-locations-${businessId}`, JSON.stringify(localLocations));
        
        // Refresh and return
        await refreshLocations();
        return result.location;
      }
      
      throw new Error(result.error || `Server error: ${response.status}`);
    } catch (error) {
      console.error('⚠️ Server error, falling back to localStorage:', error);
      
      // Fallback: Create location locally if server is unavailable
      const locationId = crypto.randomUUID();
      const location: Location = {
        id: locationId,
        businessId: businessId,
        name: data.name || "Main Location",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        country: data.country || "Nigeria",
        isDefault: data.isDefault || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Store in localStorage
      const localLocations = JSON.parse(localStorage.getItem(`local-locations-${businessId}`) || '[]');
      localLocations.push(location);
      localStorage.setItem(`local-locations-${businessId}`, JSON.stringify(localLocations));
      
      // Update state
      setLocations([...locations, location]);
      setCurrentLocation(location);
      
      console.log('✅ Location created locally in fallback mode:', location);
      return location;
    }
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