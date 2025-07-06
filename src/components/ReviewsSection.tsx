import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewsSectionProps {
  productId: string;
  productName: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    user_name: '',
    rating: 5,
    comment: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading reviews:', error);
    } else {
      setReviews(data || []);
    }
  };

  const submitReview = async () => {
    if (!newReview.user_name.trim() || !newReview.comment.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        user_name: newReview.user_name,
        rating: newReview.rating,
        comment: newReview.comment
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Review submitted successfully",
      });
      setNewReview({ user_name: '', rating: 5, comment: '' });
      setShowForm(false);
      loadReviews();
    }
    setLoading(false);
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <span>Reviews for {productName}</span>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">{renderStars(Math.round(averageRating))}</div>
                <span className="text-sm text-muted-foreground">
                  ({averageRating.toFixed(1)} / 5 from {reviews.length} reviews)
                </span>
              </div>
            )}
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Write Review'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <Input
                  value={newReview.user_name}
                  onChange={(e) => setNewReview({ ...newReview, user_name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setNewReview({ ...newReview, rating: i + 1 })}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          i < newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                  rows={3}
                />
              </div>
              
              <Button onClick={submitReview} disabled={loading} className="w-full">
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.user_name}</span>
                    <div className="flex">{renderStars(review.rating)}</div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsSection;