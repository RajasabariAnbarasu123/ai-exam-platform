import React, { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { showToast } from '../common/ToastNotifications';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
    Search, 
    Filter, 
    User, 
    Mail, 
    Calendar,
    Shield,
    MoreVertical,
    Edit,
    Trash2,
    CheckCircle,
    XCircle
} from 'lucide-react';

const AdminUsers = () => {
    const { getUsers, updateUserRole, deleteUser, loading } = useAdmin();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(timer);
    }, [search, filter]);

    const fetchUsers = async () => {
        try {
            const data = await getUsers({ search, filter });
            setUsers(data);
        } catch (error) {
            showToast.error('Failed to load users');
        }
    };

    const handleRoleChange = async (userId, newRole, currentRole) => {
        // Prevent demoting an admin to user
        if (currentRole === 'ADMIN' && newRole === 'USER') {
            showToast.error('Cannot change an admin user to a regular user role.');
            return;
        }
        try {
            await updateUserRole(userId, newRole);
            showToast.success('User role updated successfully');
            fetchUsers();
        } catch (error) {
            showToast.error(error?.response?.data?.message || 'Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                showToast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                showToast.error('Failed to delete user');
            }
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                User Management
            </h3>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-input pl-10"
                        placeholder="Search users..."
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="form-input sm:w-48"
                >
                    <option value="all">All Users</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                    <option value="new_7_days">New Users (Last 7 Days)</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                User
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Email
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Role
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Status
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Joined
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                                            {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {user.fullName || 'Unknown'}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                    {user.email}
                                </td>
                                <td className="py-3 px-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value, user.role)}
                                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        disabled={user.role === 'ADMIN'}
                                        title={user.role === 'ADMIN' ? 'Cannot change admin role' : ''}
                                    >
                                        <option value="USER">User</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </td>
                                <td className="py-3 px-4">
                                    {user.isVerified ? (
                                        <span className="flex items-center space-x-1 text-green-500">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="text-xs">Verified</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center space-x-1 text-red-500">
                                            <XCircle className="w-4 h-4" />
                                            <span className="text-xs">Unverified</span>
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">No users found</p>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;