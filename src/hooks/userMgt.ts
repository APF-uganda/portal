import { useState, useEffect, useCallback } from 'react';
import { userManagementApi } from '../services/manageuser';
import { User } from '../components/manageusers-components/users';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userManagementApi.fetchMembers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      if (currentStatus === 'Suspended') {
        await userManagementApi.reactivateMember(id);
      } else {
        await userManagementApi.suspendMember(id);
      }
      
      await fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to update member status");
    }
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    handleToggleStatus
  };
};