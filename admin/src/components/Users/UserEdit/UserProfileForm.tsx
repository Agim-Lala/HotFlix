import React, { useState } from 'react';
import { Input, Select, Button, message } from 'antd';
import { User,updateUserProfile } from '../../../api/userApi';
import { useEffect } from 'react';
import styles from './UserProfileForm.module.css'; 


interface UserProfileFormProps {
  user: User;
  userId: number;
  onSave: (updatedUser: User) => void;
}
 const UserProfileForm: React.FC<UserProfileFormProps> = ({ user,userId, onSave }) => {
   const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    subscriptionPlanId: user.subscriptionPlanId || 1, 
  });
  

 
 useEffect(() => {
  if (user) {
    setFormData({
      username: user.username || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role:user.role || 'user', 
      subscriptionPlanId: user.subscriptionPlanId || 1,
    });
  }
}, [user]);

  const handleChange = (key: keyof User, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await updateUserProfile(userId, formData);
      setSuccess('Profile updated!');
      onSave({ ...user, ...formData });
    } catch {
      message.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
     <form onSubmit={handleSubmit} className={styles.profileForm}>
      <h3>Profile Details</h3>

      <div className={styles.row}>
        <div>
          <p>Username</p>
          <Input
            placeholder="Username"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
          />
        </div>
        <div>
          <p>Email</p>
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div>
          <p>First Name</p>
          <Input
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </div>
        <div>
          <p>Last Name</p>
          <Input
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div>
          <p>Subscription</p>
          <Select
            style={{ width: '100%' }}
            value={formData.subscriptionPlanId}
            onChange={(value) => handleChange('subscriptionPlanId', value)}
          >
            <Select.Option value={1}>Free</Select.Option>
            <Select.Option value={2}>Basic</Select.Option>
            <Select.Option value={3}>Premium</Select.Option>
          </Select>
        </div>

        <div>
          <p>Role</p>
          <Select
            className={styles.tallSelect}
            value={formData.role}
            onChange={(val) => handleChange('role', val as 'user' | 'admin')}
          >
            <Select.Option value="customer">Customer</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
          </Select>
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          htmlType="submit"
          loading={loading}
          className={`${styles.fullWidth} ${styles.saveButton}`}
        >
          Save
        </Button>
        {success && <span className={styles.successMessage}>{success}</span>}
      </div>
    </form>

  );
};

export default UserProfileForm;

