import React, { useRef, useState } from "react";
import { Input, Button, message } from "antd";
import type { InputRef } from "antd";
import styles from "./UserPasswordForm.module.css";
import { updateUserPassword } from "../../../api/userApi";

interface UserPasswordFormProps {
  userId: number;
}

const UserPasswordForm: React.FC<UserPasswordFormProps> = ({ userId }) => {
  const oldRef = useRef<InputRef>(null);
  const newRef = useRef<InputRef>(null);
  const confirmRef = useRef<InputRef>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const oldPassword = oldRef.current?.input?.value || "";
    const newPassword = newRef.current?.input?.value || "";
    const confirmPassword = confirmRef.current?.input?.value || "";

    if (!oldPassword || !newPassword || !confirmPassword) {
      return message.error("Please fill in all fields.");
    }

    if (newPassword !== confirmPassword) {
      return message.error("New passwords do not match.");
    }

    setLoading(true);
    try {
      await updateUserPassword(
        userId,
        oldPassword,
        newPassword,
        confirmPassword
      );
      setSuccess("Password updated!");
      if (oldRef.current) oldRef.current.input!.value = "";
      if (newRef.current) newRef.current.input!.value = "";
      if (confirmRef.current) confirmRef.current.input!.value = "";
    } catch (error) {
      console.error("Change password failed:", error);
      message.error("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.passwordForm}>
      <h3>Change Password</h3>
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <p>Old Password</p>
          <Input.Password
            className={styles.halfWidthInput}
            placeholder="Old Password"
            ref={oldRef}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <p>New Password</p>
          <Input.Password
            className={styles.halfWidthInput}
            placeholder="New Password"
            ref={newRef}
            required
          />
        </div>
      </div>
      <div className={styles.inputGroup}>
        <p>Confirm New Password</p>
        <Input.Password
          className={styles.halfWidthInput}
          placeholder="Confirm New Password"
          ref={confirmRef}
          required
        />
      </div>
      <div className={styles.footer}>
        <Button
          className={styles.saveButton}
          htmlType="submit"
          loading={loading}
        >
          Change
        </Button>
        {success && <p className={styles.successMessage}>{success}</p>}
      </div>
    </form>
  );
};

export default UserPasswordForm;
