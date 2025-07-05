import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 pb-20">
        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold capitalize">
                {categoryName?.replace('-', ' ')} Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Products in the {categoryName} category will be displayed here.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default CategoryPage;