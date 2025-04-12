
import React, { useState } from 'react';
import { User, Bookmark, Heart, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserAccountPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [savedLists, setSavedLists] = useState([
    { id: 1, name: "Weekly Groceries", items: 12 },
    { id: 2, name: "Monthly Stock-up", items: 24 }
  ]);
  
  if (!isLoggedIn && !showLoginForm) {
    return (
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Save your lists and get alerts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to track your favorite products</p>
          </div>
          <Button 
            onClick={() => setShowLoginForm(true)}
            className="bg-app-green hover:bg-app-green/90"
          >
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </div>
      </div>
    );
  }
  
  if (showLoginForm) {
    return (
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <h3 className="font-medium mb-3">Sign In</h3>
        <form className="space-y-3">
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={(e) => {
                e.preventDefault();
                setIsLoggedIn(true);
                setShowLoginForm(false);
              }}
              className="bg-app-green hover:bg-app-green/90"
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowLoginForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }
  
  return (
    <div className="mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Your Saved Lists</h3>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New List
          </Button>
        </div>
        
        <div className="space-y-2">
          {savedLists.map(list => (
            <div key={list.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-center">
                <List className="h-4 w-4 mr-2 text-app-green" />
                <span>{list.name}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{list.items} items</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserAccountPanel;
