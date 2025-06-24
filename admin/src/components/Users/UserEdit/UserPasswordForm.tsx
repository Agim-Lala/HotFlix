import React, { useRef, useState } from "react";
import { Input, Button, InputRef, App, Form } from "antd";
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
  const { message } = App.useApp();
  const [passwordForm] = Form.useForm();

  const handleSubmit = async () => {
    const values = passwordForm.getFieldsValue();
    const { oldPassword, newPassword, confirmPassword } = values;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return message.error("Please fill in all fields.");
    }

    if (newPassword !== confirmPassword) {
      return message.error(
        "New password and confirmation of the new password do not match."
      );
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
      setTimeout(() => setSuccess(""), 3000);
      passwordForm.resetFields();
    } catch (error) {
      console.error("Change password failed:", error);
      message.error("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={passwordForm}
      onFinish={handleSubmit}
      className={styles.passwordForm}
    >
      <h3>Change Password</h3>
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <p>Old Password</p>
          <Form.Item name="oldPassword" rules={[{ required: true }]}>
            <Input.Password
              className={styles.halfWidthInput}
              placeholder="Old Password"
              ref={oldRef}
            />
          </Form.Item>
        </div>
        <div className={styles.inputGroup}>
          <p>New Password</p>
          <Form.Item name="newPassword" rules={[{ required: true }]}>
            <Input.Password
              className={styles.halfWidthInput}
              placeholder="New Password"
              ref={newRef}
            />
          </Form.Item>
        </div>
      </div>
      <div className={styles.inputGroup}>
        <p>Confirm New Password</p>
        <Form.Item name="confirmPassword" rules={[{ required: true }]}>
          <Input.Password
            className={styles.halfWidthInput}
            placeholder="Confirm New Password"
            ref={confirmRef}
          />
        </Form.Item>
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
    </Form>
  );
};

export default UserPasswordForm;
