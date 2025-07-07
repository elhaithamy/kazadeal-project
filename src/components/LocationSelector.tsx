import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationSelectorProps {
  onLocationChange?: (location: Location) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationChange }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const { toast } = useToast();

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      toast({
        title: 'Location not supported',
        description: 'Your browser does not support location services',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const requestLocation = async () => {
    setLoading(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          }
        );
      });

      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setLocation(newLocation);
      setPermission('granted');
      onLocationChange?.(newLocation);

      toast({
        title: 'Location detected',
        description: 'We can now show you nearby stores',
      });
    } catch (error: any) {
      setPermission('denied');
      
      let errorMessage = 'Unable to get your location';
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 'Location access denied. Please enable location in your browser settings.';
      } else if (error.code === error.TIMEOUT) {
        errorMessage = 'Location request timed out. Please try again.';
      }

      toast({
        title: 'Location error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (location) {
    return (
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Location detected</p>
                <p className="text-xs text-muted-foreground">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={requestLocation}>
              <Navigation className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Find Nearby Stores</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Allow location access to find the closest supermarkets and get the best deals near you.
        </p>
        <Button 
          onClick={requestLocation} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Getting location...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4 mr-2" />
              Enable Location
            </>
          )}
        </Button>
        {permission === 'denied' && (
          <p className="text-xs text-destructive mt-2">
            Location access was denied. Please enable it in your browser settings to use this feature.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSelector;