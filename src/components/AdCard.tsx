import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface AdCardProps {
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  className?: string;
}

const AdCard: React.FC<AdCardProps> = ({ 
  title, 
  description, 
  image_url, 
  link_url,
  className = ""
}) => {
  const handleClick = () => {
    if (link_url) {
      window.open(link_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className={`bg-gradient-to-br from-secondary/20 to-accent/20 border-2 border-dashed border-secondary/50 hover:border-secondary transition-all duration-300 cursor-pointer group ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-4 text-center">
        {image_url && (
          <div className="mb-3 overflow-hidden rounded-lg">
            <img
              src={image_url}
              alt={title}
              className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-foreground/90 group-hover:text-foreground transition-colors">
            {title}
          </h3>
          
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
          
          {link_url && (
            <div className="flex items-center justify-center text-xs text-primary group-hover:text-primary/80">
              <ExternalLink className="h-3 w-3 mr-1" />
              <span>Learn More</span>
            </div>
          )}
        </div>
        
        <div className="absolute top-2 right-2 bg-accent/80 text-accent-foreground text-xs px-2 py-1 rounded-full">
          Ad
        </div>
      </CardContent>
    </Card>
  );
};

export default AdCard;