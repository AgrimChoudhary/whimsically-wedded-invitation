
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, Users, UserPlus, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GuestForm from './GuestForm';
import GuestCard from './GuestCard';

interface Guest {
  id: string;
  name: string;
  mobile: string;
  status: string | null;
  created_at: string;
  updated_at: string | null;
}

const GuestManagementLayout: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: guests = [], isLoading, refetch } = useQuery({
    queryKey: ['guests'],
    queryFn: async () => {
      console.log('Fetching guests...');
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching guests:', error);
        throw error;
      }
      
      console.log('Fetched guests:', data);
      return data as Guest[];
    },
  });

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guest.mobile.includes(searchTerm);
    const matchesStatus = statusFilter === null || guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGuestAdded = () => {
    refetch();
    setShowForm(false);
  };

  const statusCounts = {
    total: guests.length,
    confirmed: guests.filter(g => g.status === 'confirmed').length,
    declined: guests.filter(g => g.status === 'declined').length,
    pending: guests.filter(g => g.status === null).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-cream/30 via-white to-wedding-blush/20">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart size={24} className="text-wedding-gold" fill="currentColor" />
            <h1 className="font-playfair text-3xl lg:text-4xl text-wedding-maroon">
              Guest Management
            </h1>
            <Heart size={24} className="text-wedding-gold" fill="currentColor" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your wedding guest list and track RSVPs
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-wedding-gold/20 text-center">
            <div className="text-2xl font-bold text-wedding-maroon">{statusCounts.total}</div>
            <div className="text-sm text-gray-600">Total Guests</div>
          </div>
          <div className="bg-green-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </div>
          <div className="bg-red-50/80 backdrop-blur-sm rounded-xl p-4 border border-red-200 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.declined}</div>
            <div className="text-sm text-gray-600">Declined</div>
          </div>
          <div className="bg-yellow-50/80 backdrop-blur-sm rounded-xl p-4 border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-wedding-gold/30 focus-visible:ring-wedding-gold/30"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === null ? "default" : "outline"}
                onClick={() => setStatusFilter(null)}
                className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'confirmed' ? "default" : "outline"}
                onClick={() => setStatusFilter('confirmed')}
              >
                Confirmed
              </Button>
              <Button
                variant={statusFilter === 'declined' ? "default" : "outline"}
                onClick={() => setStatusFilter('declined')}
              >
                Declined
              </Button>
              <Button
                variant={statusFilter === null ? "outline" : "default"}
                onClick={() => setStatusFilter(null)}
              >
                Pending
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="bg-wedding-gold hover:bg-wedding-deep-gold text-white"
          >
            <UserPlus size={16} className="mr-2" />
            Add Guest
          </Button>
        </div>

        {/* Guest Form */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-wedding-gold/30 mb-8">
            <GuestForm onSuccess={handleGuestAdded} />
          </div>
        )}

        {/* Guest List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Loading guests...</p>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-xl border border-wedding-gold/20">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchTerm ? 'No guests found' : 'No guests yet'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first guest to get started'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuests.map((guest) => (
              <GuestCard 
                key={guest.id} 
                guest={guest} 
                onUpdate={refetch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestManagementLayout;
